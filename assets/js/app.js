/**
 * Portfolio - Glavna aplikacija
 * Miha Knific — Magister kognitivne znanosti
 * Celozaslonski prehod med 7 sekcijami z neskončnim ciklom in interaktivnimi animacijami
 */

gsap.registerPlugin(ScrollTrigger);

const isPointerFine = window.matchMedia('(pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * OPOMBA ZA KASNEJE (IDEJA ZA TESTIRANJE):
 * Trenutno želimo preizkusiti, ali GSAP deluje povsod (tudi na mobilnih napravah in ob zmanjšanju širine).
 * Če bi kasneje želeli blokado celozaslonskega prehoda SAMO za mobilne telefone in tablice (brez vpliva na prenosnike s touchscreenom):
 *   const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (!isPointerFine && window.innerWidth <= 768);
 * Mobilni način je omejen na majhne naprave brez natančnega kazalca.
 */
const isMobile = !isPointerFine && window.innerWidth <= 768;

// --- 1. INTRO ANIMACIJA (HERO) ---
gsap.set('.hero-background-visual', { autoAlpha: 0 });
gsap.set('.hero-light-sweep', { autoAlpha: 0, x: "-65vw", skewX: -18 });
gsap.set('.hero-header', { autoAlpha: 0, pointerEvents: "none" });
gsap.set('.nav-dots', { autoAlpha: 0, y: -150 });
gsap.set('.hero__suggest', { autoAlpha: 1 });
gsap.set('.hero__suggest-outer', { scaleY: 0, transformOrigin: "top center" });
gsap.set('.hero__suggest-inner', { autoAlpha: 0, scale: 0 });
gsap.set('.hero__suggest-text', { autoAlpha: 0, y: 15 });

function splitTextIntoChars(selector) {
    const elements = document.querySelectorAll(selector);

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text.trim()) return;

            const fragment = document.createDocumentFragment();
            const chars = text.split('');
            chars.forEach(char => {
                if (char === ' ') {
                    fragment.appendChild(document.createTextNode(' '));
                } else {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.style.display = 'inline-block';
                    span.textContent = char;
                    fragment.appendChild(span);
                }
            });
            node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(processNode);
        }
    }

    elements.forEach(el => processNode(el));
}

// Razreši .split-chars pred začetkom animacij
splitTextIntoChars('.split-chars, .magnetic-text');

