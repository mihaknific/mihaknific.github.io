/**
 * Portfolio - Glavna aplikacija
 * Miha Knific — Magister kognitivne znanosti
 */

gsap.registerPlugin(ScrollTrigger);

const isPointerFine = window.matchMedia('(pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = !isPointerFine && window.innerWidth <= 768;

// Uvodna animacija (Hero)
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

    const initialHashAtRun = window.location.hash.toLowerCase();
    const isDirectDeepLink = initialIndex !== 0 || initialHashAtRun === "#arhiv" || initialHashAtRun === "#podpora" || initialHashAtRun === "#archive-panel" || initialHashAtRun === "#podpora-panel";

    if (prefersReducedMotion || isDirectDeepLink) {
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

// Interaktivni odziv naslova ob prehodu z miško
const flipHeaders = document.querySelectorAll('.magnetic-text');
flipHeaders.forEach(header => gsap.set(header, { perspective: 800 }));

const allHeaderChars = [];
flipHeaders.forEach(header => {
    header.querySelectorAll('.char').forEach(c => allHeaderChars.push(c));
});

let headerLeaveTimeout = null;
let isHeaderAnimating = false;

const triggerHeaderAnimation = () => {
    if (activePanel !== null || isAnimating) return;
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

if (isPointerFine && !prefersReducedMotion) {
    flipHeaders.forEach(header => {
        header.addEventListener('mouseenter', triggerHeaderAnimation);
        header.addEventListener('click', triggerHeaderAnimation);

        header.addEventListener('mousemove', (e) => {
            if (activePanel !== null || isAnimating) return;
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

// Navigacija in prehodi med sekcijami
const sections = gsap.utils.toArray(".snap-container > section");
const navDots = gsap.utils.toArray(".nav-dots a");
const defaultDocumentTitle = document.title;

function updateDocumentTitle(panelId = null) {
    let title = defaultDocumentTitle;
    if (panelId === "archive-panel") {
        title = "Arhiv projektov | Miha Knific";
    } else if (panelId === "podpora-panel") {
        title = "Podpri moje ustvarjanje | Miha Knific";
    }
    if (typeof window.setPortfolioPageTitle === "function") {
        window.setPortfolioPageTitle(title);
    } else {
        document.title = title;
    }
}

function getPanelFromLocation() {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, "");
    const hash = window.location.hash.toLowerCase();

    if (pathname.endsWith("/arhiv.html") || hash === "#arhiv" || hash === "#archive-panel") {
        return "archive-panel";
    }
    if (pathname.endsWith("/podpora.html") || hash === "#podpora" || hash === "#podpora-panel") {
        return "podpora-panel";
    }
    return null;
}

function getPanelPath(panelId) {
    const filename = panelId === "archive-panel" ? "arhiv.html" : "podpora.html";
    const route = new URL(filename, new URL(".", document.baseURI));
    route.search = window.location.search;
    return `${route.pathname}${route.search}`;
}

// Preveri, ali URL izrecno navaja sekcijo ali podstran
function getInitialSectionIndex() {
    const hash = window.location.hash.toLowerCase();
    const panel = getPanelFromLocation();
    if (panel === "archive-panel") return sections.findIndex(s => s.id === "projects");
    if (panel === "podpora-panel") return sections.findIndex(s => s.id === "contact");
    if (hash === "#contact" || hash === "#kontakt") return sections.findIndex(s => s.id === "contact");
    if (hash === "#projects" || hash === "#projekti" || hash === "#dela") return sections.findIndex(s => s.id === "projects");
    return 0; // #domov ali privzeto (Domov)
}

function getSectionHash(idx) {
    const homeUrl = `${new URL(".", document.baseURI).pathname}${window.location.search}`;
    if (idx === 1) return `${homeUrl}#projekti`;
    if (idx === 2) return `${homeUrl}#kontakt`;
    if (window.location.hash.toLowerCase() === "#domov") return `${homeUrl}#domov`;
    return homeUrl;
}

const initialIndex = Math.max(0, getInitialSectionIndex());
let currentIndex = initialIndex;
let isAnimating = false;
let pendingKeyboardFocus = null;

// Nastavi začetno vidnost sekcij: takoj prikaži tisto sekcijo, kamor se vračamo!
sections.forEach((section, i) => {
    if (i === initialIndex) {
        gsap.set(section, { autoAlpha: 1, zIndex: 1, yPercent: 0 });
    } else {
        gsap.set(section, { autoAlpha: 0, zIndex: 0, yPercent: 0 });
    }
});

function updateNavDots(index) {
    navDots.forEach(dot => dot.classList.remove("active"));
    if (navDots[index]) {
        navDots[index].classList.add("active");
    }
}

// Takoj aktiviraj ustrezno pikico
updateNavDots(initialIndex);

// Če je ciljna sekcija kontakt, zaženi interaktivno mrežo
if (window.interactiveGrid && initialIndex === sections.length - 1) {
    window.interactiveGrid.resume();
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
            gsap.set(currentSection, { autoAlpha: 0, zIndex: 0, yPercent: 0 });
            gsap.set(nextSection, { autoAlpha: 1, zIndex: 1, yPercent: 0 });
            gsap.set([currentSection, nextSection], { clearProps: "willChange" });

            // Posodobi browser history z ustreznim hash-em sekcije za neposredno deljenje povezav
            try {
                window.history.replaceState({ sectionIndex: wrappedIndex }, "", getSectionHash(wrappedIndex));
            } catch (err) {
                console.error("Posodobitev zgodovine brskalnika ni uspela:", err);
            }

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
    const transitionDuration = prefersReducedMotion ? 0 : (isTouchDevice ? 1.35 : 1);
    const transitionEase = "power2.inOut";

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

    const focusedSection = e.target.closest(".snap-container > section");
    if (!focusedSection) return;

    const focusedIndex = sections.indexOf(focusedSection);
    if (focusedIndex === -1 || focusedIndex === currentIndex) return;

    pendingKeyboardFocus = e.target;
    goToSection(focusedIndex, focusedIndex > currentIndex ? 1 : -1, true);
    keyboardNavigationActive = false;
});



function handleScroll(direction) {
    if (isAnimating || activePanel !== null) return;
    goToSection(currentIndex + direction, direction);
}

// 1. Kolešček miške in sledilna ploščica (Trackpad / Mouse Wheel za računalnike)
const mainWheelObserver = ScrollTrigger.observe({
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
    if (activePanel !== null || e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (e) => {
    if (isAnimating || activePanel !== null) return;
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
        if (activePanel !== null) {
            closePanel();
        }
        if (i === currentIndex || isAnimating) return;
        goToSection(i, i > currentIndex ? 1 : -1);
    });
});

// 4. Tipkovnica (puščice gor/dol, PageUp/PageDown, preslednica, Escape za zapiranje panela)
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activePanel !== null && !isAnimating) {
        e.preventDefault();
        closePanel();
        return;
    }
    if (activePanel !== null) return;
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
        if (currentIndex === 0 && !isAnimating && activePanel === null) {
            handleScroll(1);
        }
    });
}

// ==========================================================================
// 6. VODORAVNA 2D NAVIGACIJA (ARHIV & PODPORA PANELA)
// ==========================================================================
let activePanel = null;
let panelReturnTarget = null; // shrani izvor (npr. 'archive-panel' ali index sekcije)
const archivePanelEl = document.getElementById("archive-panel");
const podporaPanelEl = document.getElementById("podpora-panel");
const snapContainerEl = document.querySelector(".snap-container");
const navDotsContainerEl = document.querySelector(".nav-dots");
const panelOpeners = new Map();

function updatePodporaBackLinkText() {
    const podporaBackBtn = podporaPanelEl ? podporaPanelEl.querySelector(".close-panel-btn") : null;
    if (!podporaBackBtn) return;
    const textSpan = podporaBackBtn.querySelector(".back-link-text");
    if (panelReturnTarget === "archive-panel") {
        if (textSpan) textSpan.textContent = "Arhiv";
        podporaBackBtn.setAttribute("data-target", "archive");
        podporaBackBtn.setAttribute("aria-label", "Arhiv");
        podporaBackBtn.setAttribute("href", "arhiv.html");
    } else if (panelReturnTarget === sections.findIndex(s => s.id === "projects")) {
        if (textSpan) textSpan.textContent = "Portfolio";
        podporaBackBtn.setAttribute("data-target", "projects");
        podporaBackBtn.setAttribute("aria-label", "Portfolio");
        podporaBackBtn.setAttribute("href", "#projects");
    } else {
        if (textSpan) textSpan.textContent = "Kontakt";
        podporaBackBtn.setAttribute("data-target", "contact");
        podporaBackBtn.setAttribute("aria-label", "Kontakt");
        podporaBackBtn.setAttribute("href", "#contact");
    }
}

function openPanel(panelId, pushHistory = true, fromPanel = null) {
    if (isAnimating || activePanel === panelId) return;
    const panel = panelId === "archive-panel" ? archivePanelEl : (panelId === "podpora-panel" ? podporaPanelEl : null);
    if (!panel) return;

    if (pushHistory && document.activeElement instanceof HTMLElement) {
        panelOpeners.set(panelId, document.activeElement);
    }

    isAnimating = true;

    // Zaustavi zaledno platno contact-canvas, da ne troši procesorja in grafične med odprtim panelom
    if (window.interactiveGrid && typeof window.interactiveGrid.pause === "function") {
        window.interactiveGrid.pause();
    }

    // Če odpiramo Podporo iz Arhiva, si zapomnimo izvor
    if (fromPanel) {
        panelReturnTarget = fromPanel;
    } else if (activePanel === null) {
        panelReturnTarget = currentIndex;
    }

    if (panelId === "podpora-panel") {
        updatePodporaBackLinkText();
    }
    updateDocumentTitle(panelId);

    const otherPanel = panelId === "archive-panel" ? podporaPanelEl : archivePanelEl;
    if (otherPanel) {
        otherPanel.setAttribute("aria-hidden", "true");
        otherPanel.setAttribute("inert", "");
    }
    if (snapContainerEl) {
        snapContainerEl.setAttribute("aria-hidden", "true");
        snapContainerEl.setAttribute("inert", "");
    }
    if (navDotsContainerEl) {
        navDotsContainerEl.setAttribute("aria-hidden", "true");
        navDotsContainerEl.setAttribute("inert", "");
    }

    panel.removeAttribute("aria-hidden");
    panel.removeAttribute("inert");
    activePanel = panelId;

    if (mainWheelObserver && mainWheelObserver.disable) {
        mainWheelObserver.disable();
    }

    panel.classList.add("active");
    panel.scrollTop = 0;

    const isTouch = !isPointerFine || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 1024;
    const dur = prefersReducedMotion ? 0 : (isTouch ? 0.75 : 0.82);
    const ease = "power3.out";

    // Panel začne na desni (+100%) z dinamičnim will-change le za čas trajanja animacije
    gsap.set(panel, { xPercent: 100, autoAlpha: 1, willChange: "transform" });

    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
            gsap.set(panel, { clearProps: "willChange" });
            if (pushHistory) {
                try {
                    window.history.pushState(
                        { panel: panelId, sectionIndex: currentIndex, fromPanel: panelReturnTarget },
                        "",
                        getPanelPath(panelId)
                    );
                } catch (e) {
                    console.error("Posodobitev zgodovine brskalnika ni uspela:", e);
                }
            }
            const backLink = panel.querySelector(".close-panel-btn");
            if (backLink instanceof HTMLElement) backLink.focus({ preventScroll: true });
        }
    });

    tl.to(panel, {
        xPercent: 0,
        duration: dur,
        ease: ease
    }, 0);
}

