document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const btn = document.getElementById('contactBtn');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('contactForm');
    const reasonSelect = document.getElementById('reason');
    const otherReason = document.getElementById('otherReason');
    const otherReasonLabel = document.getElementById('otherReasonLabel');
    const messageField = document.getElementById('message');
    const emailField = document.getElementById('email');

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

    reasonSelect.addEventListener('change', function() {
        switch (reasonSelect.value) {
            case 'job':
                messageField.placeholder = 'Tell me more about the job opening you have in mind.';
                otherReason.style.display = 'none';
                otherReasonLabel.style.display = 'none';
                otherReason.required = false;
                break;
            case 'collaboration':
                messageField.placeholder = 'Share your project idea and how you think we can collaborate.';
                otherReason.style.display = 'none';
                otherReasonLabel.style.display = 'none';
                otherReason.required = false;
                break;
            case 'mentoring':
                messageField.placeholder = 'Tell me what you are looking for in a mentorship.';
                otherReason.style.display = 'none';
                otherReasonLabel.style.display = 'none';
                otherReason.required = false;
                break;
            case 'other':
                messageField.placeholder = '';
                otherReason.style.display = 'block';
                otherReasonLabel.style.display = 'block';
                otherReason.required = true;
                break;
            default:
                messageField.placeholder = '';
                otherReason.style.display = 'none';
                otherReasonLabel.style.display = 'none';
                otherReason.required = false;
                break;
        }
    });

    emailField.addEventListener('input', function() {
        const email = emailField.value;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            emailField.setCustomValidity('Please enter a valid email address.');
        } else {
            emailField.setCustomValidity('');
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const reason = document.getElementById('reason').value;
        const otherReasonText = document.getElementById('otherReason').value;
        const message = document.getElementById('message').value;

        let subject = 'Contact from Website';
        let body = `Name: ${firstName} ${lastName}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;

        if (reason === 'job') {
            subject = 'Job Opening Inquiry';
            body = `Name: ${firstName} ${lastName}%0D%0AEmail: ${email}%0D%0A%0D%0AI am reaching out regarding a job opening. Here are the details:%0D%0A%0D%0A${message}`;
        } else if (reason === 'collaboration') {
            subject = 'Project Collaboration Opportunity';
            body = `Name: ${firstName} ${lastName}%0D%0AEmail: ${email}%0D%0A%0D%0AI am interested in collaborating on a project. Here are the details:%0D%0A%0D%0A${message}`;
        } else if (reason === 'mentoring') {
            subject = 'Mentoring Request';
            body = `Name: ${firstName} ${lastName}%0D%0AEmail: ${email}%0D%0A%0D%0AI am seeking mentorship. Here are the details:%0D%0A%0D%0A${message}`;
        } else if (reason === 'other') {
            subject = 'Other Inquiry';
            body = `Name: ${firstName} ${lastName}%0D%0AEmail: ${email}%0D%0A%0D%0AReason: ${otherReasonText}%0D%0A%0D%0A${message}`;
        }

        window.location.href = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        modal.style.display =