function runIntroAnimation() {
    const heroHeader = document.querySelector('.hero-header');
    const heroH1 = document.querySelector('.hero-header h1');
    const heroH2 = document.querySelector('.hero-header h2');
    const heroBg = document.querySelector('.hero-background-visual');
    const heroLightSweep = document.querySelector('.hero-light-sweep');
    const navDotsContainer = document.querySelector('.nav-dots');

    if (!heroHeader || !heroBg) return;

    const heroChars = heroHeader.querySelectorAll('.char');

    if (prefersReducedMotion) {
        gsap.set(heroHeader, { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: "none", pointerEvents: "auto" });
        gsap.set(heroChars, { opacity: 0.6, clearProps: "transform" });
        gsap.set(heroBg, { autoAlpha: 1, scale: 1, y: 0, filter: "contrast(1.05) brightness(1.2) blur(0px)" });
        gsap.set(navDotsContainer, { autoAlpha: 1, y: 0 });
        gsap.set('.hero__suggest-outer', { scaleY: 1 });
        gsap.set('.hero__suggest-inner', { autoAlpha: 1, scale: 1 });
        gsap.set('.hero__suggest-text', { autoAlpha: 1, y: 0 });
        return;
    }

    if (isMobile) {
        const introTl = gsap.timeline({
            defaults: { ease: "power2.out" },
            onComplete: () => {
                gsap.set(heroHeader, { pointerEvents: "auto" });
                gsap.set(heroChars, { opacity: 0.6 });
            }
        });

        introTl
            .set(heroHeader, { autoAlpha: 1 })
            .to(heroBg, { autoAlpha: 1, duration: 1 }, 0)
            .to(heroChars, { opacity: 1, duration: 1, stagger: 0.03 }, 0)
            .to(heroChars, { opacity: 0.6, duration: 0.8 }, "+=0.3")
            .to(navDotsContainer, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.4)
            .to('.hero__suggest-outer', { scaleY: 1, duration: 0.5 }, 0.5)
            .to('.hero__suggest-inner', { autoAlpha: 1, scale: 1, duration: 0.4 }, 0.7)
            .to('.hero__suggest-text', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.8);
        return;
    }

    // Izračun odklona do središča zaslona
    const rect = heroHeader.getBoundingClientRect();
    const xOffset = (window.innerWidth / 2) - (rect.left + rect.width / 2);
    const yOffset = (window.innerHeight / 2) - (rect.top + rect.height / 2);

    const introTl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
            gsap.set(heroHeader, { clearProps: "transform,x,y,filter,pointerEvents" });
            gsap.set([heroH1, heroH2], { clearProps: "letterSpacing,y" });
            gsap.set(heroChars, { opacity: 0.6 });
        }
    });

    introTl
        // --- ZAČETNA STANJA ---
        .set(heroHeader, {
            x: xOffset,
            y: yOffset,
            autoAlpha: 1,
            scale: 1.2,
            filter: "blur(15px)",
            transformOrigin: "center center",
            perspective: 1000
        })
        .set(heroChars, {
            opacity: 0,
            scale: "random(0.5, 10)",
            x: "random(-1000, 1000)",
            y: "random(-500, 500)",
            z: "random(200, 1200)",
            rotationX: "random(-360, 360)",
            rotationY: "random(-360, 360)",
            rotationZ: "random(-180, 180)"
        })
        .set(heroBg, {
            autoAlpha: 0,
            scale: 3.5,
            y: 0,
            filter: "contrast(1.3) brightness(2.5) blur(25px)",
            transformOrigin: "center center",
            force3D: true
        })

        // --- SVETLOBNI ŽAREK ČEZ SLIKO (DOLG, GLADEK PRELET Z LEVE ZGORAJ PROTI DESNI DOL) ---
        .set(heroLightSweep, {
            x: "-65vw",
            skewX: -18,
            autoAlpha: 0
        }, "start")
        .to(heroLightSweep, {
            autoAlpha: 0.95,
            duration: 0.25,
            ease: "none"
        }, "start+=0.1")
        .to(heroLightSweep, {
            x: "125vw",
            duration: 2.8,
            ease: "power2.inOut"
        }, "start+=0.1")
        .to(heroLightSweep, {
            autoAlpha: 0,
            duration: 0.45,
            ease: "power2.out"
        }, "start+=2.45")

        // --- FAZA 2: NEPOSREDEN DEZOOM Z IZOSTRITVIJO ---
        .to(heroBg, {
            autoAlpha: 1,
            scale: 1,
            filter: "contrast(1.05) brightness(1.2) blur(0px)",
            duration: 3.2,
            ease: "power3.out",
            force3D: true
        }, "start+=0.1")

        // --- FAZA 2b: TEKST SE ZBIRA IZ KAOSA ---
        .to(heroHeader, {
            scale: 1,
            filter: "blur(0px)",
            duration: 1.8,
            ease: "power3.out",
            force3D: true
        }, "start+=0.3")
        .to(heroChars, {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            duration: 2.8,
            stagger: {
                each: 0.018,
                from: "random"
            },
            ease: "expo.out",
            force3D: true
        }, "start+=0.15")

        // --- FAZA 3: UMIRITEV IN PREMIK NA MESTO ---
        .set(heroHeader, { pointerEvents: "auto" }, "start+=2.8")
        .to(heroHeader, {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 2.2,
            ease: "power3.inOut"
        }, "start+=2.0")
        .to(heroChars, {
            opacity: 0.6,
            duration: 2.4,
            ease: "power2.inOut"
        }, "start+=2.8")

        // --- UI ELEMENTI ---
        .to('.hero__suggest-outer', {
            scaleY: 1,
            duration: 0.6,
            ease: "power2.out"
        }, "start+=4.0")
        .to('.hero__suggest-inner', {
            autoAlpha: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(2)"
        }, "start+=4.4")
        .to('.hero__suggest-text', {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, "start+=4.5")
        .to(navDotsContainer, {
            autoAlpha: 1,
            y: 0,
            duration: 1.8,
            ease: "bounce.out"
        }, "start+=4.6");
}

// --- 2. 3D SPLIT-FLAP & SPOTLIGHT TEXT LOGIC ---
const flipHeaders = document.querySelectorAll('.magnetic-text');
flipHeaders.forEach(header => gsap.set(header, { perspective: 800 }));

const allHeaderChars = [];
flipHeaders.forEach(header => {
    header.querySelectorAll('.char').forEach(c => allHeaderChars.push(c));
});

let headerLeaveTimeout = null;
let isHeaderAnimating = false;

