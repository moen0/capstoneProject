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


// ===== USER AUTHENTICATION & NAVBAR UPDATE =====
function updateNavbar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navCta = document.querySelector('.nav-cta');
    
    if (!navCta) return;
    
    if (currentUser && currentUser.username) {
        // Bruker er logget inn - vis dropdown med brukernavn
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <button class="user-button" id="userButton">
                ${currentUser.username}
            </button>
            <div class="dropdown-content" id="dropdownMenu">
                <a class="dropdown-item" id="logoutBtn">Log out</a>
            </div>
        `;
        
        // Erstatt "Get Started" med dropdown
        navCta.parentNode.replaceChild(dropdown, navCta);
        
        // Håndter dropdown-klikk
        const userButton = document.getElementById('userButton');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');
        
        userButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Lukk dropdown når man klikker utenfor
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });
        
        // Håndter logout
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    } else {
        // Bruker er ikke logget inn - vis "Get Started" som lenke til login
        navCta.href = 'login.html';
    }
}

// Kjør når siden lastes
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
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hent verdier fra skjemaet
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Valider at passordene matcher
        if (password !== confirmPassword) {
            alert('Passordene matcher ikke!');
            return;
        }
        
        // Valider passordlengde
        if (password.length < 6) {
            alert('Passordet må være minst 6 tegn');
            return;
        }
        
        // Valider brukernavn
        if (username.length < 3) {
            alert('Brukernavnet må være minst 3 tegn');
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
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registrering feilet');
            }
            
            alert('Registrering vellykket!');
            window.location.href = 'login.html';
            
        } catch (error) {
            console.error('Registreringsfeil:', error);
            alert(error.message || 'Noe gikk galt under registrering');
        }
    });
}

// ===== LOGIN FORM HANDLER =====
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
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
            
            // Lagre brukerinfo i localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            alert('Innlogging vellykket!');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Innloggingsfeil:', error);
            alert(error.message || 'Noe gikk galt under innlogging');
        }
    });
}