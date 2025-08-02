// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initStatCounters();
    initSmoothScrolling();
    initParallaxEffects();
    initPhoneInteraction();
    initCurrencyConversion();
    initThemeSwitcher();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-item, .stat-item');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Special animations for specific sections
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    
    if (aboutText) {
        aboutText.classList.add('slide-in-left');
        observer.observe(aboutText);
    }
    
    if (aboutImage) {
        aboutImage.classList.add('slide-in-right');
        observer.observe(aboutImage);
    }
}

// Currency conversion functionality
function initCurrencyConversion() {
    // Get user location and set currency
    getUserLocation()
        .then(country => {
            setCurrency(country);
        })
        .catch(() => {
            // Default to GBP if location detection fails
            setCurrency('GB');
        });
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        // Try to get location from timezone
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Map common timezones to countries
        const timezoneToCountry = {
            'Europe/London': 'GB',
            'Europe/Berlin': 'DE',
            'Europe/Paris': 'FR',
            'Europe/Madrid': 'ES',
            'Europe/Rome': 'IT',
            'America/New_York': 'US',
            'America/Chicago': 'US',
            'America/Denver': 'US',
            'America/Los_Angeles': 'US',
            'America/Toronto': 'CA'
        };
        
        const country = timezoneToCountry[timeZone] || 'GB';
        resolve(country);
    });
}

function setCurrency(country) {
    const currencyMap = {
        'GB': { symbol: '£', type: 'gbp' },
        'DE': { symbol: '€', type: 'eur' },
        'FR': { symbol: '€', type: 'eur' },
        'ES': { symbol: '€', type: 'eur' },
        'IT': { symbol: '€', type: 'eur' },
        'US': { symbol: '$', type: 'usd' },
        'CA': { symbol: '$', type: 'usd' }
    };
    
    const currency = currencyMap[country] || { symbol: '£', type: 'gbp' };
    
    // Update currency symbols
    document.querySelectorAll('.currency-symbol').forEach(element => {
        element.textContent = currency.symbol;
    });
    
    // Update prices
    document.querySelectorAll('.price-amount, .addon-price').forEach(element => {
        const gbpPrice = element.getAttribute('data-gbp');
        const eurPrice = element.getAttribute('data-eur');
        const usdPrice = element.getAttribute('data-usd');
        
        let newPrice = gbpPrice; // default
        
        switch(currency.type) {
            case 'eur':
                newPrice = eurPrice;
                break;
            case 'usd':
                newPrice = usdPrice;
                break;
            default:
                newPrice = gbpPrice;
        }
        
        element.textContent = newPrice;
    });
}

// Phone number click-to-call functionality
function initPhoneInteraction() {
    const phoneNumber = document.querySelector('.phone-number');
    
    if (phoneNumber) {
        phoneNumber.addEventListener('click', () => {
            const number = phoneNumber.textContent.replace(/\s/g, '');
            window.location.href = `tel:${number}`;
        });
        
        // Add cursor pointer style
        phoneNumber.style.cursor = 'pointer';
        phoneNumber.title = 'Click to call';
    }
}

// Statistics counter animation
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(number => {
        counterObserver.observe(number);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Skip if href is just '#' or empty
            if (!targetId || targetId === '#') {
                return;
            }
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effects
function initParallaxEffects() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            card.style.transform = `translateY(${rate * speed}px)`;
        });
    });

    // Mouse movement parallax for hero section
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPos = (clientX / innerWidth) - 0.5;
            const yPos = (clientY / innerHeight) - 0.5;
            
            floatingCards.forEach((card, index) => {
                const speed = 20 + (index * 10);
                card.style.transform += ` translate(${xPos * speed}px, ${yPos * speed}px)`;
            });
        });
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: '#cdd6f4',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #a6e3a1, #94e2d5)';
        notification.style.color = '#1e1e2e';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f38ba8, #eba0ac)';
        notification.style.color = '#1e1e2e';
    } else {
        notification.style.background = 'linear-gradient(135deg, #89b4fa, #b4befe)';
        notification.style.color = '#1e1e2e';
    }

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Handle scroll-based animations here if needed
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Add custom cursor effect (optional enhancement)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, var(--ctp-blue), var(--ctp-mauve));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.7';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Initialize custom cursor on desktop devices
if (window.innerWidth > 768) {
    initCustomCursor();
}

// Add resize handler for responsive adjustments
window.addEventListener('resize', throttle(() => {
    // Handle responsive adjustments here
    if (window.innerWidth <= 768) {
        // Mobile optimizations
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
}, 250));

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Add focus management for accessibility
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Theme Switcher functionality
function initThemeSwitcher() {
    const themeSwitcher = document.getElementById('themeSwitcher');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    if (!themeSwitcher || !themeDropdown) return;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('catppuccin-theme') || 'mocha';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update active state
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === savedTheme) {
            option.classList.add('active');
        }
    });

    // Toggle dropdown
    themeSwitcher.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('active');
    });

    // Handle theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedTheme = option.dataset.theme;
            
            // Update theme
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('catppuccin-theme', selectedTheme);
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Close dropdown
            themeDropdown.classList.remove('active');
            
            // Add smooth transition effect
            document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
            
            // Show notification
            showNotification(`Theme changed to ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}`, 'success');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        themeDropdown.classList.remove('active');
    });

    // Prevent dropdown from closing when clicking inside it
    themeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close dropdown with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && themeDropdown.classList.contains('active')) {
            themeDropdown.classList.remove('active');
        }
    });
                              }
