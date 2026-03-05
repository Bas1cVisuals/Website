/* js/main.js */
document.addEventListener('DOMContentLoaded', () => {

    // --- Back to Top Functionality ---
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the default anchor link behavior
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Smoothly scroll to the very top
            });
        });
    }

    // --- Interactive Background Parallax ---
    const bgGlow = document.querySelector('.bg-glow');
    
    // Only run mouse tracking on desktop to save battery/performance on mobile
    if (window.innerWidth > 768 && bgGlow) {
        document.addEventListener('mousemove', (e) => {
            // Calculate mouse position relative to the center of the screen
            const x = (e.clientX / window.innerWidth - 0.5) * 60; // Max movement 60px
            const y = (e.clientY / window.innerHeight - 0.5) * 60;
            
            // Apply a smooth transform to the background glow
            bgGlow.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    
    // --- Navbar & Mobile Menu ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    const toggleMenu = () => {
        mobileMenu.classList.toggle('open');
        const lines = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    };

    hamburger.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // --- Footer Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Scroll Reveal (Intersection Observer) ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // --- Pricing Toggle ---
    const pricingSwitch = document.getElementById('pricing-switch');
    const monthlyBtn = document.getElementById('monthly-btn');
    const projectBtn = document.getElementById('project-btn');
    const prices = document.querySelectorAll('.price');

    pricingSwitch.addEventListener('change', (e) => {
        const isProject = e.target.checked;
        if(isProject) {
            monthlyBtn.classList.remove('active');
            projectBtn.classList.add('active');
        } else {
            monthlyBtn.classList.add('active');
            projectBtn.classList.remove('active');
        }

        prices.forEach(price => {
            price.style.opacity = 0;
            setTimeout(() => {
                price.innerHTML = isProject ? price.getAttribute('data-project') : price.getAttribute('data-monthly');
                if(!isProject) price.innerHTML = price.innerHTML.replace('/mo', '<span>/mo</span>');
                price.style.opacity = 1;
            }, 200);
        });
    });

    // --- Testimonial Carousel ---
    const track = document.getElementById('testimonial-track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    const updateCarousel = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    };

    slides[0].classList.add('active');

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateCarousel(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateCarousel(currentIndex);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('.dot');
        if (!targetDot) return;
        currentIndex = parseInt(targetDot.dataset.index);
        updateCarousel(currentIndex);
    });

    let autoAdvance = setInterval(() => nextBtn.click(), 5000);
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    carouselContainer.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => nextBtn.click(), 5000);
    });

    // --- FAQ Accordion ---
    const accItems = document.querySelectorAll('.accordion-item');
    accItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const content = item.querySelector('.accordion-content');
            const isOpen = item.classList.contains('open');
            
            // Close others
            accItems.forEach(otherItem => {
                otherItem.classList.remove('open');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- Contact Form & Toast ---
    const form = document.getElementById('contactForm');
    const toastContainer = document.getElementById('toast-container');

    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn ? submitBtn.textContent : null;

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        const formData = new FormData(form);

        const res = await fetch(form.action, {
            method: form.method || 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (res.ok) {
            showToast('Thanks! Your message has been sent.');
            form.reset();
        } else {
            // Formspree returns JSON errors sometimes
            showToast('Error: message not sent. Try again.');
        }
    } catch (err) {
        showToast('Network error. Please try again.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText || 'Send Message';
        }
    }
});

    // --- Copy Email ---
    const copyEmailBtn = document.querySelector('.copy-email');
    copyEmailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = copyEmailBtn.getAttribute('data-email');
        navigator.clipboard.writeText(email).then(() => {
            const icon = copyEmailBtn.querySelector('.copy-icon');
            icon.textContent = '✓';
            showToast('Email copied to clipboard!');
            setTimeout(() => icon.textContent = '📋', 2000);
        });
    });

    // --- Modal Logic & Iframe handling ---
    const iframe = document.getElementById('notionIframe');
    const loader = document.getElementById('iframeLoader');
    const fallback = document.getElementById('iframeFallback');
    
    // Original URL
    const notionUrl = "https://bas1c-visuals-portfolio.notion.site/ebd/2eecbbfa0e9681c49666f3c256550b81";

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load iframe logic on first open
        if(!iframe.src) {
            // Notion block frame workaround attempt (Appending ?embed=1 is a standard fallback attempt)
            iframe.src = notionUrl;
            
            iframe.onload = () => {
                iframe.classList.add('loaded');
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 300);
            };

            // Basic error catch for X-Frame-Options (Note: pure JS can't detect cross-origin X-Frame-Options easily, 
            // so we rely on a timeout if the onload doesn't fire correctly, or if explicitly blocked)
            setTimeout(() => {
                if(!iframe.classList.contains('loaded')) {
                    fallback.classList.add('show');
                    loader.style.display = 'none';
                    setTimeout(() => loader.style.display = 'none', 300);
                }
            }, 2500);
        }
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    }));
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- Magnetic Button Effect ---
    // Let's target all your primary and secondary buttons
    const magneticBtns = document.querySelectorAll('.btn'); 

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            // Get the button's exact position and size
            const rect = btn.getBoundingClientRect();
            
            // Calculate how far the mouse is from the center of the button
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the button slightly towards the mouse (multiply by 0.3 to keep it subtle)
            // We temporarily remove the transition so the movement perfectly tracks the mouse without lag
            btn.style.transition = 'transform 0.1s ease-out';
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        // When the mouse leaves, reset the button back to the center
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'; // Restore your original smooth transition
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

}); // <-- THIS IS THE FINAL CLOSING BRACKET OF YOUR main.js FILE