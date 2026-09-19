document.addEventListener('DOMContentLoaded', () => {
    // Target: 19 October 2026, 00:00:00 IST
    const TARGET_DATE_IST = new Date("2026-10-19T00:00:00+05:30").getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownGridEl = document.getElementById('countdown-display');
    const birthdayMsgEl = document.getElementById('birthday-message');
    const istClockEl = document.getElementById('current-ist-time');
    const terminalLog = document.getElementById('terminalLog');

    const pad = (num) => String(num).padStart(2, '0');

    const addLog = (msg) => {
        if (terminalLog) {
            const p = document.createElement('p');
            p.className = 'log-entry';
            p.textContent = `> ${msg}`;
            terminalLog.appendChild(p);
            terminalLog.scrollTop = terminalLog.scrollHeight;
        }
    };

    function updateISTClock() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Kolkata',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
        if (istClockEl) {
            istClockEl.textContent = `IST ${timeStr}`;
        }
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = TARGET_DATE_IST - now;

        if (difference <= 0) {
            if (countdownGridEl) countdownGridEl.classList.add('hidden');
            if (birthdayMsgEl) birthdayMsgEl.classList.remove('hidden');
        } else {
            if (countdownGridEl) countdownGridEl.classList.remove('hidden');
            if (birthdayMsgEl) birthdayMsgEl.classList.add('hidden');

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            updateDigit(daysEl, pad(days));
            updateDigit(hoursEl, pad(hours));
            updateDigit(minutesEl, pad(minutes));
            updateDigit(secondsEl, pad(seconds));
        }
    }

    function updateDigit(element, newValue) {
        if (!element) return;
        if (element.textContent !== newValue) {
            element.textContent = newValue;
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1.0)';
            }, 150);
        }
    }

    window.triggerJarvisVoice = function() {
        addLog("Voice protocol initiated...");
        if ('speechSynthesis' in window) {
            const now = new Date().getTime();
            const diff = TARGET_DATE_IST - now;
            let speechText = "";
            if (diff <= 0) {
                speechText = "Happy Birthday! J.A.R.V.I.S. is online and fully operational.";
            } else {
                const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
                speechText = `Greeting Sir. Birthday directive active. ${daysLeft} days remaining until October 19th 2026.`;
            }
            const utterance = new SpeechSynthesisUtterance(speechText);
            utterance.rate = 0.95;
            utterance.pitch = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const arcReactor = document.getElementById('arcReactor');
    if (arcReactor) {
        arcReactor.addEventListener('click', () => {
            addLog("Arc Reactor energy pulse triggered.");
            arcReactor.style.transform = 'scale(1.2)';
            setTimeout(() => { arcReactor.style.transform = 'scale(1)'; }, 300);
        });
    }

    updateISTClock();
    updateCountdown();
    setInterval(updateISTClock, 1000);
    setInterval(updateCountdown, 1000);

    addLog("Countdown directive synchronized with IST servers.");
});