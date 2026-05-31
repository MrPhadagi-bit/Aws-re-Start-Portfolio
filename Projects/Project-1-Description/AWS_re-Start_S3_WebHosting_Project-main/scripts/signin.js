document.addEventListener('DOMContentLoaded', () => {
  // Navigation Links
  const linkToForgot = document.getElementById('link-to-forgot');
  const linkToSignup = document.getElementById('link-to-signup');
  const forgotToSignin = document.getElementById('forgot-to-signin');
  const signupToSignin = document.getElementById('signup-to-signin');

  // Form Submissions & Social Buttons
  const signinForm = document.getElementById('signin-form');
  const forgotForm = document.getElementById('forgot-form');
  const signupForm = document.getElementById('signup-form');
  const googleBtn = document.querySelector('.google-btn');

  // View Navigation Event Listeners
  if (linkToForgot) {
    linkToForgot.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('forgot-view');
    });
  }

  if (linkToSignup) {
    linkToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('signup-view');
    });
  }

  if (forgotToSignin) {
    forgotToSignin.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('signin-view');
    });
  }

  if (signupToSignin) {
    signupToSignin.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('signin-view');
    });
  }

  // Form Submit Event Listeners
  if (signinForm) {
    signinForm.addEventListener('submit', handleSignIn);
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', handleForgotPassword);
  }

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignUp);
  }

  // Google Mock Sign-In Event Listener
  if (googleBtn) {
    googleBtn.addEventListener('click', handleGoogleSignIn);
  }
});

// Handles toggling active classes for views
function switchView(viewId) {
  // Clear alerts when switching views
  document.querySelectorAll('.alert-box').forEach(alert => {
    alert.style.display = 'none';
    alert.textContent = '';
  });

  // Change classes to update screen state
  document.querySelectorAll('.form-view').forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }
}

// Sign-In Form handler (simulates login processing)
function handleSignIn(e) {
  e.preventDefault();
  const btn = document.getElementById('signin-btn');
  const alert = document.getElementById('signin-alert');
  
  btn.textContent = 'SIGNING IN...';
  btn.disabled = true;

  // Simulate network request
  setTimeout(() => {
    btn.textContent = 'SIGN IN';
    btn.disabled = false;
    
    alert.className = "alert-box success";
    alert.textContent = "Sign-in successful. Redirecting you to the home page...";
    alert.style.display = "block";

    // Store the sign-in state in local browser storage
    try {
        localStorage.setItem('isLoggedIn', 'true');
        console.log("signin.js - successfully set isLoggedIn to true in localStorage.");
    } catch (error) {
        console.error("signin.js - Failed to set localStorage (likely due to file:// protocol):", error);
    }

    // Wait 2 seconds before redirecting to home.html
    setTimeout(() => {
      window.location.href = "home.html"; 
    }, 2000);

  }, 1500);
}

// Mock Google Sign-In Handler
function handleGoogleSignIn(e) {
  e.preventDefault();
  const googleBtn = document.querySelector('.google-btn');
  const alert = document.getElementById('signin-alert');

  const originalContent = googleBtn.innerHTML;
  googleBtn.textContent = 'Connecting to Google...';
  googleBtn.disabled = true;

  setTimeout(() => {
    googleBtn.innerHTML = originalContent;
    googleBtn.disabled = false;

    alert.className = "alert-box success";
    alert.textContent = "Successfully authenticated via Google. Redirecting you to the home page...";
    alert.style.display = "block";

    // Store the sign-in state in local browser storage
    try {
        localStorage.setItem('isLoggedIn', 'true');
        console.log("signin.js (Google) - successfully set isLoggedIn to true in localStorage.");
    } catch (error) {
        console.error("signin.js (Google) - Failed to set localStorage (likely due to file:// protocol):", error);
    }

    // Wait 2 seconds before redirecting to home.html
    setTimeout(() => {
      window.location.href = "home.html"; 
    }, 2000);

  }, 1500);
}

// Forgot Password Form handler
function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;
  const btn = document.getElementById('forgot-btn');
  const alert = document.getElementById('forgot-alert');

  btn.textContent = 'SENDING LINK...';
  btn.disabled = true;

  // Simulate sending a reset token
  setTimeout(() => {
    btn.textContent = 'SEND RESET LINK';
    btn.disabled = false;

    alert.className = "alert-box success";
    alert.innerHTML = `A reset password link has been sent to <strong>${email}</strong>. Please check your inbox.`;
    alert.style.display = "block";
  }, 1500);
}

// Create Account Form handler
function handleSignUp(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;
  
  const btn = document.getElementById('signup-btn');
  const alert = document.getElementById('signup-alert');

  // Client-side password verification
  if (password !== confirmPassword) {
    alert.className = "alert-box";
    alert.textContent = "Error: Passwords do not match. Please try again.";
    alert.style.display = "block";
    return;
  }

  btn.textContent = 'CREATING ACCOUNT...';
  btn.disabled = true;

  // Simulate API call to create user credentials
  setTimeout(() => {
    btn.textContent = 'CREATE ACCOUNT';
    btn.disabled = false;

    alert.className = "alert-box success";
    alert.innerHTML = `Thank you, <strong>${name}</strong>! Your account has been created successfully. Redirecting you to the Sign-In page...`;
    alert.style.display = "block";

    // Auto-switch back to Sign-In page after successful signup
    setTimeout(() => {
      switchView('signin-view');
    }, 3000);

  }, 1500);
}
