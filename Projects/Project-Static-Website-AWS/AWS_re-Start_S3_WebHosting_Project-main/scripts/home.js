document.addEventListener('DOMContentLoaded', () => {
    const orderBtn = document.getElementById('hero-order-btn');
    const authBtn = document.getElementById('auth-btn');

    // Filename of your sign in page
    const signInPage = 'signin.html'; 

    // 1. Helper to retrieve current login state from Local Storage
    function getLoginState() {
        try {
            const state = localStorage.getItem('isLoggedIn');
            console.log("home.js - Checking login state:", state);
            return state === 'true';
        } catch (error) {
            console.warn("home.js - localStorage access blocked (likely due to file:// protocol):", error);
            return false;
        }
    }

    // 2. Adjust navigation bar UI depending on login state
    function updateAuthUI() {
        const loggedIn = getLoginState();
        if (loggedIn) {
            authBtn.textContent = 'SIGN OUT';
            authBtn.href = '#home'; // Default fallback href
        } else {
            authBtn.textContent = 'SIGN IN';
            authBtn.href = signInPage; // Links directly to your actual Sign In page
        }
    }

    // 3. Handle Auth Button (Sign In / Sign Out) Click
    authBtn.addEventListener('click', (e) => {
        const loggedIn = getLoginState();
        if (loggedIn) {
            e.preventDefault();
            
            // Clear the login state from local storage
            try {
                localStorage.setItem('isLoggedIn', 'false');
            } catch (error) {
                console.error("home.js - Could not clear localStorage:", error);
            }
            
            // Redirect the user directly back to the sign-in page
            window.location.href = signInPage;
        }
        // If logged out, standard browser behavior takes them to signin.html via the href
    });

    // 4. Handle "Order Now" routing
    orderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const loggedIn = getLoginState();
        
        if (loggedIn) {
            // Redirects to Orders tab/hash on the home page
            window.location.hash = 'orders';
            updateActiveNavLink('orders');
        } else {
            // Redirects to your actual separate Sign In HTML file
            window.location.href = signInPage;
        }
    });

    // Helper to change the active class visual state in the navbar
    function updateActiveNavLink(targetHash) {
        document.querySelectorAll('.nav-menu ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetHash}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Render correct UI state on initial page load
    updateAuthUI();
});
