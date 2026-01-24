// Canvas Background Animation - Floating Particles and Bubbles
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + 50;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.drift = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.y -= this.speed;
        this.x += this.drift;
        
        // Reset particle when it goes off screen
        if (this.y < -50 || this.x < -50 || this.x > this.canvas.width + 50) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 136, 255, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class Bubble {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + 100;
        this.radius = Math.random() * 20 + 10;
        this.speed = Math.random() * 0.8 + 0.3;
        this.drift = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.wobble = Math.random() * 0.02 + 0.01;
        this.wobbleOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.y -= this.speed;
        this.x += this.drift + Math.sin(Date.now() * this.wobble + this.wobbleOffset) * 0.5;
        
        if (this.y < -100 || this.x < -100 || this.x > this.canvas.width + 100) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Bubble outline
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Bubble highlight
        const highlightGradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
            this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.5
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.bubbles = [];
        this.connections = [];
        
        this.init();
        this.animate();
        this.handleResize();
    }

    init() {
        this.resizeCanvas();
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.canvas));
        }
        
        // Create bubbles
        for (let i = 0; i < 15; i++) {
            this.bubbles.push(new Bubble(this.canvas));
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    drawConnections() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.restore();
    }

    animate() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(10, 10, 10, 0.1)');
        gradient.addColorStop(0.5, 'rgba(26, 26, 46, 0.1)');
        gradient.addColorStop(1, 'rgba(22, 33, 62, 0.1)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        // Update and draw bubbles
        this.bubbles.forEach(bubble => {
            bubble.update();
            bubble.draw(this.ctx);
        });
        
        // Draw connections between particles
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.animateCounters();
        this.smoothScroll();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe section titles and cards
        document.querySelectorAll('.section-title, .glass-card, .timeline-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease';
            observer.observe(el);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.result-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Navbar Scroll Effect
class NavbarEffects {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(0, 0, 0, 0.9)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            } else {
                this.navbar.style.background = 'rgba(0, 0, 0, 0.1)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            }
        });
    }
}

// Process Flow Animation
class ProcessFlowAnimation {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateFlow();
                    observer.unobserve(entry.target);
                }
            });
        });

        const processSection = document.querySelector('#process');
        if (processSection) {
            observer.observe(processSection);
        }
    }

    animateFlow() {
        const steps = document.querySelectorAll('.flow-step');
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.style.opacity = '1';
                step.style.transform = 'translateX(0)';
                
                // Add tank filling animation
                const tank = step.querySelector('.tank');
                if (tank) {
                    tank.style.animation = 'none';
                    setTimeout(() => {
                        tank.style.animation = '';
                    }, 100);
                }
            }, index * 200);
        });
    }
}