function closePanel(pushHistory = true, target = null) {
    if (isAnimating || !activePanel) return;
    const panel = activePanel === "archive-panel" ? archivePanelEl : podporaPanelEl;
    if (!panel) return;

    // Če se vračamo v Arhiv iz Podpore
    if (target === "archive" || (target === null && panelReturnTarget === "archive-panel")) {
        isAnimating = true;
        const dur = prefersReducedMotion ? 0 : 0.65;
        const ease = "power3.inOut";

        // Prepričaj se, da je archive-panel stabilno pod podpora-panelom
        archivePanelEl.classList.add("active");
        gsap.set(archivePanelEl, { xPercent: 0, autoAlpha: 1 });
        gsap.set(panel, { willChange: "transform" });

        const tl = gsap.timeline({
            onComplete: () => {
                panel.classList.remove("active");
                gsap.set(panel, { xPercent: 100, autoAlpha: 0, clearProps: "willChange" });
                panel.setAttribute("aria-hidden", "true");
                panel.setAttribute("inert", "");
                archivePanelEl.removeAttribute("aria-hidden");
                archivePanelEl.removeAttribute("inert");
                updateDocumentTitle("archive-panel");
                activePanel = "archive-panel";
                panelReturnTarget = sections.findIndex(s => s.id === "projects");
                isAnimating = false;
                const panelOpener = panelOpeners.get("podpora-panel");
                if (panelOpener instanceof HTMLElement && panelOpener.isConnected) {
                    panelOpener.focus({ preventScroll: true });
                }
                if (pushHistory) {
                    try {
                        window.history.pushState(
                            { panel: "archive-panel", sectionIndex: currentIndex },
                            "",
                            getPanelPath("archive-panel")
                        );
                    } catch (e) {
                        console.error("Posodobitev zgodovine brskalnika ni uspela:", e);
                    }
                }
            }
        });

        tl.to(panel, {
            xPercent: 100,
            duration: dur,
            ease: ease
        }, 0);
        return;
    }

    isAnimating = true;

    // Če je podan specifičen ciljni indeks sekcije
    let targetIdx = currentIndex;
    if (typeof target === "number" && target >= 0 && target < sections.length) {
        targetIdx = target;
    } else if (typeof panelReturnTarget === "number" && panelReturnTarget >= 0 && panelReturnTarget < sections.length) {
        targetIdx = panelReturnTarget;
    }

    const currentSec = sections[currentIndex];
    const targetSec = sections[targetIdx];

    const isTouch = !isPointerFine || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 1024;
    const dur = prefersReducedMotion ? 0 : (isTouch ? 0.65 : 0.70);
    const ease = "power3.inOut";
    const closingPanelId = activePanel;

    // Poskrbi, da je ciljna sekcija zanesljivo prikazana pod panelom na svojem mestu
    if (targetSec) {
        gsap.set(targetSec, { autoAlpha: 1, zIndex: 1, yPercent: 0, xPercent: 0, opacity: 1 });
        if (currentSec && currentSec !== targetSec) {
            gsap.set(currentSec, { autoAlpha: 0, zIndex: 0 });
        }
        currentIndex = targetIdx;
        updateNavDots(targetIdx);
    }

    gsap.set(panel, { willChange: "transform" });

    const tl = gsap.timeline({
        onComplete: () => {
            panel.classList.remove("active");
            gsap.set(panel, { xPercent: 100, autoAlpha: 0, clearProps: "willChange" });
            panel.setAttribute("aria-hidden", "true");
            panel.setAttribute("inert", "");
            activePanel = null;
            panelReturnTarget = null;
            isAnimating = false;
            updateDocumentTitle();
            if (snapContainerEl) {
                snapContainerEl.removeAttribute("aria-hidden");
                snapContainerEl.removeAttribute("inert");
            }
            if (navDotsContainerEl) {
                navDotsContainerEl.removeAttribute("aria-hidden");
                navDotsContainerEl.removeAttribute("inert");
            }
            const panelOpener = panelOpeners.get(closingPanelId);
            panelOpeners.delete(closingPanelId);
            if (panelOpener instanceof HTMLElement && panelOpener.isConnected) {
                panelOpener.focus({ preventScroll: true });
            }

            if (mainWheelObserver && mainWheelObserver.enable) {
                mainWheelObserver.enable();
            }

            // Če smo nazaj na kontaktni sekciji, ponovno oživimo canvas točke
            if (window.interactiveGrid && currentIndex === sections.length - 1 && typeof window.interactiveGrid.resume === "function") {
                window.interactiveGrid.resume();
            }

            if (pushHistory) {
                try {
                    window.history.pushState({ sectionIndex: currentIndex }, "", getSectionHash(currentIndex));
                } catch (e) {
                    console.error("Posodobitev zgodovine brskalnika ni uspela:", e);
                }
            }
        }
    });

    tl.to(panel, {
        xPercent: 100,
        duration: dur,
        ease: ease
    }, 0);
}

