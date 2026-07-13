// favicon-anim.js — Optimiziran, zgoščen in čist krmilnik animacij (Favicon + Naslov zavihka)

(function () {
    'use strict';

    const S = 32, link = document.querySelector('link[rel="icon"]');
    if (!link) return;

    const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    cv.width = cv.height = S;

    const bP = document.createElement('canvas'), cP = bP.getContext('2d');
    const bM = document.createElement('canvas'), cM = bM.getContext('2d');
    bP.width = bP.height = bM.width = bM.height = S;

    const img = new Image();
    img.src = 'assets/images/favicon.png';

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // --- Priprava sličic (Profilna & MK) ---
    function initBuffers() {
        // 1. Profilna slika (krožni izrez)
        cP.beginPath(); cP.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); cP.clip();
        cP.drawImage(img, 0, 0, S, S);

        // 2. Bel krog s črnimi črkami MK
        cM.beginPath(); cM.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
        cM.fillStyle = '#ffffff'; cM.fill();
        cM.fillStyle = '#1a1a1a';
        cM.font = 'bold ' + Math.round(S * 0.48) + 'px "Inter", system-ui, sans-serif';
        cM.textAlign = 'center'; cM.textBaseline = 'middle';
        cM.fillText('MK', S / 2, S / 2 + 1);

        setFavicon(bP);
    }

    function setFavicon(src) {
        ctx.clearRect(0, 0, S, S);
        ctx.drawImage(src, 0, 0);
        link.href = cv.toDataURL('image/png');
    }

    // --- 1. Favicon 360° Spin animacija ---
    function spinHalf(toMK) {
        return new Promise(resolve => {
            const start = performance.now(), ms = 700;
            (function tick(now) {
                const t = Math.min((now - start) / ms, 1);
                const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                ctx.clearRect(0, 0, S, S);
                ctx.save();
                ctx.translate(S / 2, S / 2);
                ctx.rotate(e * Math.PI * 2);
                ctx.drawImage(t < 0.5 ? (toMK ? bP : bM) : (toMK ? bM : bP), -S / 2, -S / 2);
                ctx.restore();
                link.href = cv.toDataURL('image/png');
                if (t < 1) requestAnimationFrame(tick); else resolve();
            })(performance.now());
        });
    }

    async function spinFavicon() {
        await spinHalf(true);
        await sleep(1200);
        await spinHalf(false);
        setFavicon(bP);
    }

    // --- 2. Generatorji in predvajalnik tekstovnih animacij ---
    const playFrames = async (frames, delayMs) => {
        for (const f of frames) { document.title = f; await sleep(delayMs); }
    };

    // A. Scramble Decode (gladka interpolacija dolžine in naključnih znakov)
    function scramble(from, to, ms = 800) {
        const glyphs = '01#@ΣΔΩΠ%*+~§$&=?', start = performance.now();
        return new Promise(resolve => {
            (function tick() {
                const p = Math.min((performance.now() - start) / ms, 1);
                const rev = Math.floor(p * to.length);
                const len = Math.round(from.length + (to.length - from.length) * p);
                let out = '';
                for (let i = 0; i < len; i++) {
                    out += i < rev ? to[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
                }
                document.title = out;
                if (p < 1) setTimeout(tick, 45); else { document.title = to; resolve(); }
            })();
        });
    }

    // B. Avtentični Typewriter (utripanje kurzorja |, človeški ritem tipkanja in brisanja)
    async function blink(text, count = 2) {
        for (let i = 0; i < count; i++) {
            document.title = text + '|';
            await sleep(260);
            document.title = text + ' ';
            await sleep(260);
        }
        document.title = text + '|';
    }

    async function backspace(from) {
        for (let i = from.length - 1; i >= 0; i--) {
            document.title = from.substring(0, i) + '|';
            await sleep(38);
        }
        document.title = '|';
        await sleep(120);
    }

    async function typeText(target) {
        for (let i = 1; i <= target.length; i++) {
            document.title = target.substring(0, i) + '|';
            // Naravni organski ritem tipkanja (med 45ms in 75ms)
            await sleep(55 + (i % 3) * 10);
        }
    }

    // --- 3. Izvedba posameznih načinov ---
    const modes = [
        // 0: Scramble
        async () => {
            await scramble('Miha Knific', 'Portfolio');
            await sleep(1400);
            await scramble('Portfolio', 'Miha Knific');
        },
        // 1: Realistični Typewriter z utripajočim kurzorjem
        async () => {
            await blink('Miha Knific', 2);
            await backspace('Miha Knific');
            await typeText('Portfolio');
            await blink('Portfolio', 2);
            await backspace('Portfolio');
            await typeText('Miha Knific');
            await blink('Miha Knific', 1);
        },
        // 2: ASCII Spinner & Sparkles
        async () => {
            await playFrames(['/', '—', '\\', '|', '/', '—', '\\', '|'].map(s => 'Miha Knific  ' + s), 120);
            await playFrames(['· ✦', '· ✧', '· ★', '· ✦', '· ✧', '·', ''].map(s => s ? 'Miha Knific  ' + s : 'Miha Knific'), 220);
        }
    ];

    // --- 4. Glavni cikel (začetek po 7s, nato vsakih 30s) ---
    let currentMode = 0;
    async function loop() {
        try {
            await spinFavicon();
            await sleep(200);
            await modes[currentMode]();
        } catch (e) {
            console.warn('Animation loop error:', e);
        } finally {
            document.title = 'Miha Knific';
            setFavicon(bP);
            currentMode = (currentMode + 1) % modes.length;
            setTimeout(loop, 10000);
        }
    }

    img.onload = () => {
        initBuffers();
        document.title = 'Miha Knific';
        setTimeout(loop, 7000);
    };

})();
