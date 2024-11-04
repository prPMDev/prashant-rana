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

    // Track which fields have been interacted with
    let touchedFields = {
        queryType: false,
        name: false,
        email: false,
        message: false,
        consent: false
    };

    function updateSubmitButton() {
        const isValid = Object.values(formState).every(value => value === true);
        submitButton.disabled = !isValid;
    }

    // Show error only if field has been touched
    function showError(elementId, show, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = show ? message : '';
            errorElement.style.display = show ? 'block' : 'none';
        }
    }

    // Mark field as touched
    function markFieldAsTouched(fieldName) {
        touchedFields[fieldName] = true;
    }

    // Query Type Selection and Message Template
    queryType.addEventListener('change', function() {
        markFieldAsTouched('queryType');
        const queryValue = this.value;
        const template = messageTemplates[queryValue];

        if (template) {
            messageDisplay.textContent = template.display;
            messageDisplay.style.display = 'block';
            userMessage.value = template.template;
        } else {
            messageDisplay.style.display = 'none';
            userMessage.value = '';
        }

        formState.queryType = !!queryValue;
        validateForm();
    });

    // Form validation
    function validateForm(isSubmit = false) {
        // Name validation
        const name = document.getElementById('name');
        const isNameTouched = touchedFields.name || isSubmit;
        formState.name = name.value.trim() !== '' && name.value.trim().toLowerCase() !== 'test';
        showError('name-error', !formState.name && isNameTouched, 'Please enter a valid name');

        // Email validation
        const email = document.getElementById('email');
        const isEmailTouched = touchedFields.email || isSubmit;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const domain = email.value.split('@')[1];
        const knownDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com'];
        formState.email = emailPattern.test(email.value) && (!domain || knownDomains.includes(domain));
        showError('email-error', !formState.email && isEmailTouched, 'Please enter a valid email address from a known domain');

        // Message validation
        const isMessageTouched = touchedFields.message || isSubmit;
        const invalidPattern = /<[^>]*>/g;
        formState.message = userMessage.value.trim() !== '' &&
                           !invalidPattern.test(userMessage.value) &&
                           userMessage.value !== messageTemplates[queryType.value]?.template;
        showError('user-message-error', !formState.message && isMessageTouched, 'Please replace placeholder text with specific information');

        // Consent validation
        const isConsentTouched = touchedFields.consent || isSubmit;
        formState.consent = dataConsent.checked;
        showError('consent-error', !formState.consent && isConsentTouched, 'Please provide consent to process your data');

        updateSubmitButton();
    }

    // Add blur event listeners for fields
    document.getElementById('name').addEventListener('blur', () => {
        markFieldAsTouched('name');
        validateForm();
    });

    document.getElementById('email').addEventListener('blur', () => {
        markFieldAsTouched('email');
        validateForm();
    });

    userMessage.addEventListener('blur', () => {
        markFieldAsTouched('message');
        validateForm();
    });

    // Add input event listeners for real-time validation after first interaction
    document.getElementById('name').addEventListener('input', () => {
        if (touchedFields.name) validateForm();
    });

    document.getElementById('email').addEventListener('input', () => {
        if (touchedFields.email) validateForm();
    });

    userMessage.addEventListener('input', () => {
        if (touchedFields.message) validateForm();
    });

    dataConsent.addEventListener('change', () => {
        markFieldAsTouched('consent');
        validateForm();
    });

    // Handle reCAPTCHA completion
    window.onRecaptchaComplete = function() {
        formState.recaptcha = true;
        validateForm();
    };

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Mark all fields as touched on submit attempt
        Object.keys(touchedFields).forEach(field => touchedFields[field] = true);
        validateForm(true);

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
                    document.getElementById('form-error-message').style.color = "#4CAF50";
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                document.getElementById('form-error-message').textContent = 'There was a problem submitting your form. Please try again later.';
                document.getElementById('form-error-message').style.display = 'block';
            });
        }
    });

    // Add required class to labels
    document.querySelectorAll('label[for]').forEach(label => {
        const input = document.getElementById(label.getAttribute('for'));
        if (input && input.hasAttribute('required')) {
            label.classList.add('required');
        }
    });
});