// Poveži klik na 'Vsi projekti' kartico z odpiranjem Arhiva
const openArchiveBtns = document.querySelectorAll(".card-arhiv, a[href='arhiv.html'], a[href='#archive-panel'], a[href='#arhiv']");
openArchiveBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        openPanel("archive-panel");
    });
});

// Poveži gumbe za podporo z odpiranjem panela
const openPodporaBtns = document.querySelectorAll(".support-btn-daruj, a[href='podpora.html'], a[href='#podpora-panel'], a[href='#podpora']");
openPodporaBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const fromArchive = (activePanel === "archive-panel" || btn.closest("#archive-panel") !== null);
        openPanel("podpora-panel", true, fromArchive ? "archive-panel" : null);
    });
});

// Povezava gumbov za zapiranje panelov
const closePanelBtns = document.querySelectorAll(".close-panel-btn");
closePanelBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetAttr = btn.getAttribute("data-target");
        let targetVal = null;
        if (targetAttr === "archive") {
            targetVal = "archive";
        } else if (targetAttr === "projects") {
            targetVal = sections.findIndex(s => s.id === "projects");
        } else if (targetAttr === "contact") {
            targetVal = sections.findIndex(s => s.id === "contact");
        }
        closePanel(true, targetVal);
    });
});

// 7. Podpora za brskalnikove gumbe Nazaj / Naprej (History Popstate)
window.addEventListener("popstate", (e) => {
    const requestedPanel = getPanelFromLocation();

    if (activePanel === "podpora-panel" && requestedPanel === "archive-panel") {
        closePanel(false, "archive");
        return;
    }
    if (activePanel === "archive-panel" && requestedPanel === "podpora-panel") {
        openPanel("podpora-panel", false, "archive-panel");
        return;
    }
    if (activePanel !== null && requestedPanel !== activePanel) {
        closePanel(false);
        return;
    }
    if (requestedPanel) {
        if (activePanel !== requestedPanel) {
            openPanel(requestedPanel, false, (e.state && e.state.fromPanel) || null);
        }
        return;
    }

    // Če preklapljamo med sekcijami
    if (e.state && typeof e.state.sectionIndex === "number") {
        const target = e.state.sectionIndex;
        if (target !== currentIndex && !isAnimating) {
            goToSection(target, target > currentIndex ? 1 : -1);
        }
    } else {
        const targetIndex = getInitialSectionIndex();
        if (targetIndex !== currentIndex && !isAnimating) {
            goToSection(targetIndex, targetIndex > currentIndex ? 1 : -1);
        }
    }
});

