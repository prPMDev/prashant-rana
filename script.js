document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const container = document.getElementById('testimonial-container');

    if (!container) {
        console.error('Testimonial container not found');
        return;
    }

    fetch('testimonials.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Testimonials data:', data);
            if (data && data.length > 0) {
                data.forEach(testimonial => {
                    const testimonialElement = createTestimonialElement(testimonial);
                    container.appendChild(testimonialElement);
                });
                console.log('Testimonials added to DOM');
            } else {
                console.log('No testimonials data found');
                container.innerHTML = '<p>No testimonials available at the moment.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading testimonials:', error);
            container.innerHTML = '<p>Error loading testimonials. Please try again later.</p>';
        });

    // Auto-scroll functionality
    setInterval(() => {
        moveCarousel(1);
    }, 3000); // Change the interval as needed
});

function createTestimonialElement(testimonial) {
    console.log('Creating testimonial element for:', testimonial.name);
    const element = document.createElement('div');
    element.className = 'testimonial';
    element.innerHTML = `
        <h3>${testimonial.name}</h3>
        <p class="title">${testimonial.title}</p>
        <blockquote>${testimonial.quote}</blockquote>
    `;
    return element;
}

let currentIndex = 0;

function moveCarousel(direction) {
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.testimonial');
    const totalItems = items.length;
    const itemsPerView = window.innerWidth < 768 ? 1 : 2;
    const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;

    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = maxIndex;
    } else if (currentIndex > maxIndex) {
        currentIndex = 0;
    }

    const offset = -currentIndex * 100 / itemsPerView;
    carouselInner.style.transform = `translateX(${offset}%)`;
}
