document.addEventListener('DOMContentLoaded', () => {
    fetchTestimonials();

    // Auto-scroll functionality
    setInterval(() => {
        moveCarousel(1);
    }, 5000);

    // Image rotation functionality
    const images = ['images/pr-painting.jpg', 'images/pr-at-seattle.jpg'];
    let currentImageIndex = 0;
    const profileImage = document.getElementById('profileImage');

    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        profileImage.src = images[currentImageIndex];
    }, 5000);
});

function fetchTestimonials() {
    fetch('testimonials.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('testimonial-container');
            data.forEach(testimonial => {
                const testimonialElement = createTestimonialElement(testimonial);
                container.appendChild(testimonialElement);
            });

            // Adjust the carousel settings after testimonials are loaded
            const itemsPerView = 2; // Show 2 items per view
            const totalItems = data.length;
            const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;

            const carouselInner = document.querySelector('.carousel-inner');
            carouselInner.dataset.maxIndex = maxIndex;
            carouselInner.dataset.itemsPerView = itemsPerView;

            // Ensure carousel is correctly initialized
            moveCarousel(0);
        })
        .catch(error => console.error('Error loading testimonials:', error));
}

function createTestimonialElement(testimonial) {
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
    const itemsPerView = parseInt(carouselInner.dataset.itemsPerView);
    const maxIndex = parseInt(carouselInner.dataset.maxIndex);

    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = maxIndex;
    } else if (currentIndex > maxIndex) {
        currentIndex = 0;
    }

    const offset = -currentIndex * 100 / itemsPerView;
    carouselInner.style.transform = `translateX(${offset}%)`;
}
