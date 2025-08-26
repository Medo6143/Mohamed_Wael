
// Three.js Scene Setup
let scene, camera, renderer, particles, particleSystem, cubes, cubeSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize Enhanced Three.js Background
function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create floating particles
    createParticles();
    
    // Create floating cubes
    createFloatingCubes();
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point lights for enhanced glow
    const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    // Animation loop
    animate();
}

// Create enhanced floating particles
function createParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 30;
        positions[i + 1] = (Math.random() - 0.5) * 30;
        positions[i + 2] = (Math.random() - 0.5) * 30;
        
        // Color (blue to purple gradient)
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
        
        // Size
        sizes[i / 3] = Math.random() * 0.2 + 0.1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// Create floating cubes
function createFloatingCubes() {
    const cubeCount = 15;
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    
    cubeSystem = new THREE.Group();
    
    for (let i = 0; i < cubeCount; i++) {
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        cube.userData = {
            originalPosition: cube.position.clone(),
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.01 + 0.005
        };
        cubeSystem.add(cube);
    }
    
    scene.add(cubeSystem);
}

// Enhanced animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Rotate particles
    if (particleSystem) {
        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;
        
        // Mouse interaction
        particleSystem.rotation.x += (mouseY - particleSystem.rotation.x) * 0.0001;
        particleSystem.rotation.y += (mouseX - particleSystem.rotation.y) * 0.0001;
        
        // Animate particle positions
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + i) * 0.001;
            positions[i] += Math.cos(time + i) * 0.001;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate cubes
    if (cubeSystem) {
        cubeSystem.children.forEach((cube, index) => {
            // Rotate cubes
            cube.rotation.x += cube.userData.rotationSpeed.x;
            cube.rotation.y += cube.userData.rotationSpeed.y;
            cube.rotation.z += cube.userData.rotationSpeed.z;
            
            // Float cubes
            const originalPos = cube.userData.originalPosition;
            cube.position.y = originalPos.y + Math.sin(time * 2 + index) * 2;
            cube.position.x = originalPos.x + Math.cos(time * 1.5 + index) * 1.5;
            
            // Pulse opacity
            cube.material.opacity = 0.2 + Math.sin(time * 3 + index) * 0.1;
        });
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
}

// Enhanced Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js
    initThreeJS();
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Updated for new navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY;
        
        if (scrolled > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.15)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'blur(15px)';
        }
    });

    // Active navigation link highlighting with improved logic
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 120; // Offset for better detection

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Update active nav on page load
    updateActiveNav();

    // Enhanced skill bars animation on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillFills = entry.target.querySelectorAll('.skill-fill');
                skillFills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        skillObserver.observe(item);
    });

    // Enhanced form submission handling
    const contactForm = document.querySelector('#contactForm');
    console.log('Contact form found:', contactForm); // Debug log
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!'); // Debug log
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            console.log('Form data:', { name, email, subject, message }); // Debug log
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Create mailto link with form data
            const mailtoLink = `mailto:mohamedwael6143@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            console.log('Mailto link:', mailtoLink); // Debug log
            
            // Open default email client
            window.location.href = mailtoLink;
            
            // Show success notification
            showNotification('Email client opened! Please send the message.', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // Projects Pagination
const projectsGrid = document.getElementById('projectsGrid');
const projectCards = document.querySelectorAll('.project-card');
const projectsPerPage = 6; // Show 6 projects per page to have 2 pages total
const totalPages = Math.ceil(projectCards.length / projectsPerPage);
let currentPage = 1;

function showProjects(page) {
    const startIndex = (page - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;

    projectCards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
            card.classList.add('show');
        } else {
            card.classList.remove('show');
        }
    });
}

function updatePagination(activePage) {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.page) === activePage) {
            btn.classList.add('active');
        }
    });
}

// Initialize projects pagination
showProjects(1);
updatePagination(1);

// Pagination button event listeners
const paginationButtons = document.querySelectorAll('.pagination-btn');
paginationButtons.forEach(button => {
    button.addEventListener('click', function() {
        const page = parseInt(this.dataset.page);
        currentPage = page;
        showProjects(page);
        updatePagination(page);
    });
});

    // Services Carousel
    const carousel = document.getElementById('servicesCarousel');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const serviceItems = document.querySelectorAll('.service-item');
    let currentSlide = 1;
    const totalSlides = 2;

    function showSlide(slideNumber) {
        const slides = document.querySelectorAll('.services-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        const activeSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        const activeDot = document.querySelector(`.carousel-dot[data-slide="${slideNumber}"]`);
        
        if (activeSlide) activeSlide.classList.add('active');
        if (activeDot) activeDot.classList.add('active');
        
        currentSlide = slideNumber;
    }

    function nextSlide() {
        currentSlide = currentSlide >= totalSlides ? 1 : currentSlide + 1;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = currentSlide <= 1 ? totalSlides : currentSlide - 1;
        showSlide(currentSlide);
    }

    // Carousel event listeners
    if (carouselNext) {
        carouselNext.addEventListener('click', nextSlide);
    }
    if (carouselPrev) {
        carouselPrev.addEventListener('click', prevSlide);
    }

    carouselDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideNumber = parseInt(this.getAttribute('data-slide'));
            showSlide(slideNumber);
        });
    });

    // Auto-advance carousel
    setInterval(nextSlide, 5000);

    

    // Enhanced counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = counter.textContent.replace(/\+$/, '') + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
                }
            };
            
            updateCounter();
        });
    }

    // Trigger counter animation when about section is in view
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        aboutObserver.observe(aboutSection);
    }

    // Enhanced parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Enhanced typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize typing effect
    const heroTitle = document.querySelector('.hero-title .glow-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }

    // Enhanced tech stack hover effects
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg) translateZ(20px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg) translateZ(0)';
        });
    });

    // Enhanced floating cube interactions
    const floatingCubes = document.querySelectorAll('.floating-cube');
    floatingCubes.forEach(cube => {
        cube.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(15deg) translateZ(30px)';
            this.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.8)';
        });
        
        cube.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg) translateZ(0)';
            this.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
        });
    });

    // Enhanced service items interactions
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02) rotateX(5deg) rotateY(5deg) translateZ(20px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    });

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Enhanced CSS for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid var(--primary-color);
            border-radius: var(--radius-lg);
            padding: 1rem;
            color: var(--text-primary);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-success {
            border-color: #10b981;
            background: rgba(16, 185, 129, 0.1);
        }
        
        .notification-error {
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
        }
        
        .nav-link.active {
            color: var(--primary-color) !important;
            background: rgba(0, 212, 255, 0.1) !important;
            box-shadow: var(--glow-primary) !important;
        }
        
        .nav-link.active::after {
            width: 80% !important;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(notificationStyles);

    // Add window event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);

    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to my enhanced 3D portfolio! 🚀', 'success');
    }, 1000);
});

// Enhanced CSS for active navigation link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
        background: rgba(0, 212, 255, 0.1) !important;
        box-shadow: var(--glow-primary) !important;
    }
    
    .nav-link.active::after {
        width: 80% !important;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);
