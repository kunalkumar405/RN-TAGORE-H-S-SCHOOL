/**
 * first.js - Improved Version with Keyboard Shortcuts
 *
 * Improvements:
 * - Encapsulated in DOMContentLoaded.
 * - Null checks for elements.
 * - Optimized scroll listeners (throttled).
 * - ARIA attribute for mobile menu button.
 * - Escape key to close lightbox.
 * - Added Keyboard Shortcuts (Alt+T, Alt+C, Alt+M) with warnings.
 * - Added comments.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selections ---
    const header = document.querySelector('header.header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const backToTopBtn = document.getElementById('backToTop');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const contactForm = document.getElementById('contactForm');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const navMenuLinks = navMenu ? navMenu.querySelectorAll('a') : [];

    // --- Mobile Menu ---
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isActive);
            mobileMenuBtn.innerHTML = isActive
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        navMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    } else {
        console.warn("Mobile menu button or navigation menu element not found.");
    }

    // --- Throttling Function ---
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            const context = this;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    // --- Combined & Throttled Scroll Events Handler ---
    let headerWarned = false; // Flags to prevent repeated warnings
    let backToTopWarned = false;
    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Sticky Header Logic
        if (header) {
            header.classList.toggle('sticky', scrollY > 0);
        } else if (!headerWarned) {
            console.warn("Header element not found for sticky functionality.");
            headerWarned = true;
        }

        // Back to Top Button Logic
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('active', scrollY > 300);
        } else if (!backToTopWarned) {
            console.warn("Back to Top button element not found.");
            backToTopWarned = true;
        }
    };

    const throttledScrollHandler = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScrollHandler);

    // --- Back to Top Button Click ---
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // Warning logged in scroll handler if missing

    // --- Gallery Lightbox ---
    if (lightbox && lightboxImg && lightboxClose && galleryItems.length > 0) {
        const openLightbox = (imgSrc) => {
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            lightboxClose.focus();
        };
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightboxImg.src = "";
            document.body.style.overflow = 'auto';
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const img = item.querySelector('img');
                if (img && img.src) {
                    openLightbox(img.src);
                } else {
                    console.warn("Image source not found in gallery item.", item);
                }
            });
        });
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
        });
    } else {
        // Log warnings if lightbox functionality expected but elements missing
        if (!lightbox) console.warn("Lightbox container element (#lightbox) not found.");
        if (!lightboxImg) console.warn("Lightbox image element (#lightbox-img) not found.");
        if (!lightboxClose) console.warn("Lightbox close button (#lightbox-close) not found.");
        if (galleryItems.length === 0) console.warn("No gallery items (.gallery-item) found.");
    }

    // --- Contact Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Form submitted (data):', data);

            // --- !!! Replace with actual fetch logic !!! ---
            setTimeout(() => { // Simulate network delay
               alert('Thank you! Message simulation complete.'); // Placeholder message
               contactForm.reset();
               if (submitButton) submitButton.disabled = false;
            }, 500);
            // --- End of Placeholder ---
        });
    } else {
        console.warn("Contact form element (#contactForm) not found.");
    }

    // --- Smooth Scrolling for Anchor Links ---
    if (smoothScrollLinks.length > 0) {
        smoothScrollLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                    e.preventDefault();
                    try {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            const headerOffset = header ? header.offsetHeight : 80;
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.scrollY - headerOffset;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        } else {
                             console.warn(`Smooth scroll target element not found: ${targetId}`);
                        }
                    } catch (error) {
                        console.error(`Error finding smooth scroll target: ${targetId}`, error);
                    }
                }
            });
        });
    }

    // --- Keyboard Shortcuts (Alt + Key) ---
    // WARNING: Alt key combinations can conflict with browser/OS shortcuts.
    // Test thoroughly. Consider documenting these shortcuts for users if implemented.
    if (window) {
        window.addEventListener('keydown', (e) => {
            // Only proceed if Alt key is pressed
            if (!e.altKey) return;

            const key = e.key.toLowerCase();
            let preventDefault = false; // Flag to prevent default browser action

            switch (key) {
                case 't': // Alt + T: Scroll to Top
                    preventDefault = true;
                    console.log('Alt+T pressed: Scrolling to top');
                    if (backToTopBtn && backToTopBtn.offsetParent !== null) { // Check if button is visible
                        backToTopBtn.click(); // Use click to trigger smooth scroll
                    } else {
                        // Fallback if button isn't active/found
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    break;

                case 'c': // Alt + C: Scroll to Contact Section
                    preventDefault = true;
                    console.log('Alt+C pressed: Scrolling to contact');
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                         const headerOffset = header ? header.offsetHeight : 80;
                         const elementPosition = contactSection.getBoundingClientRect().top;
                         const offsetPosition = elementPosition + window.scrollY - headerOffset;
                         window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    } else {
                         console.warn("Contact section element (#contact) not found for Alt+C.");
                    }
                    break;

                case 'm': // Alt + M: Toggle Mobile Menu
                     preventDefault = true;
                     console.log('Alt+M pressed: Toggling mobile menu');
                     if (mobileMenuBtn) {
                         mobileMenuBtn.click(); // Simulate click to toggle
                     } else {
                         console.warn("Mobile menu button not found for Alt+M.");
                     }
                    break;

                // --- Example: Add more shortcuts below ---
                /*
                case 'a': // Alt + A: Scroll to About Section
                    preventDefault = true;
                    console.log('Alt+A pressed: Scrolling to about');
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                        const headerOffset = header ? header.offsetHeight : 80;
                        const elementPosition = aboutSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    } else {
                         console.warn("About section element (#about) not found for Alt+A.");
                    }
                    break;
                */
            }

            // Prevent default browser action if we handled the shortcut
            if (preventDefault) {
                e.preventDefault();
            }
        });

        // Log initialization only once
        console.log("Keyboard shortcuts (Alt+T, Alt+C, Alt+M) initialized. WARNING: May conflict with browser/OS shortcuts.");

    } // End if(window)

    // --- Add any other JS functionalities below ---

}); // End DOMContentLoaded