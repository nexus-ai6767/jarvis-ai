'use strict';
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = Number(process.env.PORT || 3000);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'private-data');
const PRODUCT_ZIP = process.env.PRODUCT_ZIP || path.join(DATA_DIR, 'astron-pro-windows.zip');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SITE_ORIGIN = process.env.SITE_ORIGIN || '';
if (!ADMIN_TOKEN || ADMIN_TOKEN.length < 24) { console.error('Set ADMIN_TOKEN to a random secret of at least 24 characters.'); process.exit(1); }
fs.mkdirSync(DATA_DIR, {recursive:true});
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]', {mode:0o600});
app.disable('x-powered-by'); app.use(helmet()); app.use(express.json({limit:'12kb'}));
app.use('/api/', rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:true,legacyHeaders:false}));
function load(){try{return JSON.parse(fs.readFileSync(ORDERS_FILE,'utf8'));}catch{throw new Error('Order storage is unavailable');}}
function save(orders){const tmp=ORDERS_FILE+'.tmp';fs.writeFileSync(tmp,JSON.stringify(orders,null,2),{mode:0o600});fs.renameSync(tmp,ORDERS_FILE);}
function clean(s,n=254){return typeof s==='string'?s.trim().slice(0,n):'';}
function validEmail(s){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);}
function admin(req,res,next){const got=req.get('x-admin-token')||'';if(!crypto.timingSafeEqual(Buffer.from(got.padEnd(ADMIN_TOKEN.length,'\0').slice(0,ADMIN_TOKEN.length)),Buffer.from(ADMIN_TOKEN))||got.length!==ADMIN_TOKEN.length)return res.status(401).json({error:'Admin authentication failed'});next();}
app.post('/api/orders',(req,res)=>{
 const buyerName=clean(req.body.buyerName,100),email=clean(req.body.email).toLowerCase(),payerName=clean(req.body.payerName,100),utr=clean(req.body.utr,80).replace(/\s/g,'').toUpperCase();
 if(!buyerName||!validEmail(email)||! /^[A-Z0-9-]{8,80}$/.test(utr)||req.body.amountConfirmed!==true)return res.status(400).json({error:'Enter valid details and confirm that ₹950 was paid.'});
 const orders=load();if(orders.some(o=>o.utr===utr))return res.status(409).json({error:'That transaction reference has already been submitted.'});
 const order={orderId:crypto.randomBytes(9).toString('hex').toUpperCase(),buyerName,email,payerName,utr,amount:950,currency:'INR',status:'pending',createdAt:new Date().toISOString(),reviewedAt:null,downloadToken:null,downloadTokenExpiresAt:null};
 orders.push(order);save(orders);res.status(201).json({orderId:order.orderId,status:order.status});
});
app.post('/api/orders/status',(req,res)=>{
 const orderId=clean(req.body.orderId,40).toUpperCase(),email=clean(req.body.email).toLowerCase();const o=load().find(x=>x.orderId===orderId&&x.email===email);if(!o)return res.status(404).json({error:'Order not found. Check the order reference and email.'});
 if(o.status!=='approved')return res.json({status:o.status});
 if(!fs.existsSync(PRODUCT_ZIP))return res.status(503).json({error:'The product ZIP has not been installed on the server yet.'});
 const now=Date.now();let orders=load();let current=orders.find(x=>x.orderId===orderId);if(!current.downloadToken||!current.downloadTokenExpiresAt||Date.parse(current.downloadTokenExpiresAt)<now){current.downloadToken=crypto.randomBytes(32).toString('hex');current.downloadTokenExpiresAt=new Date(now+15*60*1000).toISOString();save(orders);}
 res.json({status:'approved',downloadUrl:'/api/download/'+current.downloadToken,expiresAt:current.downloadTokenExpiresAt});
});
app.get('/api/download/:token',(req,res)=>{
 const token=clean(req.params.token,100);if(!/^[a-f0-9]{64}$/.test(token))return res.status(404).send('Download link is invalid or expired.');
 const orders=load(),o=orders.find(x=>x.status==='approved'&&x.downloadToken===token&&x.downloadTokenExpiresAt&&Date.parse(x.downloadTokenExpiresAt)>Date.now());
 if(!o)return res.status(404).send('Download link is invalid or expired. Check your order status to request a fresh link.');
 if(!fs.existsSync(PRODUCT_ZIP))return res.status(503).send('Product ZIP is not configured on the server.');
 res.download(PRODUCT_ZIP,'ASTRON-Pro-Windows.zip',err=>{if(err&&!res.headersSent)res.status(500).end('Download failed.');});
});
app.get('/api/admin/orders',admin,(req,res)=>{res.json(load().map(({downloadToken,...o})=>o));});
app.post('/api/admin/orders/:id/approve',admin,(req,res)=>{
 if(!fs.existsSync(PRODUCT_ZIP))return res.status(503).json({error:'Install the private product ZIP before approving orders.'});
 const orders=load(),o=orders.find(x=>x.orderId===clean(req.params.id,40).toUpperCase());if(!o)return res.status(404).json({error:'Order not found.'});o.status='approved';o.reviewedAt=new Date().toISOString();o.downloadToken=null;o.downloadTokenExpiresAt=null;save(orders);res.json({orderId:o.orderId,status:o.status});
});
app.post('/api/admin/orders/:id/reject',admin,(req,res)=>{const orders=load(),o=orders.find(x=>x.orderId===clean(req.params.id,40).toUpperCase());if(!o)return res.status(404).json({error:'Order not found.'});o.status='rejected';o.reviewedAt=new Date().toISOString();o.downloadToken=null;o.downloadTokenExpiresAt=null;save(orders);res.json({orderId:o.orderId,status:o.status});});
app.get('/api/health',(req,res)=>res.json({ok:true}));
if(SITE_ORIGIN)app.use((req,res,next)=>{res.setHeader('Access-Control-Allow-Origin',SITE_ORIGIN);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type,X-Admin-Token');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');if(req.method==='OPTIONS')return res.sendStatus(204);next();});
app.listen(PORT,()=>console.log(`ASTRON payment service listening on ${PORT}`));
