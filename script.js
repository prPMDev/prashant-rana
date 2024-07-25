document.addEventListener('DOMContentLoaded', function() {
    const imageSlider = document.querySelector('.image-slider');
    const testimonialGrid = document.querySelector('.testimonial-grid');

    // Image slider setup
    const images = [
        'path/to/image1.jpg',
        'path/to/image2.jpg',
        'path/to/image3.jpg',
        // Add more image paths as needed
    ];

    let currentImageIndex = 0;

    function changeImage() {
        const img = document.createElement('img');
        img.src = images[currentImageIndex];
        imageSlider.innerHTML = '';
        imageSlider.appendChild(img);
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    changeImage(); // Initial image
    setInterval(changeImage, 10000); // Change image every 10 seconds

    // Testimonials setup
    const testimonials = [
        {
            text: "Prashant is an exceptionally talented Product Manager and I am super glad we hired him at the right time to help us out on the CX Platform team. He comes with an MBA Background which is super valuable and he uses a lot of strategic and analytical thinking into the product management lifecycle and process. He is definitely one of the very smart PMs I have worked with in my Career. He is well respected, extremely dedicated and a motivated and self driven individual. He has done an awesome job managing his products, backlogs and owning feature deliverables on our Oracle CX Releases. He always believes in overseeing and leading from the front, delivering on several critical Projects which added Business Value and Increased Revenue for our company. Prashant will be a great asset to any company that hires him. He has my highest recommendation.",
            author: "Ram Prabhakaran, Technology Leader and Product Champion"
        },
        // Add more testimonials here
    ];

    testimonials.forEach(testimonial => {
        const testimonialElement = document.createElement('div');
        testimonialElement.className = 'testimonial';
        testimonialElement.innerHTML = `
            <p class="testimonial-text">${testimonial.text}</p>
            <p class="testimonial-author">- ${testimonial.author}</p>
        `;
        testimonialGrid.appendChild(testimonialElement);
    });
});