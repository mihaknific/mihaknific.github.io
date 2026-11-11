// Kontaktna sekcija — animacije in kopiranje

(function () {
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Magnetni gumbi s tekočim prelivom
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll(".support-btn");
        if (!magneticButtons.length) return;

        if (isPointerFine && !prefersReducedMotion) {
            magneticButtons.forEach(btn => {
                // Če je že ovit, preskoči
                if (btn.parentElement && btn.parentElement.classList.contains("magnetic-trigger")) return;

                const innerContent = btn.querySelector(".btn-content");

                const wrapper = document.createElement('div');
                wrapper.className = "magnetic-trigger";
                btn.parentNode.insertBefore(wrapper, btn);
                wrapper.appendChild(btn);

                wrapper.addEventListener("mousemove", (e) => {
                    const rect = wrapper.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    gsap.to(btn, {
                        x: x * 0.6,
                        y: y * 0.6,
                        rotation: x * 0.05,
                        boxShadow: `
                            ${-x * 0.6}px ${-y * 0.6 + 15}px 40px rgba(255, 255, 255, 0.25),
                            inset ${x * 0.3}px ${y * 0.3}px 20px rgba(255, 255, 255, 0.4),
                            inset ${-x * 0.3}px ${-y * 0.3}px 20px rgba(0, 0, 0, 0.6)
                        `,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: "auto"
                    });

                    if (innerContent) {
                        gsap.set(btn, { transformPerspective: 800, transformStyle: "preserve-3d" });

                        gsap.to(innerContent, {
                            x: x * 0.2,
                            y: y * 0.2,
                            rotationX: -y * 0.4,
                            rotationY: x * 0.4,
                            z: 10,
                            duration: 0.3,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                }, { passive: true });

                wrapper.addEventListener("mouseleave", () => {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        boxShadow: "0px 0px 0px rgba(255, 255, 255, 0)",
                        duration: 0.8,
                        ease: "elastic.out(1.2, 0.3)",
                        overwrite: "auto"
                    });

                    if (innerContent) {
                        gsap.to(innerContent, {
                            x: 0,
                            y: 0,
                            rotationX: 0,
                            rotationY: 0,
                            z: 0,
                            duration: 0.8,
                            ease: "elastic.out(1.2, 0.3)",
                            overwrite: "auto"
                        });
                    }
                }, { passive: true });

                // Mehurčkasti preliv ob vstopu
                const bubble = document.createElement('span');
                bubble.classList.add('btn-bubble');
                btn.appendChild(bubble);

                btn.addEventListener('mouseenter', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    gsap.fromTo(bubble,
                        { clipPath: `circle(0px at ${x}px ${y}px)` },
                        {
                            clipPath: `circle(250px at ${x}px ${y}px)`,
                            duration: 0.6,
                            ease: "power2.out",
                            overwrite: "auto"
                        }
                    );
                });

                btn.addEventListener('mouseleave', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    gsap.to(bubble, {
                        clipPath: `circle(0px at ${x}px ${y}px)`,
                        duration: 0.5,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                });
            });

            // Wiggle opomnik (optimiziran z IntersectionObserver in visibilitychange)
            if (magneticButtons.length >= 3) {
                let lastWiggleIndex = -1;
                let wiggleTween = null;
                let isSectionVisible = true;

                function scheduleNextWiggle(delay) {
                    if (wiggleTween) wiggleTween.kill();
                    if (!isSectionVisible || document.hidden) return;
                    wiggleTween = gsap.delayedCall(delay, playWiggle);
                }

                function playWiggle() {
                    if (!isSectionVisible || document.hidden) return;

                    let randomIndex;
                    do {
                        randomIndex = Math.floor(Math.random() * magneticButtons.length);
                    } while (randomIndex === lastWiggleIndex);

                    lastWiggleIndex = randomIndex;
                    const btn = magneticButtons[randomIndex];

                    if (btn && !btn.matches(':hover')) {
                        const tl = gsap.timeline();
                        tl.to(btn, { y: -4, rotation: 3, duration: 0.3, ease: "power2.out" })
                            .to(btn, { y: 0, rotation: 0, duration: 1.5, ease: "elastic.out(1.2, 0.4)" });
                    }

                    const randomDelay = 4 + Math.random() * 3;
                    scheduleNextWiggle(randomDelay);
                }

                // 1. Zaznavanje vidnosti zavihka (ko uporabnik minimizira ali zamenja zavihek)
                document.addEventListener("visibilitychange", () => {
                    if (document.hidden) {
                        if (wiggleTween) wiggleTween.kill();
                    } else if (isSectionVisible) {
                        scheduleNextWiggle(2);
                    }
                });

                // 2. Zaznavanje vidnosti v vidnem polju (ko je uporabnik na drugem delu strani)
                const contactSec = document.getElementById("contact");
                if (contactSec && 'IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            isSectionVisible = entry.isIntersecting;
                            if (isSectionVisible && !document.hidden) {
                                scheduleNextWiggle(2);
                            } else if (wiggleTween) {
                                wiggleTween.kill();
                            }
                        });
                    }, { threshold: 0.1 });
                    observer.observe(contactSec);
                } else {
                    scheduleNextWiggle(3);
                }
            }
        }
    }

    // 3D magnetni nagib in kopiranje e-pošte
    function initEmailInteractions() {
        const emailHeroes = document.querySelectorAll(".email-hero");
        if (!emailHeroes.length) return;

        emailHeroes.forEach(emailHero => {
            const emailTextEl = emailHero.querySelector(".email-text");
            const copyBtn = emailHero.querySelector("button:not(.email-text)");
            const copyTooltip = emailHero.querySelector("#copy-tooltip") || emailHero.querySelector(".copy-tooltip");

            if (!emailHero || !emailTextEl) return;
            if (emailTextEl.dataset.initialized) return;
            emailTextEl.dataset.initialized = "true";

            const emailStr = emailTextEl.textContent.trim() || "miha.devstudio@gmail.com";
            const actionStr = "kopiraj e-pošto";

            emailTextEl.innerHTML = "";

            // 1. Primarna linija (e-poštni naslov)
            const primaryLine = document.createElement("span");
            primaryLine.className = "email-line email-line-primary";
            const primaries = [];

            emailStr.split("").forEach(char => {
                const span = document.createElement("span");
                span.className = "char-primary";
                span.textContent = char === " " ? "\u00A0" : char;
                primaryLine.appendChild(span);
                primaries.push(span);
            });

            // 2. Sekundarna linija (kopiraj e-pošto)
            const secondaryLine = document.createElement("span");
            secondaryLine.className = "email-line email-line-secondary";
            const secondaries = [];

            actionStr.split("").forEach(char => {
                const span = document.createElement("span");
                span.className = "char-secondary";
                span.textContent = char === " " ? "\u00A0" : char;
                secondaryLine.appendChild(span);
                secondaries.push(span);
            });

            emailTextEl.appendChild(primaryLine);
            emailTextEl.appendChild(secondaryLine);

            if (isPointerFine && !prefersReducedMotion) {
                // 3D magnetni nagib celotnega email hero bloka
                emailHero.addEventListener("mousemove", (e) => {
                    const rect = emailHero.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    gsap.to(emailHero, {
                        x: x * 0.08,
                        y: y * 0.08,
                        rotationX: -y * 0.03,
                        rotationY: x * 0.03,
                        duration: 0.4,
                        ease: "power2.out",
                        overwrite: "auto",
                        transformPerspective: 1000
                    });
                }, { passive: true });

                // Sprožitev kaskadnega staggered roll učinka ob vstopu
                emailHero.addEventListener("mouseenter", () => {
                    gsap.to(primaries, {
                        yPercent: -100,
                        duration: 0.5,
                        stagger: 0.01,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                    gsap.to(secondaries, {
                        yPercent: -100,
                        duration: 0.5,
                        stagger: 0.01,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                });

                // Povratek ob izhodu miške
                emailHero.addEventListener("mouseleave", () => {
                    gsap.to(emailHero, {
                        x: 0,
                        y: 0,
                        rotationX: 0,
                        rotationY: 0,
                        duration: 1.2,
                        ease: "elastic.out(1, 0.4)",
                        overwrite: "auto"
                    });

                    gsap.to(primaries, {
                        yPercent: 0,
                        duration: 0.5,
                        stagger: 0.01,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                    gsap.to(secondaries, {
                        yPercent: 0,
                        duration: 0.5,
                        stagger: 0.01,
                        ease: "power3.inOut",
                        overwrite: "auto"
                    });
                });
            }

            let copyResetTimeout;

            function resetCopyState() {
                if (copyResetTimeout) clearTimeout(copyResetTimeout);
                if (copyTooltip) copyTooltip.classList.remove('show');
                if (copyBtn) {
                    const iconCopy = copyBtn.querySelector('.icon-copy');
                    const iconCheck = copyBtn.querySelector('.icon-check');
                    if (iconCopy) iconCopy.classList.remove('hidden');
                    if (iconCheck) iconCheck.classList.add('hidden');
                    copyBtn.classList.remove('copied');
                    copyBtn.style.borderColor = '';
                }
            }

            function showCopyState(success) {
                if (success) {
                    if (copyBtn) {
                        const iconCopy = copyBtn.querySelector('.icon-copy');
                        const iconCheck = copyBtn.querySelector('.icon-check');
                        if (iconCopy) iconCopy.classList.add('hidden');
                        if (iconCheck) {
                            iconCheck.classList.remove('hidden');
                            if (!prefersReducedMotion) {
                                gsap.fromTo(iconCheck,
                                    { scale: 0.4, rotation: -20 },
                                    { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)", overwrite: "auto" }
                                );
                            }
                        }
                        copyBtn.classList.add('copied');
                        copyBtn.style.borderColor = 'var(--color-white)';
                    }
                    if (copyTooltip) {
                        copyTooltip.textContent = 'USPEŠNO KOPIRANO';
                        copyTooltip.classList.add('show');
                    }
                } else {
                    if (copyTooltip) {
                        copyTooltip.textContent = 'DESNI KLIK ZA KOPIRANJE';
                        copyTooltip.classList.add('show');
                    }
                }
                copyResetTimeout = setTimeout(resetCopyState, 2000);
            }

            function handleCopy() {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(emailStr)
                        .then(() => showCopyState(true))
                        .catch(() => showCopyState(false));
                } else {
                    try {
                        const textarea = document.createElement('textarea');
                        textarea.value = emailStr;
                        textarea.style.position = 'fixed';
                        textarea.style.left = '-9999px';
                        document.body.appendChild(textarea);
                        textarea.focus();
                        textarea.select();
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textarea);
                        showCopyState(successful);
                    } catch (err) {
                        showCopyState(false);
                    }
                }
            }

            if (emailTextEl) emailTextEl.addEventListener('click', handleCopy);
            if (copyBtn) copyBtn.addEventListener('click', handleCopy);
        });
    }

    // Inicializacija funkcij
    function init() {
        if (typeof gsap === 'undefined') {
            console.warn("GSAP ni naložen za kontaktne animacije.");
            return;
        }
        initMagneticButtons();
        initEmailInteractions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Izpostavi za morebitni ponovni zagon
    window.initPortfolioContact = init;
})();