// Particle Cursor Effect
class CursorEffect {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.1) {
                this.createParticle(e.clientX, e.clientY);
            }
        });

        this.animate();
    }

    createParticle(x, y) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            decay: Math.random() * 0.02 + 0.01
        };

        this.particles.push(particle);
    }

    animate() {
        // Clean up old particles
        this.particles = this.particles.filter(p => p.life > 0);

        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Experiment Gallery Functionality
class ExperimentGallery {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxMedia = document.querySelector('.lightbox-media');
        this.lightboxTitle = document.getElementById('lightbox-title');
        this.lightboxDescription = document.getElementById('lightbox-description');
        this.lightboxClose = document.querySelector('.lightbox-close');
        
        this.init();
    }

    init() {
        this.setupGalleryItems();
        this.setupLightbox();
        this.setupVideoControls();
        this.observeGalleryItems();
    }

    setupGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            // Skip placeholder items
            if (item.classList.contains('placeholder-item')) return;
            
            const mediaContainer = item.querySelector('.media-container');
            const caption = item.querySelector('.gallery-caption');
            
            mediaContainer.addEventListener('click', () => {
                this.openLightbox(item);
            });

            // Video hover effects
            if (item.classList.contains('video-item')) {
                const video = item.querySelector('.gallery-video');
                const playOverlay = item.querySelector('.play-overlay');
                
                mediaContainer.addEventListener('mouseenter', () => {
                    video.play().catch(e => console.log('Video play failed:', e));
                });
                
                mediaContainer.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
            }
        });
    }

    setupLightbox() {
        // Close lightbox when clicking close button
        this.lightboxClose.addEventListener('click', () => {
            this.closeLightbox();
        });

        // Close lightbox when clicking outside content
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
        });
    }

    openLightbox(item) {
        const isVideo = item.classList.contains('video-item');
        const mediaElement = isVideo ? 
            item.querySelector('.gallery-video') : 
            item.querySelector('.gallery-image');
        
        const title = item.querySelector('.gallery-caption h4').textContent;
        const description = item.querySelector('.gallery-caption p').textContent;

        // Clear previous content
        this.lightboxMedia.innerHTML = '';

        if (isVideo) {
            const video = document.createElement('video');
            video.src = mediaElement.src;
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '70vh';
            this.lightboxMedia.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = mediaElement.src;
            img.alt = mediaElement.alt;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '70vh';
            img.style.objectFit = 'contain';
            this.lightboxMedia.appendChild(img);
        }

        this.lightboxTitle.textContent = title;
        this.lightboxDescription.textContent = description;

        // Show lightbox
        this.lightbox.style.display = 'flex';
        setTimeout(() => {
            this.lightbox.classList.add('active');
        }, 10);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        
        setTimeout(() => {
            this.lightbox.style.display = 'none';
            this.lightboxMedia.innerHTML = '';
        }, 300);

        // Restore body scroll
        document.body.style.overflow = '';
    }

    setupVideoControls() {
        const videos = document.querySelectorAll('.gallery-video');
        
        videos.forEach(video => {
            // Ensure videos are muted and ready
            video.muted = true;
            video.preload = 'metadata';
            
            // Add loading state
            video.addEventListener('loadstart', () => {
                const container = video.closest('.media-container');
                container.style.opacity = '0.7';
            });
            
            video.addEventListener('canplay', () => {
                const container = video.closest('.media-container');
                container.style.opacity = '1';
            });
        });
    }

    observeGalleryItems() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.gallery-item').forEach(item => {
            observer.observe(item);
        });
    }
}

// Gallery Loading and Lazy Loading
class GalleryLoader {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadVideos();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('.gallery-image[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    preloadVideos() {
        const videos = document.querySelectorAll('.gallery-video');
        
        videos.forEach(video => {
            // Create a small preview by seeking to 1 second
            video.addEventListener('loadedmetadata', () => {
                video.currentTime = 1;
            });
        });
    }
}

// Gallery Animation Effects
class GalleryEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addScrollEffects();
    }

    addHoverEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Add subtle glow effect
                item.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.3)';
                
                // Animate media type badge
                const badge = item.querySelector('.media-type-badge');
                if (badge) {
                    badge.style.transform = 'scale(1.1)';
                }
            });

            item.addEventListener('mouseleave', () => {
                item.style.boxShadow = '';
                
                const badge = item.querySelector('.media-type-badge');
                if (badge) {
                    badge.style.transform = 'scale(1)';
                }
            });
        });
    }

    addScrollEffects() {
        const gallerySection = document.querySelector('#gallery');
        
        if (gallerySection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Trigger staggered animation for gallery items
                        const items = entry.target.querySelectorAll('.gallery-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(gallerySection);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundAnimation();
    new ScrollAnimations();
    new NavbarEffects();
    new ProcessFlowAnimation();
    new CursorEffect();
    
    // Initialize Gallery Components
    new ExperimentGallery();
    new GalleryLoader();
    new GalleryEffects();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);

    // CTA Button interaction
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Add hover effects to cards
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Tank hover effects
    document.querySelectorAll('.tank').forEach(tank => {
        tank.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotateY(10deg)';
            this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
        });

        tank.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)';
            this.style.boxShadow = 'none';
        });
    });

    // Add typing effect to hero title
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        setTimeout(typeWriter, 1000);
    }

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add glow effect on scroll
    const glowElements = document.querySelectorAll('.glass-card, .tank, .timeline-marker');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                setTimeout(() => {
                    entry.target.style.boxShadow = '';
                }, 1000);
            }
        });
    });

    glowElements.forEach(el => observer.observe(el));
});

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical animations
    document.body.classList.add('loaded');
    
    // Optimize canvas rendering
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
    }
});