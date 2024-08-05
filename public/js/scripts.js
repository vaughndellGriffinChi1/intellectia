document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = new URLSearchParams(formData);
            fetch('/login', {
                method: 'POST',
                body: data
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                console.log('Login response:', result);  // Add this line for debugging
                messageDiv.textContent = result.message;
                if (result.status === 'success') {
                    messageDiv.style.color = 'green';
                    if (result.redirect) {
                        console.log('Redirecting to:', result.redirect);  // Add this line for debugging
                        window.location.href = result.redirect;
                    }
                } else {
                    messageDiv.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.style.color = 'red';
            });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(signupForm);
            const data = new URLSearchParams(formData);
            fetch('/register', {
                method: 'POST',
                body: data
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                messageDiv.textContent = result.message;
                if (result.status === 'success') {
                    messageDiv.style.color = 'green';
                    signupForm.reset();
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    messageDiv.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.style.color = 'red';
            });
        });
    }
});