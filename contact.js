document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formErrorMessage = document.getElementById('form-error-message');
    const confirmationPopup = document.createElement('div');
    confirmationPopup.className = 'confirmation-popup';
    document.body.appendChild(confirmationPopup);

    const messageDisplay = document.getElementById('message-display');
    const queryType = document.getElementById('query-type');
    const userMessage = document.getElementById('user-message');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    // Error messages
    const emailError = document.getElementById('email-error');
    const nameError = document.getElementById('name-error');
    const userMessageError = document.getElementById('user-message-error');

    // Query Type Selection
    queryType.addEventListener('change', updateMessageDisplay);

    // Update message display based on query type
    function updateMessageDisplay() {
        const queryValue = queryType.value;
        let message = '';

        switch (queryValue) {
            case 'job':
                message = 'Glad that you think I am suitable for a role. Please provide more details below and I will get back to you as soon as possible.';
                userMessage.value = 'Hi Prashant,\n\nI came across your profile via <linkedin/referral/job portal submission> and I think you may be a good fit for the <Role>.\n\nPlease find the job details and requirements <link here>.\n\nIf interested, please get back to me on email <email ID> or phone <phone number>.\n\nLooking forward to hearing from you.\n\nRegards,\n<Name>';
                break;
            case 'mentorship':
                message = 'Happy to help. Feel free to send me a note or schedule time using this link (https://adplist.org/mentors/prashant-rana).';
                userMessage.value = 'Hi Prashant,\n\nI am <name> and I am a <student/aspiring product manager/entrepreneur> seeking mentorship and would like to get some guidance. My <LinkedIn/Portfolio> is <link here> and I would like to connect.\n\nLooking forward to hearing from you.\n\nRegards,\n<Name>';
                break;
            case 'collaboration':
                message = 'I would love to collaborate if I can. Feel free to provide details and I will get back to you.';
                userMessage.value = 'Hi Prashant,\n\nI would like to discuss a potential collaboration on <project name>. Here are some details about the project:\n\n<Project Details>\n\nLooking forward to your response.\n\nBest regards,\n<Name>';
                break;
            case 'other':
                message = 'Happy to get in touch. You can send a note, but if you prefer, you can choose to connect over LinkedIn (link:https://www.linkedin.com/in/prashant-rana/). Please do send a note in your invite to connect.';
                userMessage.value = 'Hi Prashant,\n\n<Your message here>\n\nRegards,\n<Name>';
                break;
            default:
                message = '';
        }

        messageDisplay.textContent = message;
        messageDisplay.style.display = message ? 'block' : 'none';
    }

    // Form validation
    function validateForm() {
        let isValid = true;

        // Validate email
        const emailValue = email.value.trim();
        const domain = emailValue.split('@')[1];
        const knownDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(emailValue) || (domain && !knownDomains.includes(domain))) {
            emailError.textContent = 'Please enter a valid email address from a known domain.';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        // Validate name
        if (name.value.trim().length === 0 || name.value.trim().toLowerCase() === 'test') {
            nameError.textContent = 'Please enter a valid name.';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

        // Validate user message
        const invalidPattern = /<[^>]*>/g;
        if (invalidPattern.test(userMessage.value)) {
            userMessageError.textContent = 'Please replace placeholder text (e.g., <LinkedIn>) with specific information.';
            isValid = false;
        } else {
            userMessageError.textContent = '';
        }

        return isValid;
    }

    // Form submission event
    contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    formErrorMessage.textContent = ''; // Clear any previous form error messages

    if (validateForm()) {
        // Prepare form data
        const formData = new FormData(contactForm);
        const recaptchaToken = grecaptcha.getResponse();

        if (!recaptchaToken) {
            formErrorMessage.textContent = 'Please complete the reCAPTCHA.';
            console.error('reCAPTCHA token missing');
            return;
        }

        formData.append('g-recaptcha-response', recaptchaToken);

        // Send form data via AJAX
        fetch('https://formspree.io/f/xrbzqdpw?debug=true', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showConfirmationPopup(contactForm.querySelector('#query-type').value);
                contactForm.reset(); // Reset the form after submission
                messageDisplay.innerHTML = ""; // Clear the non-editable message
                contactForm.style.display = 'none'; // Hide the form after submission
            } else {
                return response.json().then(data => {
                    if (data.errors) {
                        formErrorMessage.textContent = data.errors.map(error => error.message).join(", ");
                        console.error('Formspree errors:', data.errors);
                    } else {
                        formErrorMessage.textContent = "Oops! There was a problem submitting your form.";
                        console.error('Unexpected error:', data);
                    }
                });
            }
        })
        .catch(error => {
            formErrorMessage.textContent = 'There was a problem submitting your form. Please try again later.';
            console.error('Error:', error);
        });
    } else {
        formErrorMessage.textContent = 'Please correct the errors above before submitting.';
    }
});


    // Show confirmation popup
    function showConfirmationPopup(type) {
        let message = '';
        switch(type) {
            case 'job':
                message = 'Thanks for getting in touch. I will get back to you ASAP.';
                break;
            case 'mentorship':
                message = 'Thanks for getting in touch. Looking forward to connecting soon.';
                break;
            case 'collaboration':
                message = 'Thanks for getting in touch. I will revert soon.';
                break;
            case 'other':
                message = 'Thanks for getting in touch.';
                break;
            default:
                message = 'Thanks for your message.';
        }
        confirmationPopup.textContent = message;
        confirmationPopup.classList.add('visible');

        setTimeout(() => {
            confirmationPopup.classList.remove('visible');
            contactForm.style.display = 'block'; // Reset form display
        }, 5000);
    }

    // Initial setup
    updateMessageDisplay();
});
