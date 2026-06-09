// ── Particle canvas ────────────────────────────────────────────────────────

(function () {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    const ACCENT = '125, 211, 252'; // matches --accent #7dd3fc
    const COUNT = 75;
    const MAX_DIST = 130;
    let mouse = { x: -9999, y: -9999 };
    let particles = [];
    let W, H, dpr;

    function resize() {
        dpr = window.devicePixelRatio || 1;
        W = canvas.offsetWidth;
        H = canvas.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
    }

    function rand(a, b) { return Math.random() * (b - a) + a; }

    function spawn() {
        return {
            x: rand(0, W), y: rand(0, H),
            vx: rand(-0.35, 0.35), vy: rand(-0.35, 0.35),
            r: rand(1, 2.2),
            opacity: rand(0.2, 0.6),
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: COUNT }, spawn);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -20) p.x = W + 20;
            if (p.x > W + 20) p.x = -20;
            if (p.y < -20) p.y = H + 20;
            if (p.y > H + 20) p.y = -20;

            // Mouse repel (subtle)
            const dx = p.x - mouse.x, dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
                const force = (90 - dist) / 90 * 0.4;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
                // dampen
                p.vx *= 0.96;
                p.vy *= 0.96;
            }

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ACCENT}, ${p.opacity})`;
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const ex = p.x - q.x, ey = p.y - q.y;
                const d = Math.sqrt(ex * ex + ey * ey);
                if (d < MAX_DIST) {
                    const alpha = (1 - d / MAX_DIST) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); });
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    init();
    draw();
})();

// ── Nav scroll ─────────────────────────────────────────────────────────────

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Fade-in on scroll ──────────────────────────────────────────────────────

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll(
    '.research-card, .exp-item, .project-card, .ach-item, .edu-item, .skill-group'
).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ── Active nav link ────────────────────────────────────────────────────────

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.style.color = 'var(--text-bright)';
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
