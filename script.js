document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));


    // Contact Form Handling with EmailJS
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("Form submitted");

            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            // Gather form data manually to ensure we have it
            const nameInput = form.querySelector('[name="user_name"]');
            const emailInput = form.querySelector('[name="user_email"]');
            const messageInput = form.querySelector('[name="message"]');

            // Get current time for the {{time}} variable
            const currentTime = new Date().toLocaleString();

            const templateParams = {
                to_name: 'Shamil', // Matches "Hello {{name}}" if configured as {{to_name}} or just generic name
                from_name: nameInput ? nameInput.value : '', // Matches {{from_name}}
                from_email: emailInput ? emailInput.value : '', // Matches {{from_email}}
                message: messageInput ? messageInput.value : '', // Matches {{message}}
                time: currentTime, // Matches {{time}}
                name: 'Shamil' // Redundant backup for {{name}} just in case
            };

            console.log("Sending with params:", templateParams);

            if (!templateParams.from_name || !templateParams.from_email || !templateParams.message) {
                alert('Please fill in all fields.');
                return;
            }

            // Change button state
            btn.innerText = 'Sending...';
            btn.disabled = true;

            const serviceID = 'service_p06psn9';
            const templateID = 'template_4lomnyi';

            try {
                if (typeof emailjs === 'undefined') {
                    throw new Error('EmailJS SDK not loaded');
                }

                emailjs.send(serviceID, templateID, templateParams)
                    .then(function (response) {
                        console.log('SUCCESS!', response.status, response.text);

                        btn.innerText = 'Message Sent!';
                        btn.style.backgroundColor = '#4ade80'; // Success green
                        btn.style.borderColor = '#4ade80';
                        btn.style.color = '#fff';

                        form.reset();

                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.style.backgroundColor = '';
                            btn.style.borderColor = '';
                            btn.style.color = '';
                            btn.disabled = false;
                        }, 3000);
                    }, function (error) {
                        console.error('FAILED...', error);

                        btn.innerText = 'Failed';
                        btn.style.backgroundColor = '#ef4444'; // Error red

                        alert('Message failed to send.\nError: ' + JSON.stringify(error));

                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.style.backgroundColor = '';
                            btn.style.borderColor = '';
                            btn.style.color = '';
                            btn.disabled = false;
                        }, 3000);
                    });
            } catch (err) {
                console.error('Synchronous Error:', err);
                alert('An unexpected error occurred: ' + err.message);

                btn.innerText = 'Error';
                btn.style.backgroundColor = '#ef4444';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }
});
