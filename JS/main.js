// ===== SET ACTIVE NAV LINK BASED ON CURRENT PAGE =====
(function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
})();

// ===== NAVBAR SLIDING HIGHLIGHT =====
const navMenu = document.querySelector('.nav-menu');
const navItems = document.querySelectorAll('.nav-item');
const navHighlight = document.querySelector('.nav-highlight');

// Update highlight position and size
function updateHighlight(item) {
    const rect = item.getBoundingClientRect();
    const menuRect = navMenu.getBoundingClientRect();
    
    navHighlight.style.left = `${rect.left - menuRect.left}px`;
    navHighlight.style.width = `${rect.width}px`;
}

// Add event listeners to nav items
if (navMenu && navItems.length > 0 && navHighlight) {
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            updateHighlight(item);
        });
    });

    // Reset highlight when leaving nav menu
    navMenu.addEventListener('mouseleave', () => {
        navHighlight.style.opacity = '0';
    });

    navMenu.addEventListener('mouseenter', () => {
        navHighlight.style.opacity = '1';
    });
}

// ===== MOBILE MENU TOGGLE =====
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}


// ===== USER AUTHENTICATION & NAVBAR UPDATE =====
function updateNavbar() {
    // Get user from sessionStorage (via AuthHelper if available, otherwise directly)
    let currentUser = null;
    if (window.AuthHelper) {
        currentUser = window.AuthHelper.getCurrentUser();
    } else {
        // Fallback: read from sessionStorage directly
        const userStr = sessionStorage.getItem('currentUser');
        if (userStr) {
            try {
                currentUser = JSON.parse(userStr);
            } catch (e) {
                console.error('Failed to parse user data:', e);
            }
        }
    }
    
    // Get navbar elements
    const navGetStarted = document.getElementById('navGetStarted');
    const userDropdown = document.getElementById('userDropdown');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userButton = document.getElementById('userButton');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Get mobile menu elements
    const mobileGetStarted = document.getElementById('mobileGetStarted');
    const mobileUserInfo = document.getElementById('mobileUserInfo');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (currentUser && currentUser.username) {
        // User is logged in - show dropdown, keep "Get Started" hidden
        if (userDropdown) userDropdown.classList.remove('hidden');
        
        // Set username and avatar initial
        if (userName) userName.textContent = currentUser.username;
        if (userAvatar) userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        
        // Handle dropdown toggle
        if (userButton) {
            userButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('open');
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (userDropdown && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('open');
            }
        });
        
        // Handle logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.AuthHelper) {
                    window.AuthHelper.logoutUser();
                } else {
                    // Fallback if AuthHelper not available
                    sessionStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                }
            });
        }
        
        // Mobile menu
        if (mobileGetStarted) mobileGetStarted.style.display = 'none';
        if (mobileUserInfo) mobileUserInfo.style.display = 'block';
        
        // Handle mobile logout
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.AuthHelper) {
                    window.AuthHelper.logoutUser();
                } else {
                    sessionStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                }
            });
        }
    } else {
        // User is not logged in - show "Get Started", hide dropdown
        if (navGetStarted) navGetStarted.classList.remove('hidden');
        if (userDropdown) userDropdown.classList.add('hidden');
        if (mobileGetStarted) mobileGetStarted.style.display = 'block';
        if (mobileUserInfo) mobileUserInfo.style.display = 'none';
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', updateNavbar);


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ===== NAVBAR BACKGROUND ON SCROLL =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
    }
});


