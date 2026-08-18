// ==================== INITIALIZATION ==================== 

document.addEventListener('DOMContentLoaded', () => {
    initAnimatedParticles();
    initSmoothScroll();
    initIntersectionObserver();
    initHeaderScroll();
    initCounterAnimation();
    initCustomCursor();
});

// ==================== CUSTOM CURSOR ==================== 

function initCustomCursor() {
    // Проверка настроек пользователя на уменьшение анимации
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Проверка на сенсорное устройство
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    // Определяем, должна ли запускаться анимация
    // Анимация работает только на не-сенсорных устройствах 
    // и когда пользователь не запрашивал уменьшение движения
    const shouldRun = !isReducedMotion && !isTouch;

    if (!shouldRun) return; // Выход, если анимация не должна запускаться

    // Получение ссылки на DOM элемент
    const pointer = document.querySelector(".pointer");
    if (!pointer) return;

    // Переменные для хранения координат мыши
    let mouseX = 0;
    let mouseY = 0;

    // Скрыть стандартный курсор
    document.body.style.cursor = 'none';
    
    // Показать стандартный курсор поверх круга
    pointer.style.cursor = 'auto';

    // Обработчик события движения мыши
    window.addEventListener("mousemove", (e) => {
        // Сохраняем координаты курсора относительно окна браузера
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Функция анимации, использующая requestAnimationFrame
    function animate() {
        // Установка CSS-переменных для позиционирования указателя
        // setProperty позволяет динамически изменять CSS custom properties
        document.documentElement.style.setProperty("--mouseX", `${mouseX}px`);
        document.documentElement.style.setProperty("--mouseY", `${mouseY}px`);

        // Запрос следующего кадра анимации
        // Это обеспечивает синхронизацию с частотой обновления экрана (обычно 60 FPS)
        requestAnimationFrame(animate);
    }

    // Вернуть курсор при выходе из окна
    document.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'auto';
        pointer.style.opacity = '0';
    });

    // Показать курсор при входе в окно
    document.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'none';
        pointer.style.opacity = '1';
    });

    // Запуск цикла анимации
    animate();
}

// ==================== ANIMATED PARTICLES ==================== 

function initAnimatedParticles() {
    const container = document.querySelector('.animated-particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, #3b82f6, transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            pointer-events: none;
            animation: particle-float ${Math.random() * 20 + 20}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }

    // Add keyframes for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-float {
            0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0.2;
            }
            25% {
                opacity: 0.5;
            }
            50% {
                transform: translateY(-100px) translateX(50px);
                opacity: 0.3;
            }
            75% {
                opacity: 0.4;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== SMOOTH SCROLL ==================== 

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== INTERSECTION OBSERVER ==================== 

function initIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger card entrance animations
                if (entry.target.classList.contains('benefit-card') ||
                    entry.target.classList.contains('pricing-card') ||
                    entry.target.classList.contains('faq-card') ||
                    entry.target.classList.contains('timeline-content')) {
                    entry.target.style.animation = 'slideUp 0.6s ease forwards';
                }

                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe all cards
    document.querySelectorAll('.benefit-card, .pricing-card, .faq-card, .timeline-content').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

// ==================== HEADER SCROLL EFFECT ==================== 

function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(15, 17, 23, 0.9)';
            header.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(15, 17, 23, 0.7)';
            header.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            header.style.backdropFilter = 'blur(12px)';
        }
    });
}

// ==================== COUNTER ANIMATION ==================== 

function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;
        animated = true;

        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-count'));
            const duration = 2000;
            const start = Date.now();

            const updateCounter = () => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = target * easeOutQuart;

                // Format the number
                if (target >= 1000) {
                    counter.textContent = Math.floor(current).toLocaleString();
                } else if (target % 1 !== 0) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    // Start animation when stats section is in view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animateCounters();
                observer.unobserve(statsSection);
            }
        });

        observer.observe(statsSection);
    }
}

// ==================== BUTTON RIPPLE EFFECT ==================== 

function addRippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple-animate 0.6s ease-out;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animate {
            0% {
                width: 0;
                height: 0;
                opacity: 0.5;
            }
            100% {
                width: 400px;
                height: 400px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== PHONE MOCKUP MESSAGE ANIMATION ==================== 

function animatePhoneMessages() {
    const messages = document.querySelectorAll('.tg-messages .message-in, .tg-messages .message-out');
    messages.forEach((msg, index) => {
        msg.style.animation = `slideUp 0.5s ease forwards ${index * 0.3}s`;
        msg.style.opacity = '0';
    });
}

// ==================== SCROLL TO TOP BUTTON ==================== 

function initScrollToTop() {
    let scrollTopBtn;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            if (!scrollTopBtn) {
                scrollTopBtn = document.createElement('button');
                scrollTopBtn.innerHTML = '↑';
                scrollTopBtn.style.cssText = `
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    font-size: 24px;
                    cursor: pointer;
                    z-index: 999;
                    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
                    animation: fadeIn 0.3s ease;
                    transition: all 0.3s ease;
                `;
                
                scrollTopBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                
                scrollTopBtn.addEventListener('mouseover', () => {
                    scrollTopBtn.style.transform = 'translateY(-5px)';
                    scrollTopBtn.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.4)';
                });
                
                scrollTopBtn.addEventListener('mouseout', () => {
                    scrollTopBtn.style.transform = 'translateY(0)';
                    scrollTopBtn.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)';
                });
                
                document.body.appendChild(scrollTopBtn);
            }
        } else if (scrollTopBtn) {
            scrollTopBtn.remove();
            scrollTopBtn = null;
        }
    });
}

// ==================== PARALLAX EFFECT ==================== 

function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        orbs.forEach((orb, index) => {
            const speed = 0.1 + index * 0.05;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// ==================== TYPING INDICATOR CONTINUOUS ANIMATION ==================== 

function startTyping() {
    const typing = document.querySelector('.typing-indicator');
    if (typing) {
        // Add continuous blinking to typing indicator
        setInterval(() => {
            typing.style.opacity = typing.style.opacity === '0.5' ? '1' : '0.5';
        }, 500);
    }
}

// ==================== FAQ INTERACTIVE ==================== 

function initFAQ() {
    document.querySelectorAll('.faq-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// ==================== PRICING CARD HIGHLIGHT ==================== 

function initPricingInteraction() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            pricingCards.forEach(c => {
                if (c !== this) {
                    c.style.opacity = '0.6';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            pricingCards.forEach(c => {
                c.style.opacity = '1';
            });
        });
    });
}

// ==================== ACTIVE CALL ==================== 

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
    addRippleEffect();
    animatePhoneMessages();
    initScrollToTop();
    initParallax();
    startTyping();
    initFAQ();
    initPricingInteraction();
    
    // Add entrance animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});

// Console message
console.log('%c⚡ TG WS PROXY', 'font-size: 24px; font-weight: bold; color: #3b82f6;');
console.log('%cПрокси для Telegram без ограничений', 'font-size: 14px; color: #a1aac1;');
console.log('%cПопробовать бесплатно → https://tgwsproxy.com', 'font-size: 12px; color: #10b981;');
