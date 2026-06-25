// ========================================
//  PRELOADER
// ========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
                const delay = parseFloat(el.dataset.delay || 0) * 1000;
                setTimeout(() => el.classList.add('visible'), delay);
            });
            document.querySelectorAll('#home .char-split').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), 400 + i * 60);
            });
        }, 600);
    }, 1200);
});

// ========================================
//  CUSTOM CURSOR
// ========================================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let cx = 0, cy = 0, tx = 0, ty = 0;
let glMouseX = 0, glMouseY = 0;

document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
    glMouseX = e.clientX - window.innerWidth / 2;
    glMouseY = e.clientY - window.innerHeight / 2;
});

(function trailLoop() {
    tx += (cx - tx) * 0.12;
    ty += (cy - ty) * 0.12;
    if (cursorTrail) { cursorTrail.style.left = tx + 'px'; cursorTrail.style.top = ty + 'px'; }
    requestAnimationFrame(trailLoop);
})();

// Cursor hover states
document.querySelectorAll('a, button, .glass-card, .social-icon, .timeline-icon, .nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor?.classList.add('hover'); cursorTrail?.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor?.classList.remove('hover'); cursorTrail?.classList.remove('hover'); });
});

// Magnetic effect — buttons & social icons only
document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// ========================================
//  HEADER — Scroll-Aware Glass Effect
// ========================================
const header = document.getElementById('site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 50) { header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
    lastScroll = y;
}, { passive: true });