// ===== FADE IN ANIMATION ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add visible state styles
const style = document.createElement('style');
style.textContent = `
    .feature-card.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);


// ===== API CONFIGURATION =====
// For lokal utvikling: bruker localhost
// For produksjon (Vercel): endre til '' (tom string)
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : '';

// ===== REGISTRATION FORM HANDLER =====
const registrationForm = document.getElementById('registrationForm');

if (registrationForm) {
    // Get password fields
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordMatchMessage = document.getElementById('passwordMatch');

    // Live password matching validation
    const checkPasswordMatch = () => {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;

        // Only show message if user has started typing in confirm field
        if (confirmPassword.length > 0) {
            passwordMatchMessage.style.display = 'block';
            
            if (password === confirmPassword) {
                passwordMatchMessage.textContent = '✓ Passwords match';
                passwordMatchMessage.style.color = '#10b981'; // green
            } else {
                passwordMatchMessage.textContent = '✗ Passwords do not match';
                passwordMatchMessage.style.color = '#ef4444'; // red
            }
        } else {
            passwordMatchMessage.style.display = 'none';
        }
    };

    // Add event listeners for live validation
    if (passwordField && confirmPasswordField && passwordMatchMessage) {
        passwordField.addEventListener('input', checkPasswordMatch);
        confirmPasswordField.addEventListener('input', checkPasswordMatch);
    }

    // Helper function to show error messages
    const showError = (message) => {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            // Smooth scroll to error message
            setTimeout(() => {
                errorDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            }, 150);
        } else {
            alert(message);
        }
    };

    const hideError = () => {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    };

    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError(); // Clear previous errors
        
        // Hent verdier fra skjemaet
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const securityQuestion = document.getElementById('securityQuestion').value;
        const securityAnswer = document.getElementById('securityAnswer').value;
        
        // Valider at passordene matcher
        if (password !== confirmPassword) {
            showError('✗ Passwords do not match!');
            return;
        }
        
        // Valider passordlengde
        if (password.length < 6) {
            showError('✗ Password must be at least 6 characters');
            return;
        }
        
        // Valider brukernavn
        if (username.length < 3) {
            showError('✗ Username must be at least 3 characters');
            return;
        }

        // Valider sikkerhetsspørsmål
        if (!securityQuestion) {
            showError('✗ Please select a security question');
            return;
        }

        if (!securityAnswer || securityAnswer.length < 2) {
            showError('✗ Security answer must be at least 2 characters');
            return;
        }
        
        try {
            // Send forespørsel til backend API
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    securityQuestion: securityQuestion,
                    securityAnswer: securityAnswer
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registrering feilet');
            }
            
            alert('✓ Registration successful! Please log in with your new account.');
            window.location.href = 'login.html';
            
        } catch (error) {
            console.error('Registreringsfeil:', error);
            showError('✗ Registration failed: ' + (error.message || 'Something went wrong. Please try again.'));
        }
    });
}

// ===== LOGIN FORM HANDLER =====
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    // Helper function to show error messages
    const showLoginError = (message) => {
        const errorDiv = document.getElementById('loginErrorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            // No scrolling needed on locked page
        } else {
            alert(message);
        }
    };

    const hideLoginError = () => {
        const errorDiv = document.getElementById('loginErrorMessage');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideLoginError(); // Clear previous errors
        
        // Hent verdier fra skjemaet
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            // Send forespørsel til backend API
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Innlogging feilet');
            }
            
            // Lagre brukerinfo i sessionStorage (bruk AuthHelper hvis tilgjengelig)
            if (window.AuthHelper) {
                window.AuthHelper.setCurrentUser(data.user);
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            
            // Vis suksessmelding
            alert('✓ Login successful! Welcome back, ' + data.user.username + '!');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Innloggingsfeil:', error);
            // Vis feilmelding
            showLoginError('✗ Login failed: ' + (error.message || 'Invalid username or password'));
        }
    });
}
// ===== TABS =====
const tabButtons = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-content');

tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
        tabButtons.forEach(t => t.classList.remove('active'));
        tabPanels.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// ===== ACCORDION =====
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        header.parentElement.classList.toggle('open');
    });
});

// Hero Scroll pil
const scrollArrow = document.querySelector('.scroll-indicator');
console.log('Found:', scrollArrow);

if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
        console.log('Clicked!');
        const features = document.querySelector('.features');
        if (features) {
            features.scrollIntoView({ behavior: 'smooth' });
        }
    });
}
