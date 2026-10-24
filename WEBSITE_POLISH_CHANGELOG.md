# ASTRON Website Polish Changelog

## Source and scope
- Updated the existing `index.html`, `style.css`, and `script.js` in place.
- Kept the existing site structure, release ZIPs, server folder, pricing/payment forms, download paths, and existing sections.

## Changes
- Added a responsive mobile navigation toggle with accessible labels, `aria-expanded`, Escape-to-close, and close-on-link behavior.
- Mobile navigation uses a compact Get Started CTA and hides the two wide desktop nav buttons.
- Applied a consistent electric-blue/cyan accent palette across the existing page styling.
- Replaced unsupported-looking live metrics (uptime, command count, voice accuracy, response time) with feature-status labels instead of presenting unverified numbers as measured facts.
- Clarified that the command demo is an illustrative simulation and does not control the visitor's PC.
- Added reduced-motion handling and improved mobile layout for the compatibility panel.

## Verification
- Parsed the HTML with Python's standard HTMLParser successfully.
- `node --check script.js` passed when Node.js is available.
- ZIP integrity checked after packaging.
- This is static-source validation only; it does not claim cross-browser or Windows runtime testing.

## Rollback
Restore `index.html`, `style.css`, and `script.js` from the original `ASTRON_Website_Android_Link_Fixed.zip`.
