document.addEventListener('DOMContentLoaded', () => {
    fetch('testimonials.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('testimonial-container');
            data.forEach(testimonial => {
                const testimonialElement = createTestimonialElement(testimonial);
                container.appendChild(testimonialElement);
            });
        });
});

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