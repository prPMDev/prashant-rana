document.addEventListener('DOMContentLoaded', function() {
    const imageSlider = document.querySelector('.image-slider');
    const testimonialGrid = document.querySelector('.testimonial-grid');

    // Image slider setup
    const images = [
        'images/pr-at-seattle.jpg',
        'images/pr-painting.jpg',
    ];

    let currentImageIndex = 0;

    function changeImage() {
        const img = document.createElement('img');
        img.src = images[currentImageIndex];
        img.onload = function() {
            console.log('Image loaded successfully:', img.src);
        };
        img.onerror = function() {
            console.error('Error loading image:', img.src);
        };
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
        {
            text: "Prashant was a summer graduate intern on my team. I really appreciated his strategic mindset as well as his ability to get into the weeds to get work done. He quickly got up to speed on what we asked of him carrying a long-term vision forward during his short time on the team. I would highly recommend Prashant.",
            author: "Dana Toy, Principal Program Manager at SAP Concur"
        },
        {
            text: "Prashant is an all rounder. May it be coding, understanding the critical aspects of business or testing and deployment, Prashant is the guy you would be looking out for. His ability to take keen interest in the domain that he is working in and his ever curious mind makes him an excellent addition to a team. Prashant has a deep rooted sense of responsibility that ensures his reliability in the team. I had a pleasure of working with Prashant for last one year and would not hesitate to work with him any time in future.",
            author: "Hrishikesh Deshmukh, Director User Experience Design at Salesforce"
        },
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

    console.log('Script executed. Check if images and testimonials are added to the DOM.');
});