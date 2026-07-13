/**
 * Interactive Grid Engine
 * Canvas-based dot grid with physics-based mouse interaction
 */

class InteractiveGrid {
    constructor() {
        this.canvas = document.getElementById('contact-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.spacing = 50; // Razmik med točkami
        this.mouse = { x: -1000, y: -1000 };
        this.radius = 180; // Radij vpliva miške
        this.resizeTimer = null; // Debounce za resize
        this.running = false; // Začnemo ustavljeno

        this.init();
        this.bindEvents();
        // animate() se zažene šele ob resume() klicu
    }

    init() {
        this.resize();
        this.createGrid();
    }

    resize() {
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;

        // Handle High DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.createGrid();
    }

    createGrid() {
        this.dots = [];
        const cols = Math.ceil(this.width / this.spacing) + 1;
        const rows = Math.ceil(this.height / this.spacing) + 1;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.dots.push(new Dot(i * this.spacing, j * this.spacing));
            }
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.resize(), 200);
        });

        // Sledenje miški samo znotraj kontaktne sekcije za boljšo performanco
        const section = document.getElementById('contact');
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        }, { passive: true });

        section.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        }, { passive: true });
    }

    // Nadzor življenjskega cikla
    pause() {
        this.running = false;
    }

    resume() {
        if (!this.running) {
            this.running = true;
            this.animate();
        }
    }

    animate() {
        if (!this.running) return; // Ne izrisuj, ko sekcija ni vidna

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.dots.forEach(dot => {
            dot.update(this.mouse, this.radius);
            dot.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

class Dot {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.curX = x;
        this.curY = y;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.85; // Trenje (kako hitro se ustavi)
        this.spring = 0.05;   // Moč vzmeti (kako hitro se vrne)
        this.size = 1.5;      // Velikost točke
    }

    update(mouse, radius) {
        const dx = mouse.x - this.curX;
        const dy = mouse.y - this.curY;
        const distSq = dx * dx + dy * dy;
        const radiusSq = radius * radius;

        // Physics logic
        if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (radius - dist) / radius;
            const angle = Math.atan2(dy, dx);

            // Push away from mouse
            const tx = this.curX - Math.cos(angle) * force * 15;
            const ty = this.curY - Math.sin(angle) * force * 15;

            this.vx += (tx - this.curX);
            this.vy += (ty - this.curY);
        }

        // Spring back to base position
        const sx = (this.baseX - this.curX) * this.spring;
        const sy = (this.baseY - this.curY) * this.spring;

        this.vx += sx;
        this.vy += sy;

        // Apply friction and move
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.curX += this.vx;
        this.curY += this.vy;
    }

    draw(ctx) {
        // Izračun prosojnosti glede na odmik od baze (subtilen glow efekt)
        const dx = this.curX - this.baseX;
        const dy = this.curY - this.baseY;
        // Manhattan razdalja (hitrejša od Pitagore)
        const approxDist = Math.abs(dx) + Math.abs(dy);
        const opacity = 0.15 + (approxDist / 30); // Bolj ko se premakne, bolj sveti

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(opacity, 0.8)})`;
        ctx.beginPath();
        ctx.arc(this.curX, this.curY, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inicializacija in globalna izpostavitev za app.js
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveGrid = new InteractiveGrid();
});
