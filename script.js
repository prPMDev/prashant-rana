function includeHTML(file, elementId) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data;
      setActiveNavLink();
    });
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  includeHTML('header.html', 'header-placeholder');
  includeHTML('footer.html', 'footer-placeholder');
  // ... (rest of your existing code)
});

document.addEventListener('DOMContentLoaded', function() {
    const imageSlider = document.querySelector('.image-slider');
    const testimonialSection = document.querySelector('.testimonials');

    // Image slider setup
    const images = [
        'images/pr-at-seattle.jpg',
        'images/pr-painting.jpg',
    ];

    let currentImageIndex = 0;

    function changeImage() {
    const newImg = document.createElement('img');
    newImg.src = images[currentImageIndex];
    newImg.loading = 'lazy';
    newImg.style.opacity = '0';

    newImg.onload = function() {
        imageSlider.appendChild(newImg);
        setTimeout(() => {
            newImg.style.opacity = '1';
            if (imageSlider.children.length > 1) {
                imageSlider.removeChild(imageSlider.children[0]);
            }
        }, 50);
    };

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
        // Add more testimonials here
    ];

    const testimonialCarousel = document.createElement('div');
    testimonialCarousel.className = 'testimonial-carousel';
    const testimonialContainer = document.createElement('div');
    testimonialContainer.className = 'testimonial-container';

    testimonials.forEach(testimonial => {
        const testimonialElement = document.createElement('div');
        testimonialElement.className = 'testimonial';
        testimonialElement.innerHTML = `
            <p class="testimonial-text">${testimonial.text}</p>
            <p class="testimonial-author">- ${testimonial.author}</p>
        `;
        testimonialContainer.appendChild(testimonialElement);
    });

    testimonialCarousel.appendChild(testimonialContainer);
    testimonialSection.appendChild(testimonialCarousel);

    let currentTestimonialIndex = 0;

    function moveTestimonials(direction) {
        currentTestimonialIndex = (currentTestimonialIndex + direction + testimonials.length) % testimonials.length;
        testimonialContainer.style.transform = `translateX(-${currentTestimonialIndex * 100}%)`;
    }

    function autoMoveTestimonials() {
        moveTestimonials(1);
    }

    // Set up auto-rotating carousel
    setInterval(autoMoveTestimonials, 10000); // Change testimonial every 10 seconds

    // Set up manual controls
    const leftControl = document.createElement('div');
    leftControl.className = 'carousel-control left';
    leftControl.innerHTML = '❮';
    leftControl.addEventListener('click', () => moveTestimonials(-1));

    const rightControl = document.createElement('div');
    rightControl.className = 'carousel-control right';
    rightControl.innerHTML = '❯';
    rightControl.addEventListener('click', () => moveTestimonials(1));

    testimonialCarousel.appendChild(leftControl);
    testimonialCarousel.appendChild(rightControl);
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function applyDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // ... (existing code)
    applyDarkMode();
});