// Začetna obravnava hash-a ob nalaganju strani
const initialPanel = getPanelFromLocation();
const initialHash = window.location.hash.toLowerCase();
if (initialPanel === "archive-panel") {
    try {
        window.history.replaceState(
            { panel: "archive-panel", sectionIndex: initialIndex },
            "",
            getPanelPath("archive-panel")
        );
    } catch (e) {
        console.error("Posodobitev zgodovine brskalnika ni uspela:", e);
    }
    setTimeout(() => openPanel("archive-panel", false), 100);
} else if (initialPanel === "podpora-panel") {
    try {
        window.history.replaceState(
            { panel: "podpora-panel", sectionIndex: initialIndex },
            "",
            getPanelPath("podpora-panel")
        );
    } catch (e) {
        console.error("Posodobitev zgodovine brskalnika ni uspela:", e);
    }
    setTimeout(() => openPanel("podpora-panel", false), 100);
} else if (initialHash === "#projekti" || initialHash === "#projects" || initialHash === "#dela") {
    try {
        window.history.replaceState({ sectionIndex: initialIndex }, "", "#projekti");
    } catch (err) {
        console.error("Posodobitev zgodovine brskalnika ni uspela:", err);
    }
} else if (initialHash === "#kontakt" || initialHash === "#contact") {
    try {
        window.history.replaceState({ sectionIndex: initialIndex }, "", "#kontakt");
    } catch (err) {
        console.error("Posodobitev zgodovine brskalnika ni uspela:", err);
    }
} else if (initialHash === "#domov") {
    try {
        window.history.replaceState({ sectionIndex: 0 }, "", "#domov");
    } catch (err) {
        console.error("Posodobitev zgodovine brskalnika ni uspela:", err);
    }
}

// 3D nagib kartic
const interactiveCards = document.querySelectorAll(".card");

interactiveCards.forEach(card => {
    if (!isPointerFine || prefersReducedMotion) return;

    card.addEventListener("mousemove", (e) => {
        if (activePanel !== null || isAnimating) return;
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

// Kurzor
const cursor = document.getElementById("custom-cursor");

if (cursor && isPointerFine && !prefersReducedMotion) {
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

// Zagon ob nalaganju strani
window.addEventListener('load', () => {
    runIntroAnimation();
});