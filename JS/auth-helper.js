// ===== AUTH HELPER - SESSION MANAGEMENT =====
// Håndterer brukerautentisering og session management

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// Hent innlogget bruker fra sessionStorage
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Lagre bruker i session
function setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

// Logg ut bruker
function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Sjekk om bruker er innlogget, hvis ikke redirect til login
function requireLogin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// API kall funksjoner
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Eksporter funksjoner
window.AuthHelper = {
    getCurrentUser,
    setCurrentUser,
    logoutUser,
    requireLogin,
    apiCall,
    API_BASE
};
