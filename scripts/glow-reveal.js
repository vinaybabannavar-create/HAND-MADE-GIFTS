/**
 * Glow Reveal — Scroll-triggered animations
 * Safely adds entrance animations without hiding content permanently.
 * Uses IntersectionObserver with a safety fallback.
 */
(function () {
    'use strict';

    // We wait a small delay so the page renders first, 
    // then add animation classes. This prevents content from disappearing.
    function init() {
        const revealElements = [];

        // Collect elements to reveal (only those currently in the document)
        function collect(selector, className) {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.classList.contains(className)) {
                    revealElements.push({ el, className });
                }
            });
        }

        // Page titles
        collect('.page-title, .section-title, .experience-title', 'glow-reveal');

        // Sections
        collect('.about-story-section, .vision-box, .contact-cta, .quote-section', 'glow-reveal-scale');

        // Hero (don't animate — it's above the fold and should be visible immediately)
        // collect('.hero-section', 'glow-reveal-scale');

        // Contact form / direct contact
        collect('.contact-form-section', 'glow-reveal-left');
        collect('.direct-contact-section', 'glow-reveal-right');

        // Carousel and promo
        collect('.banner-carousel-container, .promo-banner', 'glow-reveal');

        // Stagger grids
        collect('.step-grid, .experience-grid', 'glow-stagger');
        // Don't stagger product-grid or contact-grid - too many items risk staying hidden

        // Cart and checkout sections
        collect('.cart-items-section, .cart-summary-card', 'glow-reveal-scale');
        collect('.checkout-card', 'glow-reveal-scale');

        // Dashboard
        collect('.dashboard-sidebar', 'glow-reveal-left');
        collect('.dashboard-content', 'glow-reveal-right');

        // Footer
        collect('.main-footer', 'glow-reveal');

        // Now add classes and observe
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px'
        });

        revealElements.forEach(({ el, className }) => {
            el.classList.add(className);
            observer.observe(el);
        });

        // SAFETY NET: After 2 seconds, force-reveal everything that hasn't been revealed yet
        // This prevents content from staying permanently hidden
        setTimeout(() => {
            document.querySelectorAll('.glow-reveal, .glow-reveal-left, .glow-reveal-right, .glow-reveal-scale, .glow-stagger').forEach(el => {
                el.classList.add('visible');
            });
        }, 2500);
    }

    // Run after page is fully loaded and rendered
    if (document.readyState === 'complete') {
        setTimeout(init, 100);
    } else {
        window.addEventListener('load', () => setTimeout(init, 100));
    }
})();
