/* ============================================
   Seoul Talents — JavaScript
   Handles: navbar scroll, mobile menu, pricing tabs,
   stat counter animation, scroll reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- Mobile Nav Toggle ----
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Pricing Tabs ----
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingContents = document.querySelectorAll('.pricing-content');

    pricingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            pricingTabs.forEach(t => t.classList.remove('active'));
            pricingContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.querySelector(`[data-content="${target}"]`).classList.add('active');
        });
    });

    // ---- Stat Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statsAnimated = false;

    const animateCounters = () => {
        if (statsAnimated) return;

        statNumbers.forEach(el => {
            const target = parseInt(el.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                const current = Math.round(easedProgress * target);

                el.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };

            requestAnimationFrame(update);
        });

        statsAnimated = true;
    };

    // ---- Scroll Reveal / Intersection Observer ----
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Trigger stats animation when hero stats come into view
                if (entry.target.closest('.hero-stats') || entry.target.classList.contains('hero')) {
                    animateCounters();
                }
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);

    // Observe sections for reveal
    const revealElements = document.querySelectorAll(
        '.service-card, .advantage-card, .price-card, .cta-box, .eco-item, .visual-card, .hero'
    );
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Observe hero separately for stat animation
    const hero = document.querySelector('.hero');
    if (hero) observer.observe(hero);

    // Add 'revealed' class styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Stagger animation for grid items
    document.querySelectorAll('.services-grid, .advantages-grid, .pricing-grid, .about-ecosystem').forEach(grid => {
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 100);
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        gridObserver.observe(grid);
    });

    // ---- Smooth Scroll for Nav Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

});