// ========================================
//  MODE TOGGLE
// ========================================
const modeToggle = document.getElementById('modeToggle');
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.75 15.5a9 9 0 01-11.25-11.25 7.5 7.5 0 1011.25 11.25z"/></svg>`;
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>`;

function updateToggle() {
    modeToggle.innerHTML = document.body.classList.contains('dark-mode') ? sunIcon : moonIcon;
}
modeToggle.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); updateToggle(); });
updateToggle();

// ========================================
//  TYPING EFFECT
// ========================================
const typedEl = document.getElementById('typed-text');
const roles = ['Data Scientist', 'Full Stack Developer', 'Machine Learning Engineer', 'AI Enthusiast', 'Problem Solver'];
let ri = 0, ci2 = 0, deleting = false, speed = 100;

function typeEffect() {
    if (!typedEl) return;
    const word = roles[ri];
    typedEl.textContent = word.substring(0, deleting ? --ci2 : ++ci2);
    speed = deleting ? 35 : 90;
    if (!deleting && ci2 === word.length) { deleting = true; speed = 2200; }
    else if (deleting && ci2 === 0) { deleting = false; ri = (ri + 1) % roles.length; speed = 400; }
    setTimeout(typeEffect, speed);
}
typeEffect();

// ========================================
//  SCROLL ANIMATIONS
// ========================================

// Split text for section headings
document.querySelectorAll('[data-animate="split-text"]').forEach(el => {
    if (el.classList.contains('char-split-done')) return;
    const text = el.innerText;
    el.innerHTML = '';
    text.split('').forEach(char => {
        const s = document.createElement('span');
        s.textContent = char === ' ' ? '\u00A0' : char;
        s.className = 'char-split';
        el.appendChild(s);
    });
    el.classList.add('char-split-done');
});

// Unified scroll observer
const scrollObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const t = entry.target;

        if (t.getAttribute('data-animate') === 'split-text') {
            t.querySelectorAll('.char-split').forEach((c, i) => setTimeout(() => c.classList.add('visible'), i * 35));
            scrollObs.unobserve(t);
        }
        else if (t.hasAttribute('data-stagger')) {
            const d = parseInt(t.dataset.stagger) * 120;
            setTimeout(() => t.classList.add('visible'), d);
            scrollObs.unobserve(t);
        }
        else if (t.classList.contains('stat-number')) {
            const to = parseInt(t.dataset.count);
            let n = 0;
            const tick = () => { if (n < to) { n++; t.innerText = n; setTimeout(tick, 1800 / to); } };
            tick();
            scrollObs.unobserve(t);
        }
        else if (t.classList.contains('skill-level')) {
            const p = t.closest('[data-stagger]');
            const d = p ? parseInt(p.dataset.stagger) * 120 : 0;
            setTimeout(() => { t.style.width = t.dataset.level + '%'; }, d + 400);
            scrollObs.unobserve(t);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate="split-text"], [data-stagger], .stat-number, .skill-level').forEach(el => scrollObs.observe(el));

// ========================================
//  NAV LINK ACTIVE STATE
// ========================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main, .section');

const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        }
    });
}, { threshold: 0.25 });
sections.forEach(s => navObs.observe(s));

// Smooth scroll
document.querySelectorAll('nav a, .cta-btn, .cta-btn-outline, .logo').forEach(a => {
    a.addEventListener('click', function (e) {
        const h = this.getAttribute('href');
        if (h && h.startsWith('#')) { e.preventDefault(); document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' }); }
    });
});

// ========================================
//  3D TILT — Glass cards, profile, image
// ========================================
document.querySelectorAll('.glass-card, .profile-3d-wrapper, .image-section').forEach(el => {
    if (el.classList.contains('magnetic')) return;

    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;

        el.style.transform = `perspective(800px) rotateX(${y * -12}deg) rotateY(${x * 12}deg) scale3d(1.02, 1.02, 1.02)`;

        // Move the radial glow inside project cards
        const glow = el.querySelector('.project-card-glow');
        if (glow) {
            glow.style.setProperty('--glow-x', ((x + 0.5) * 100) + '%');
            glow.style.setProperty('--glow-y', ((y + 0.5) * 100) + '%');
        }
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
    });
});

// ========================================
//  THREE.JS — Particle Cosmos
// ========================================
const canvas = document.getElementById('webgl-canvas');

if (canvas && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 1400;
    const pos = new Float32Array(count * 3);
    const vel = [];

    for (let i = 0; i < count * 3; i += 3) {
        pos[i] = (Math.random() - 0.5) * 22;
        pos[i + 1] = (Math.random() - 0.5) * 22;
        pos[i + 2] = (Math.random() - 0.5) * 16;
        vel.push({ x: (Math.random() - 0.5) * 0.015, y: (Math.random() - 0.5) * 0.015, z: (Math.random() - 0.5) * 0.015 });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const m1 = new THREE.PointsMaterial({ size: 0.025, color: 0x7c6aff, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending });
    const m2 = new THREE.PointsMaterial({ size: 0.018, color: 0x00d4ff, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending });
    const m3 = new THREE.PointsMaterial({ size: 0.04, color: 0xff5caa, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });

    const p1 = new THREE.Points(geo, m1);
    const p2 = new THREE.Points(geo, m2);
    p2.scale.set(1.3, 1.3, 1.3);
    p2.rotation.x = Math.PI / 5;
    const p3 = new THREE.Points(geo, m3);
    p3.scale.set(0.8, 0.8, 0.8);
    p3.rotation.z = Math.PI / 3;

    scene.add(p1, p2, p3);

    // Wireframe geometry
    const icoGeo = new THREE.IcosahedronGeometry(2, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x7c6aff, wireframe: true, transparent: true, opacity: 0.04 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(5, 0, -8);
    scene.add(ico);

    const torusGeo = new THREE.TorusGeometry(1.5, 0.4, 8, 40);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.03 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-5, -2, -7);
    scene.add(torus);

    camera.position.z = 5;

    let pageScroll = 0;
    window.addEventListener('scroll', () => { pageScroll = window.scrollY; }, { passive: true });

    modeToggle.addEventListener('click', () => {
        setTimeout(() => {
            const dk = document.body.classList.contains('dark-mode');
            m1.color.setHex(dk ? 0x7c6aff : 0x5b4cd6);
            m2.color.setHex(dk ? 0x00d4ff : 0x0891b2);
            m3.color.setHex(dk ? 0xff5caa : 0xd63384);
            icoMat.opacity = dk ? 0.04 : 0.02;
            torusMat.opacity = dk ? 0.03 : 0.015;
        }, 50);
    });

    const clock = new THREE.Clock();

    (function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        const mx = glMouseX * 0.0008;
        const my = glMouseY * 0.0008;

        p1.rotation.y += 0.04 * (mx - p1.rotation.y);
        p1.rotation.x += 0.04 * (my - p1.rotation.x);
        p1.rotation.z = t * 0.03;

        p2.rotation.y += 0.025 * (mx * 1.3 - p2.rotation.y);
        p2.rotation.x += 0.025 * (my * 1.3 - p2.rotation.x);
        p2.rotation.z = -t * 0.02;

        p3.rotation.y += 0.015 * (mx * 0.6 - p3.rotation.y);
        p3.rotation.x += 0.015 * (my * 0.6 - p3.rotation.x);

        camera.position.y = -(pageScroll * 0.0008);

        ico.rotation.x = t * 0.12;
        ico.rotation.y = t * 0.08;
        ico.position.y = Math.sin(t * 0.5) * 0.4;

        torus.rotation.x = t * 0.15;
        torus.rotation.z = t * 0.06;
        torus.position.y = Math.cos(t * 0.4) * 0.5;

        // Animate subset of particles
        const arr = geo.attributes.position.array;
        for (let i = 0; i < count * 3; i += 27) {
            const vi = i / 3;
            if (!vel[vi]) continue;
            arr[i] += vel[vi].x;
            arr[i + 1] += vel[vi].y;
            arr[i + 2] += vel[vi].z;
            if (Math.abs(arr[i]) > 11) vel[vi].x *= -1;
            if (Math.abs(arr[i + 1]) > 11) vel[vi].y *= -1;
            if (Math.abs(arr[i + 2]) > 8) vel[vi].z *= -1;
        }
        geo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========================================
//  CONTACT FORM HANDLING
// ========================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>SENDING...</span>';
        btn.disabled = true;

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const data = await res.json();
            
            if (data.success) {
                btn.innerHTML = '<span>SENT SUCCESSFULLY!</span>';
                contactForm.reset();
                setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 3000);
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            btn.innerHTML = '<span>ERROR - TRY AGAIN</span>';
            setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 3000);
        }
    });
}