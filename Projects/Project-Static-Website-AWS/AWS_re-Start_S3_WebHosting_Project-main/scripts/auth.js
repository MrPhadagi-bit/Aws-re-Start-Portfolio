/**
 * L'Aura Bistro - Client Authorization Node (Vanilla JS)
 * This file handles user registration, password verification, session variables,
 * and page-access guards for protected profile/cart/history interfaces.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Make sure we have a "registered_users" record in storage
    if (!localStorage.getItem('registered_users')) {
        // Pre-initialize with a elegant demo user for testing
        localStorage.setItem('registered_users', JSON.stringify([
            { name: "Sipho Khumalo", email: "sipho@domain.co.za", password: "password123" }
        ]));
    }

    // Handle Login submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email').value.trim().toLowerCase();
            const passwordInput = document.getElementById('password').value;

            if (!emailInput || !passwordInput) {
                alert('Please enter your email and password.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
            const matchedUser = users.find(u => u.email === emailInput && u.password === passwordInput);

            if (matchedUser) {
                // Update session state
                localStorage.setItem('user', JSON.stringify({
                    loggedIn: true,
                    name: matchedUser.name,
                    email: matchedUser.email
                }));
                
                alert(`Welcome back to Zani's Eatery, ${matchedUser.name}!`, () => {
                    // Redirect back to menu, or home, or check if there was a redirect
                    const referrer = sessionStorage.getItem('redirect_after_login');
                    if (referrer) {
                        sessionStorage.removeItem('redirect_after_login');
                        window.location.href = referrer;
                    } else {
                        window.location.href = 'menu.html';
                    }
                });
            } else {
                alert('Incorrect email address or password. Please try again.');
            }
        });
    }

    // Handle Register submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name').value.trim();
            const emailInput = document.getElementById('email').value.trim().toLowerCase();
            const passwordInput = document.getElementById('password').value;
            const confirmPasswordInput = document.getElementById('confirm-password')?.value;

            if (!nameInput || !emailInput || !passwordInput) {
                alert('Please fill in all required fields.');
                return;
            }

            if (confirmPasswordInput && passwordInput !== confirmPasswordInput) {
                alert('Passwords do not match. Please verify.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
            const exists = users.some(u => u.email === emailInput);

            if (exists) {
                alert('An account with this email already exists inside our dining registry.');
                return;
            }

            // Register new patron
            users.push({
                name: nameInput,
                email: emailInput,
                password: passwordInput
            });
            localStorage.setItem('registered_users', JSON.stringify(users));

            alert('Your gourmet society account has been created successfully. Redirecting to login...', () => {
                window.location.href = 'login.html';
            });
        });
    }
});

/**
 * Checks authentication status. If user is a guest, triggers an alert and redirects to login,
 * ensuring clean callback loopback redirection.
 * @param {string} currentPageUrl - The page that initiated the redirect guard.
 */
function guardProtectedRoute(currentPageUrl) {
    const userStr = localStorage.getItem('user');
    let loggedIn = false;
    if (userStr) {
        try {
            loggedIn = JSON.parse(userStr).loggedIn;
        } catch (e) {
            loggedIn = false;
        }
    }

    if (!loggedIn) {
        sessionStorage.setItem('redirect_after_login', currentPageUrl);
        const isSubpage = window.location.pathname.includes('/pages/');
        alert('Authentication Required. Please sign in or register to access this section.', () => {
            window.location.href = isSubpage ? 'login.html' : 'pages/login.html';
        });
        return false;
    }
    return true;
}

window.guardProtectedRoute = guardProtectedRoute;