const triggerHeaderAnimation = () => {
    if (headerLeaveTimeout) {
        clearTimeout(headerLeaveTimeout);
        headerLeaveTimeout = null;
    }
    if (isHeaderAnimating) return;
    isHeaderAnimating = true;

    gsap.set(allHeaderChars, { opacity: 0.6 });

    gsap.to(allHeaderChars, {
        rotationX: "+=360",
        z: 20,
        duration: 0.8,
        stagger: 0.03,
        ease: "back.out(1.5)",
        overwrite: "auto"
    });

    if (window.matchMedia("(pointer: coarse)").matches) {
        setTimeout(() => resetHeaderAnimation(), 2000);
    }
};

const resetHeaderAnimation = () => {
    isHeaderAnimating = false;
    gsap.to(allHeaderChars, {
        rotationX: 0,
        z: 0,
        opacity: 0.6,
        textShadow: "none",
        duration: 0.6,
        stagger: 0.02,
        ease: "power2.out",
        overwrite: "auto"
    });
};

const handleHeaderLeave = () => {
    headerLeaveTimeout = setTimeout(() => {
        headerLeaveTimeout = null;
        resetHeaderAnimation();
    }, 50);
};

if (isPointerFine) {
    flipHeaders.forEach(header => {
        header.addEventListener('mouseenter', triggerHeaderAnimation);
        header.addEventListener('click', triggerHeaderAnimation);

        header.addEventListener('mousemove', (e) => {
            allHeaderChars.forEach(char => {
                const rect = char.getBoundingClientRect();
                const charCenterX = rect.left + rect.width / 2;
                const charCenterY = rect.top + rect.height / 2;

                const distX = e.clientX - charCenterX;
                const distY = e.clientY - charCenterY;
                const distance = Math.sqrt(distX * distX + distY * distY);

                const effectRange = 450;
                if (distance < effectRange) {
                    const strength = (effectRange - distance) / effectRange;
                    gsap.to(char, {
                        opacity: 0.6 + (0.4 * strength),
                        textShadow: `0px 0px ${10 * strength}px rgba(255,255,255,0.25)`,
                        duration: 0.1,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                } else {
                    gsap.to(char, {
                        opacity: 0.6,
                        textShadow: "none",
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            });
        });

        header.addEventListener('mouseleave', handleHeaderLeave);
    });
}

// --- 3. CELOZASLONSKA NAVIGACIJA & PREHODI (4 SEKCIJE) ---
const sections = gsap.utils.toArray("section");
const navDots = gsap.utils.toArray(".nav-dots a");
let currentIndex = 0;
let isAnimating = false;
let pendingKeyboardFocus = null;

gsap.set(sections[0], { autoAlpha: 1, zIndex: 1 });
sections.slice(1).forEach(section => {
    gsap.set(section, { opacity: 0.001, visibility: "visible", zIndex: 0 });
});

function updateNavDots(index) {
    navDots.forEach(dot => dot.classList.remove("active"));
    if (navDots[index]) {
        navDots[index].classList.add("active");
    }
}

function goToSection(newIndex, direction, instant = false) {
    if (isAnimating) return;
    instant = instant || prefersReducedMotion;

    // Neskončni zankasti wrap med vsemi sekcijami (0 <-> 3)
    const wrappedIndex = gsap.utils.wrap(0, sections.length, newIndex);
    if (wrappedIndex === currentIndex) return;

    updateNavDots(wrappedIndex);
    isAnimating = true;

    const currentSection = sections[currentIndex];
    const nextSection = sections[wrappedIndex];

    const contactSectionIndex = sections.length - 1;
    if (window.interactiveGrid) {
        if (wrappedIndex === contactSectionIndex) {
            window.interactiveGrid.resume();
        } else if (currentIndex === contactSectionIndex) {
            window.interactiveGrid.pause();
        }
    }

    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
            currentIndex = wrappedIndex;
            gsap.set([currentSection, nextSection], { clearProps: "willChange" });

            if (pendingKeyboardFocus && nextSection.contains(pendingKeyboardFocus)) {
                pendingKeyboardFocus.focus({ preventScroll: true });
                pendingKeyboardFocus = null;
            }
        }
    });

    gsap.set([currentSection, nextSection], { willChange: "transform" });

    gsap.set(nextSection, {
        autoAlpha: 1,
        zIndex: 2,
        yPercent: direction * 100
    });

    if (pendingKeyboardFocus && nextSection.contains(pendingKeyboardFocus)) {
        pendingKeyboardFocus.focus({ preventScroll: true });
    }

    const isTouchDevice = !isPointerFine || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 1024;
    const transitionDuration = isTouchDevice ? 1.25 : 0.9;
    const transitionEase = isTouchDevice ? "power2.inOut" : "power3.inOut";

    tl.to(currentSection, {
        yPercent: direction * -100,
        duration: transitionDuration,
        ease: transitionEase
    }, 0)
    .fromTo(nextSection,
        { yPercent: direction * 100 },
        {
            yPercent: 0,
            duration: transitionDuration,
            zIndex: 2,
            ease: transitionEase
        }, 0);

    if (nextSection.id === "philosophy") {
        const philHeader = nextSection.querySelector('.philosophy-header');
        const philQuote = nextSection.querySelector('.editorial-quote');
        const philParas = nextSection.querySelectorAll('.editorial-intro p');
        const swissItems = nextSection.querySelectorAll('.swiss-item');
        const swissTags = nextSection.querySelectorAll('.swiss-tag');
        const techBar = nextSection.querySelector('.editorial-tech-bar');
        const techItems = nextSection.querySelectorAll('.editorial-tech-bar span:not(.tech-sep):not(.tech-bar-label)');

        gsap.set(philHeader, { autoAlpha: 0, y: -20 });
        gsap.set(philQuote, { autoAlpha: 0, x: -25 });
        gsap.set(philParas, { autoAlpha: 0, y: 20 });
        gsap.set(swissItems, { autoAlpha: 0, x: 30 });
        gsap.set(swissTags, { autoAlpha: 0, scale: 0.85 });
        gsap.set(techBar, { autoAlpha: 0, y: 20 });
        gsap.set(techItems, { autoAlpha: 0, y: 8, scale: 0.95 });

        tl.to(philHeader, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.45")
        .to(philQuote, {
            autoAlpha: 1,
            x: 0,
            duration: 0.65,
            ease: "power3.out"
        }, "-=0.4")
        .to(philParas, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.45")
        .to(swissItems, {
            autoAlpha: 1,
            x: 0,
            duration: 0.65,
            stagger: 0.09,
            ease: "power3.out"
        }, "-=0.55")
        .to(swissTags, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(2)"
        }, "-=0.4")
        .to(techBar, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.35")
        .to(techItems, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.02,
            ease: "back.out(1.5)"
        }, "-=0.3");
    } else {
        const nextContent = nextSection.querySelectorAll('.section-header, .unified-header, .card, .editorial-layout, .contact-container');
        if (nextContent.length > 0) {
            gsap.set(nextContent, { autoAlpha: 0, y: 35 });

            tl.to(nextContent, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: "power2.out"
            }, "-=0.4");
        }
    }

    if (instant) {
        tl.progress(1);
    }
}

let keyboardNavigationActive = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        keyboardNavigationActive = true;
    }
});

