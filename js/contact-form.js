document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Form validation and submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Basic form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate fields
        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }

        if (!emailRegex.test(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Get reCAPTCHA response
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            showStatus('Please complete the reCAPTCHA verification.', 'error');
            return;
        }

        try {
            // Show loading status
            showStatus('Sending message...', 'loading');

            // Submit form using Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                showStatus('Message sent successfully!', 'success');
                contactForm.reset();
                grecaptcha.reset();
            } else {
                throw new Error(result.error || 'Something went wrong.');
            }
        } catch (error) {
            showStatus('Failed to send message. Please try again later.', 'error');
            console.error('Form submission error:', error);
        }
    });

    // Helper function to show status messages
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;

        // Clear success/error messages after 5 seconds
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        }
    }

    // Smooth scroll for contact buttons
    document.querySelectorAll('.contact-me-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});