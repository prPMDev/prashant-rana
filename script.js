document.addEventListener('DOMContentLoaded', () => {
    fetchTestimonials();

    // Auto-scroll functionality
    setInterval(() => {
        moveCarousel(1);
    }, 5000);

    // Fetch profile images dynamically from JSON file
    fetch('profile-pictures.json')
        .then(response => response.json())
        .then(images => {
            if (images.length > 0) {
                let currentImageIndex = 0;
                const profileImage = document.getElementById('profileImage');
                profileImage.src = images[currentImageIndex];
                setInterval(() => {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    profileImage.src = images[currentImageIndex];
                }, 5000);
            }
        })
        .catch(error => console.error('Error loading profile images:', error));
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

            // Duplicate first few items to create infinite scroll illusion
            const itemsPerView = window.innerWidth <= 768 ? 1 : 2; // Show 1 item per view on small screens
            for (let i = 0; i < itemsPerView; i++) {
                const clone = container.children[i].cloneNode(true);
                container.appendChild(clone);
            }

            const totalItems = data.length;
            const maxIndex = totalItems;

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
    const totalItems = carouselInner.children.length;
    const maxIndex = parseInt(carouselInner.dataset.maxIndex);

    currentIndex += direction;
    const offset = -currentIndex * 100 / itemsPerView;

    if (currentIndex >= totalItems - itemsPerView) {
        carouselInner.style.transition = 'none';
        currentIndex = maxIndex;
        carouselInner.style.transform = `translateX(${-currentIndex * 100 / itemsPerView}%)`;
        setTimeout(() => {
            carouselInner.style.transition = 'transform 0.5s ease';
            moveCarousel(1);
        }, 50);
    } else if (currentIndex < 0) {
        carouselInner.style.transition = 'none';
        currentIndex = 0;
        carouselInner.style.transform = `translateX(${-currentIndex * 100 / itemsPerView}%)`;
        setTimeout(() => {
            carouselInner.style.transition = 'transform 0.5s ease';
            moveCarousel(-1);
        }, 50);
    } else {
        carouselInner.style.transform = `translateX(${offset}%)`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});