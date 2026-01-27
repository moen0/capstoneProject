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