document.addEventListener("pointerdown", () => {
    keyboardNavigationActive = false;
}, { passive: true });

document.addEventListener("focusin", (e) => {
    if (!keyboardNavigationActive || isAnimating) return;

    const focusedSection = e.target.closest("section");
    if (!focusedSection) return;

    const focusedIndex = sections.indexOf(focusedSection);
    if (focusedIndex === -1 || focusedIndex === currentIndex) return;

    pendingKeyboardFocus = e.target;
    goToSection(focusedIndex, focusedIndex > currentIndex ? 1 : -1, true);
    keyboardNavigationActive = false;
});

// Ambient Spotlight na 3. sekciji (Filozofija)
const philSectionEl = document.getElementById("philosophy");
if (philSectionEl && isPointerFine) {
    philSectionEl.addEventListener("mousemove", (e) => {
        const rect = philSectionEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        philSectionEl.style.setProperty("--phil-mouse-x", `${x}px`);
        philSectionEl.style.setProperty("--phil-mouse-y", `${y}px`);
        if (!philSectionEl.classList.contains("has-mouse")) {
            philSectionEl.classList.add("has-mouse");
        }
    }, { passive: true });

    philSectionEl.addEventListener("mouseleave", () => {
        philSectionEl.classList.remove("has-mouse");
    }, { passive: true });
}

function handleScroll(direction) {
    if (isAnimating) return;
    goToSection(currentIndex + direction, direction);
}

// 1. Kolešček miške in sledilna ploščica (Trackpad / Mouse Wheel za računalnike)
ScrollTrigger.observe({
    target: window,
    type: "wheel",
    onDown: () => handleScroll(1),
    onUp: () => handleScroll(-1),
    tolerance: 30,
    preventDefault: false
});

// 2. Podpora za dotik (Touch Swipe za telefone in tablice)
let touchStartY = 0;
let touchStartX = 0;

