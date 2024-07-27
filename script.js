document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const btn = document.getElementById('contactBtn');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('contactForm');

    btn.onclick = function() {
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const reason = document.getElementById('reason').value;
        const message = document.getElementById('message').value;

        let subject = 'Contact from Website';
        let body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;

        if (reason === 'job') {
            subject = 'Job Opening Inquiry';
            body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AI am reaching out regarding a job opening. Here are the details:%0D%0A%0D%0A${message}`;
        } else if (reason === 'collaboration') {
            subject = 'Project Collaboration Opportunity';
            body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AI am interested in collaborating on a project. Here are the details:%0D%0A%0D%0A${message}`;
        } else if (reason === 'mentoring') {
            subject = 'Mentoring Request';
            body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AI am seeking mentorship. Here are the details:%0D%0A%0D%0A${message}`;
        }

        window.location.href = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        modal.style.display = 'none';
    });

    fetchTestimonials();
    // Auto-scroll functionality
    setInterval(() => {
        moveCarousel(1);
    }, 3000); // Change the interval as needed
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
