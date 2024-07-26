// Function to include HTML content
function includeHTML(file, elementId) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data;
      setActiveNavLink();
    });
}

// Function to set active navigation link
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

// Image slider setup
function setupImageSlider() {
  const imageSlider = document.querySelector('.image-slider');
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
}

// Testimonials setup
function setupTestimonials() {
  const testimonialSection = document.querySelector('.testimonials');

  fetch('testimonials.json')
    .then(response => response.json())
    .then(data => {
      const testimonials = data.testimonials;
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
    })
    .catch(error => console.error('Error loading testimonials:', error));
}

// Dark mode functions
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function applyDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
}

// Main initialization function
function initializeWebsite() {
  includeHTML('header.html', 'header-placeholder');
  includeHTML('footer.html', 'footer-placeholder');
  setupImageSlider();
  setupTestimonials();
  applyDarkMode();
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', initializeWebsite);