window.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (e) => {
    if (isAnimating) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY - touchEndY; // Pozitivno ob potegu navzgor (scroll down)
    const deltaX = touchStartX - touchEndX;

    // Prag 40px in pretežno navpična os (da ne ovira klikov/tapov ali vodoravnih potez)
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 40) {
        if (deltaY > 0) {
            handleScroll(1); // Poteg navzgor -> naslednja sekcija
        } else {
            handleScroll(-1); // Poteg navzdol -> prejšnja sekcija
        }
    }
}, { passive: true });

// 3. Navigacijske pikice (kliki / tapi delujejo na vseh napravah)
navDots.forEach((dot, i) => {
    dot.addEventListener("click", (e) => {
        e.preventDefault();
        if (i === currentIndex || isAnimating) return;
        goToSection(i, i > currentIndex ? 1 : -1);
    });
});

// 4. Tipkovnica (puščice gor/dol, PageUp/PageDown, preslednica)
document.addEventListener("keydown", (e) => {
    if (isAnimating) return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        e.preventDefault();
        handleScroll(1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        e.preventDefault();
        handleScroll(-1);
    }
});

// 5. Klik / tap na "Scroll" namig v hero sekciji
const heroSuggestEl = document.querySelector(".hero__suggest");
if (heroSuggestEl) {
    heroSuggestEl.style.cursor = "pointer";
    heroSuggestEl.addEventListener("click", () => {
        if (currentIndex === 0 && !isAnimating) {
            handleScroll(1);
        }
    });
}

// --- 4. 3D TILT EFFECT ZA KARTICE IN ZGODBE ---
const interactiveCards = document.querySelectorAll(".card");

interactiveCards.forEach(card => {
    if (!isPointerFine) return;

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 40;
        const rotateY = (centerX - x) / 40;

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            scale: 1.015,
            transformPerspective: 1000,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto"
        });
    });
});

// --- 5. MAGNETNI GUMBI S PODPORO IN BUBBLE UČINKOM ---
const magneticButtons = document.querySelectorAll(".support-btn");

if (isPointerFine) {
    magneticButtons.forEach(btn => {
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

        // Bubble fill effect
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

    // Wiggle opomnik
    if (magneticButtons.length >= 3) {
        let lastWiggleIndex = -1;

        function playWiggle() {
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
            gsap.delayedCall(randomDelay, playWiggle);
        }

        gsap.delayedCall(3, playWiggle);
    }
}

// --- 6. PREMIUM 3D SEGMENTIRAN MAGNETNI EMAIL BLOK ---
function initEmailInteractions() {
    const emailHero = document.querySelector(".email-hero");
    const emailTextEl = document.getElementById("email-text");
    const copyBtn = document.getElementById("copy-email-btn");
    const copyTooltip = document.getElementById("copy-tooltip");

    if (!emailHero || !emailTextEl) return;

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

    if (isPointerFine) {
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
        if (!copyTooltip) return;
        if (success) {
            if (copyBtn) {
                const iconCopy = copyBtn.querySelector('.icon-copy');
                const iconCheck = copyBtn.querySelector('.icon-check');
                if (iconCopy) iconCopy.classList.add('hidden');
                if (iconCheck) iconCheck.classList.remove('hidden');
                copyBtn.classList.add('copied');
                copyBtn.style.borderColor = 'var(--color-white)';
            }
            copyTooltip.textContent = 'USPEŠNO KOPIRANO';
        } else {
            copyTooltip.textContent = 'DESNI KLIK ZA KOPIRANJE';
        }
        copyTooltip.classList.add('show');
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
}

// --- 7. CUSTOM CURSOR LOGIC ---
const cursor = document.getElementById("custom-cursor");

if (cursor && isPointerFine) {
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    document.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        if (cursor.style.opacity !== "1") {
            gsap.to(cursor, { opacity: 1, duration: 0.15 });
        }
    }, { passive: true });

    const hoverElements = document.querySelectorAll("a, button, .interactive, .card, .swiss-item");
    hoverElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("active");
            if (el.classList.contains("card")) {
                cursor.style.setProperty("--cursor-text", "'VIEW'");
            } else {
                cursor.style.setProperty("--cursor-text", "''");
            }
        }, { passive: true });

        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("active");
        }, { passive: true });
    });

    document.addEventListener("mouseleave", () => {
        gsap.to(cursor, { opacity: 0, duration: 0.25 });
    }, { passive: true });
}

// --- 8. ZAGON OB LOAD DOGODKU ---
window.addEventListener('load', () => {
    runIntroAnimation();
    initEmailInteractions();
});