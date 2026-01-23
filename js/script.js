// Configuration
const CAROUSEL_CONFIG = {
    autoplayInterval: 5000,
    transitionDuration: 500,
    mobileBreakpoint: 768,
    debug: true // Enable debug logging
};

// Global state
let carouselState = {
    interval: null,
    isPaused: false,
    currentIndex: 0
};

// Utility function for debug logging
function log(message, data = null) {
    if (CAROUSEL_CONFIG.debug) {
        if (data) {
            console.log(`[Carousel] ${message}`, data);
        } else {
            console.log(`[Carousel] ${message}`);
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    log('DOM Content Loaded');
    initializeImages();
    initializeTestimonials();
    loadHeaderFooter();
    calculateYears();
});

// Calculate dynamic years for experience
function calculateYears() {
    const currentYear = new Date().getFullYear();
    const techYears = currentYear - 2010;
    const pmYears = currentYear - 2018;

    const techEl = document.getElementById('tech-years');
    const pmEl = document.getElementById('pm-years');

    if (techEl) techEl.textContent = techYears;
    if (pmEl) pmEl.textContent = pmYears;
}

function loadHeaderFooter() {
    log('Loading header and footer');
    // Load header
    fetch('header.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            log('Header loaded');
        })
        .catch(error => log('Error loading header:', error));

    // Load footer
    fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            log('Footer loaded');
        })
        .catch(error => log('Error loading footer:', error));
}

function initializeImages() {
    log('Initializing images');
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        profileImage.onerror = () => {
            log('Profile image load error, using placeholder');
            profileImage.src = 'images/placeholder.png';
        };
    }
}

function initializeTestimonials() {
    log('Initializing testimonials');
    // Update path to match your directory structure
    fetch('data/testimonials.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            log('Testimonials data received', data);
            renderTestimonials(data);
            setupCarouselControls();
            startCarouselAutoplay();
        })
        .catch(error => {
            log('Error loading testimonials:', error);
            const container = document.querySelector('.testimonials');
            if (container) {
                container.innerHTML += `
                    <p style="color: red;">Error loading testimonials. Please try again later.</p>
                    <p style="color: red;">Details: ${error.message}</p>
                `;
            }
        });
}

function renderTestimonials(testimonials) {
    log('Rendering testimonials');
    const container = document.getElementById('testimonial-container');
    if (!container) {
        log('Error: Testimonial container not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Add testimonials
    testimonials.forEach((testimonial, index) => {
        const testimonialElement = createTestimonialElement(testimonial);
        container.appendChild(testimonialElement);
        log(`Added testimonial ${index + 1}`);
    });

    // Clone first two testimonials for infinite scroll
    if (testimonials.length >= 2) {
        const first = container.children[0].cloneNode(true);
        const second = container.children[1].cloneNode(true);
        container.appendChild(first);
        container.appendChild(second);
        log('Added clone testimonials for infinite scroll');
    }
}

function createTestimonialElement(testimonial) {
    const element = document.createElement('div');
    element.className = 'testimonial';
    element.innerHTML = `<div class="testimonial-content"><h3>${testimonial.name}</h3><p class="title">(${testimonial.title})</p><p class="relationship">${testimonial.relationship}</p><blockquote>"${testimonial.quote}"</blockquote><a href="https://www.linkedin.com/in/prashant-rana/details/recommendations/?detailScreenTabIndex=0" class="read-more" target="_blank" rel="noopener">Read more →</a></div>`;
    return element;
}

function setupCarouselControls() {
    log('Setting up carousel controls');
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            carouselState.isPaused = true;
            log('Carousel paused');
        });

        carousel.addEventListener('mouseleave', () => {
            carouselState.isPaused = false;
            log('Carousel resumed');
        });
    }
}

function startCarouselAutoplay() {
    log('Starting carousel autoplay');
    if (carouselState.interval) {
        clearInterval(carouselState.interval);
    }

    carouselState.interval = setInterval(() => {
        if (!carouselState.isPaused) {
            moveCarousel();
        }
    }, CAROUSEL_CONFIG.autoplayInterval);
}

function moveCarousel() {
    const container = document.getElementById('testimonial-container');
    if (!container) {
        log('Error: Testimonial container not found during move');
        return;
    }

    carouselState.currentIndex++;
    const slideWidth = 50; // Each slide takes 50% of container width

    log(`Moving carousel to index ${carouselState.currentIndex}`);

    container.style.transition = 'transform 0.5s ease';
    container.style.transform = `translateX(-${carouselState.currentIndex * slideWidth}%)`;

    // Reset when reaching cloned elements
    if (carouselState.currentIndex >= (container.children.length - 2)) {
        setTimeout(() => {
            container.style.transition = 'none';
            carouselState.currentIndex = 0;
            container.style.transform = 'translateX(0)';
            container.offsetHeight; // Force reflow
            container.style.transition = 'transform 0.5s ease';
            log('Reset carousel to beginning');
        }, CAROUSEL_CONFIG.transitionDuration);
    }
}

// Clean up function to prevent memory leaks
window.addEventListener('unload', () => {
    if (carouselState.interval) {
        clearInterval(carouselState.interval);
    }
});