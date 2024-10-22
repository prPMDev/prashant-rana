// contact.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const messageDisplay = document.getElementById('message-display');
    const queryType = document.getElementById('query-type');
    const userMessage = document.getElementById('user-message');
    const dataConsent = document.getElementById('data-consent');
    
    // Track form validity state
    let formState = {
        queryType: false,
        name: false,
        email: false,
        message: false,
        consent: false,
        recaptcha: false
    };

    function updateSubmitButton() {
        const isValid = Object.values(formState).every(value => value === true);
        submitButton.disabled = !isValid;
    }

    // Query Type Selection and Message Template
    queryType.addEventListener('change', function() {
        const queryValue = this.value;
        let message = '';
        let template = '';

        switch (queryValue) {
            case 'job':
                message = 'Glad that you think I am suitable for a role. Please provide more details below and I will get back to you as soon as possible.';
                template = 'Hi Prashant,\n\nI came across your profile via <linkedin/referral/job portal submission> and I think you may be a good fit for the <Role>.\n\nPlease find the job details and requirements <link here>.\n\nIf interested, please get back to me on email <email ID> or phone <phone number>.\n\nLooking forward to hearing from you.\n\nRegards,\n<Name>';
                break;
            case 'mentorship':
                message = 'Happy to help. Feel free to send me a note or schedule time using this link (https://adplist.org/mentors/prashant-rana).';
                template = 'Hi Prashant,\n\nI am <name> and I am a <student/aspiring product manager/entrepreneur> seeking mentorship and would like to get some guidance. My <LinkedIn/Portfolio> is <link here> and I would like to connect.\n\nLooking forward to hearing from you.\n\nRegards,\n<Name>';
                break;
            case 'collaboration':
                message = 'I would love to collaborate if I can. Feel free to provide details and I will get back to you.';
                template = 'Hi Prashant,\n\nI would like to discuss a potential collaboration on <project name>. Here are some details about the project:\n\n<Project Details>\n\nLooking forward to your response.\n\nBest regards,\n<Name>';
                break;
            case 'other':
                message = 'Happy to get in touch. You can send a note, but if you prefer, you can choose to connect over LinkedIn (link:https://www.linkedin.com/in/prashant-rana/). Please do send a note in your invite to connect.';
                template = 'Hi Prashant,\n\n<Your message here>\n\nRegards,\n<Name>';
                break;
        }

        messageDisplay.textContent = message;
        messageDisplay.style.display = message ? 'block' : 'none';
        userMessage.value = template;
        
        formState.queryType = !!queryValue;
        validateForm();
    });

    // Form validation
    function validateForm() {
        // Name validation
        const name = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        formState.name = name.value.trim() !== '' && name.value.trim().toLowerCase() !== 'test';
        nameError.textContent = !formState.name ? 'Please enter a valid name' : '';
        nameError.style.display = !formState.name ? 'block' : 'none';

        // Email validation
        const email = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const domain = email.value.split('@')[1];
        const knownDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
        formState.email = emailPattern.test(email.value) && (!domain || knownDomains.includes(domain));
        emailError.textContent = !formState.email ? 'Please enter a valid email address from a known domain' : '';
        emailError.style.display = !formState.email ? 'block' : 'none';

        // Message validation
        const messageError = document.getElementById('user-message-error');
        const invalidPattern = /<[^>]*>/g;
        formState.message = userMessage.value.trim() !== '' && !invalidPattern.test(userMessage.value);
        messageError.textContent = !formState.message ? 'Please replace placeholder text with specific information' : '';
        messageError.style.display = !formState.message ? 'block' : 'none';

        // Consent validation
        const consentError = document.getElementById('consent-error');
        formState.consent = dataConsent.checked;
        consentError.textContent = !formState.consent ? 'Please provide consent to process your data' : '';
        consentError.style.display = !formState.consent ? 'block' : 'none';

        updateSubmitButton();
    }

    // Add event listeners for form fields
    document.getElementById('name').addEventListener('input', validateForm);
    document.getElementById('email').addEventListener('input', validateForm);
    userMessage.addEventListener('input', validateForm);
    dataConsent.addEventListener('change', validateForm);

    // Handle reCAPTCHA completion
    window.onRecaptchaComplete = function() {
        formState.recaptcha = true;
        validateForm();
    };

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (Object.values(formState).every(value => value === true)) {
            const formData = new FormData(form);
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById('form-error-message').textContent = "Thank you! Your message has been sent.";
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                document.getElementById('form-error-message').textContent = 'There was a problem submitting your form. Please try again later.';
            });
        }
    });

    // Initialize form validation
    validateForm();
});

// Add reCAPTCHA callback
window.recaptchaCallback = function() {
    if (typeof window.onRecaptchaComplete === 'function') {
        window.onRecaptchaComplete();
    }
};