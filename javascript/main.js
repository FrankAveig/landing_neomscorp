// NEOMSCORP Business Group - JavaScript principal

// Registrar ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ============================================
// THREE.JS - Fondo 3D Animado
// ============================================

let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 1000;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Crear partículas
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color = new THREE.Color();
    // Color dorado: #E2A53E (RGB: 226, 165, 62)
    color.setRGB(226 / 255, 165 / 255, 62 / 255);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (particleSystem) {
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.001;

        // Efecto parallax con mouse
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
}

// ============================================
// GSAP - Animaciones del Hero
// ============================================

function initHeroAnimations() {
    // Timeline principal del hero
    const heroTL = gsap.timeline();

    // Animación del título (logo)
    heroTL.to('.hero__title', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out'
    })
    .to('.hero__subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6')
    .to('.hero__buttons', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6')
    .to('.hero__scroll-indicator', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.hero__unesco', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8');

    // Animación de partículas flotantes
    gsap.to('.hero__particle', {
        y: 'random(-50, 50)',
        x: 'random(-30, 30)',
        duration: 'random(3, 6)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.5
    });

    // Efecto parallax en el contenido al hacer scroll
    gsap.to('.hero__content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        opacity: 0,
        scale: 0.8
    });

    // Animación del scroll indicator
    gsap.to('.hero__scroll-indicator', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'center top',
            scrub: true
        },
        opacity: 0,
        y: 20
    });
}

// ============================================
// Efectos adicionales
// ============================================

function initButtonEffects() {
    const buttons = document.querySelectorAll('.hero__button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Efecto de cursor personalizado (opcional)
function initCursorEffect() {
    let cursor = document.querySelector('.cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'cursor';
        cursor.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid rgba(226, 165, 62, 0.5);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
            display: none;
        `;
        document.body.appendChild(cursor);
    }

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            cursor.style.display = 'block';
            gsap.to(cursor, {
                x: e.clientX - 10,
                y: e.clientY - 10,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}

// ============================================
// PORTFOLIO - Animaciones
// ============================================

function initPortfolioAnimations() {
    // Animación del header del portafolio
    gsap.to('.portfolio__header', {
        scrollTrigger: {
            trigger: '.portfolio',
            start: 'top 80%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Animación de las tarjetas con stagger
    const cards = document.querySelectorAll('.portfolio__card');
    
    cards.forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                scrub: false,
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: index * 0.2
        });

        // Efecto hover con GSAP
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
            
            gsap.to(this.querySelector('.portfolio__card-glow'), {
                opacity: 1,
                duration: 0.4
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
            
            gsap.to(this.querySelector('.portfolio__card-glow'), {
                opacity: 0,
                duration: 0.4
            });
        });
    });

    // Animación de los círculos decorativos
    gsap.to('.portfolio__decoration-circle--1', {
        scrollTrigger: {
            trigger: '.portfolio',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        x: 100,
        y: -100,
        rotation: 360
    });

    gsap.to('.portfolio__decoration-circle--2', {
        scrollTrigger: {
            trigger: '.portfolio',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        x: -80,
        y: 80,
        rotation: -360
    });

    gsap.to('.portfolio__decoration-circle--3', {
        scrollTrigger: {
            trigger: '.portfolio',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        x: 50,
        y: -50,
        rotation: 180
    });
}

// ============================================
// ABOUT - Animaciones
// ============================================

function initAboutAnimations() {
    // Animación del header
    gsap.to('.about__header', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Animación del contenido principal
    gsap.to('.about__main-content', {
        scrollTrigger: {
            trigger: '.about__main-content',
            start: 'top 85%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Animación de las tarjetas con stagger
    const cards = document.querySelectorAll('.about__card');
    
    cards.forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                scrub: false,
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: index * 0.15
        });
    });

    // Animación de la sección de valores
    gsap.to('.about__values', {
        scrollTrigger: {
            trigger: '.about__values',
            start: 'top 85%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Animación de los items de valores
    const valueItems = document.querySelectorAll('.about__value-item');
    
    valueItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: '.about__values',
                start: 'top 80%',
                end: 'top 50%',
                scrub: false,
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            delay: index * 0.1
        });
    });

    // Animación de las líneas decorativas
    gsap.to('.about__decoration-line--1', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        x: 50,
        opacity: 0.2
    });

    gsap.to('.about__decoration-line--2', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        x: -50,
        opacity: 0.2
    });
}

// ============================================
// Inicialización
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Three.js
    if (typeof THREE !== 'undefined') {
        initThreeJS();
    }

    // Inicializar animaciones GSAP
    if (typeof gsap !== 'undefined') {
        initHeroAnimations();
        initButtonEffects();
        initPortfolioAnimations();
        initAboutAnimations();
        initContactAnimations();
    }

    // Inicializar formulario de contacto
    initContactForm();

    // Inicializar footer
    initFooter();

    // Inicializar efectos adicionales
    if (window.innerWidth > 768) {
        initCursorEffect();
    }

    // Smooth scroll para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ============================================
// CONTACT FORM - Funcionalidad WhatsApp
// ============================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const whatsappNumber = '593991988400'; // Número sin el signo +

    // Detectar si es móvil o desktop
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Formatear mensaje para WhatsApp
    function formatWhatsAppMessage(formData) {
        const medioContacto = {
            'whatsapp': 'WhatsApp',
            'email': 'Email',
            'telefono': 'Teléfono'
        };

        let message = `*Nuevo Contacto - NEOMSCORP Business Group*\n\n`;
        message += `*Nombre:* ${formData.nombre}\n`;
        message += `*Apellido:* ${formData.apellido}\n`;
        message += `*Empresa:* ${formData.empresa}\n`;
        message += `*Teléfono:* ${formData.telefono}\n`;
        message += `*Email:* ${formData.email}\n`;
        message += `*Medio de contacto preferido:* ${medioContacto[formData['medio-contacto']] || formData['medio-contacto']}\n`;
        
        return encodeURIComponent(message);
    }

    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            empresa: document.getElementById('empresa').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            'medio-contacto': document.getElementById('medio-contacto').value
        };

        // Validar que todos los campos estén completos
        if (!formData.nombre || !formData.apellido || !formData.empresa || 
            !formData.telefono || !formData.email || !formData['medio-contacto']) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        // Formatear mensaje
        const message = formatWhatsAppMessage(formData);

        // Determinar URL según dispositivo
        let whatsappUrl;
        if (isMobile()) {
            // Para móvil: usar la app de WhatsApp
            whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        } else {
            // Para desktop: usar web.whatsapp.com
            whatsappUrl = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;
        }

        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');

        // Opcional: Resetear formulario después de un breve delay
        setTimeout(() => {
            form.reset();
        }, 500);
    });
}

// ============================================
// CONTACT - Animaciones
// ============================================

function initContactAnimations() {
    // Animación del header
    gsap.to('.contact__header', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Animación del formulario
    gsap.to('.contact__form', {
        scrollTrigger: {
            trigger: '.contact__form',
            start: 'top 85%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });
}

// ============================================
// FOOTER - Funcionalidad
// ============================================

function initFooter() {
    // Actualizar año en el copyright
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Animación del footer al hacer scroll
    if (typeof gsap !== 'undefined') {
        gsap.to('.footer__top', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                end: 'top 50%',
                scrub: false,
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        });
    }
}

// Recargar en resize para mejor rendimiento
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (typeof onWindowResize === 'function') {
            onWindowResize();
        }
    }, 250);
});
