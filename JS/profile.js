// ===== PROFILE PAGE - SAVED PROMPTS AND ACHIEVEMENTS =====
// Håndterer visning av brukerens lagrede prompts og badge-systemet

// ===== DOM ELEMENT REFERANSER =====
const profileName = document.getElementById('profileName');
const avatarText = document.getElementById('avatarText');
const badgesGrid = document.getElementById('badgesGrid');
const savedPromptsList = document.getElementById('savedPromptsList');

// ===== GLOBAL STATE =====
let currentUser = null;
let userStats = null;
let userBadges = [];
let savedPrompts = [];
let promptBasedBadges = [];

// ===== BADGE DEFINISJONER =====
// Alle tilgjengelige badges med betingelser for å låse dem opp
const badges = [
    {
        id: 'first-prompt',
        icon: 'fa fa-bullseye',
        name: 'First Steps',
        description: 'Used Prompt Helper for the first time',
        condition: (stats) => stats.prompt_helper_uses >= 1
    },
    {
        id: 'prompt-master',
        icon: 'fa fa-star',
        name: 'Prompt Master',
        description: 'Used Prompt Helper 3 times',
        condition: (stats) => stats.prompt_helper_uses >= 3
    },
    {
        id: 'prompt-expert',
        icon: 'fa fa-trophy',
        name: 'Prompt Expert',
        description: 'Used Prompt Helper 10 times',
        condition: (stats) => stats.prompt_helper_uses >= 10
    },
    {
        id: 'quiz-starter',
        icon: 'fa fa-book',
        name: 'Quiz Starter',
        description: 'Completed your first quiz',
        condition: (stats) => stats.quizzes_completed >= 1
    },
    {
        id: 'quiz-master',
        icon: 'fa fa-graduation-cap',
        name: 'Quiz Master',
        description: 'Completed 3 quizzes',
        condition: (stats) => stats.quizzes_completed >= 3
    },
    {
        id: 'perfect-score',
        icon: 'fa fa-certificate',
        name: 'Perfect Score',
        description: 'Got 100% on a quiz',
        condition: (stats) => stats.perfect_quizzes >= 1
    },
    {
        id: 'saver',
        icon: 'fa fa-save',
        name: 'Collector',
        description: 'Saved 5 prompts to your profile',
        condition: () => promptBasedBadges.includes('saver')
    },
    {
        id: 'quality-writer',
        icon: 'fa fa-magic',
        name: 'Quality Writer',
        description: 'Saved 3 excellent prompts (70+ score)',
        condition: () => promptBasedBadges.includes('quality-writer')
    }
];

// ===== INITIALISER PROFIL =====
async function initializeProfile() {
    // Sjekk at bruker er innlogget
    currentUser = window.AuthHelper?.requireLogin();
    if (!currentUser) return;
    
    // Last all profildata fra API
    await loadProfileData();
}

// ===== LAST PROFILDATA FRA API =====
async function loadProfileData() {
    try {
        const data = await window.AuthHelper.apiCall(`/get-profile?userId=${currentUser.id}`);
        
        if (data.success) {
            currentUser = data.user;
            userStats = data.stats;
            userBadges = data.badges;
            savedPrompts = data.prompts;
            promptBasedBadges = data.promptBasedBadges;
            
            // Oppdater UI
            loadUserInfo();
            loadBadges();
            loadSavedPrompts();
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        
        // Fallback til localStorage hvis API feiler
        loadUserInfo();
        loadBadgesFromLocalStorage();
        loadSavedPromptsFromLocalStorage();
    }
}

// ===== LAST BRUKERINFORMASJON =====
function loadUserInfo() {
    const username = currentUser?.username || 'User';
    profileName.textContent = username;
    avatarText.textContent = username.charAt(0).toUpperCase();
}

// ===== LAST OG VIS BADGES =====
function loadBadges() {
    badgesGrid.innerHTML = '';
    
    const unlockedBadges = [];
    
    badges.forEach(badge => {
        const isUnlocked = badge.condition(userStats);
        
        const badgeElement = createBadgeElement(badge, isUnlocked);
        badgesGrid.appendChild(badgeElement);
        
        if (isUnlocked) {
            unlockedBadges.push(badge);
        }
    });
    
    // Vis melding hvis ingen badges er opplåst
    if (unlockedBadges.length === 0) {
        badgesGrid.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i class="fa fa-trophy"></i></div><p>No achievements yet. Start using Clarify to unlock badges!</p></div>';
    }
}

// ===== FALLBACK: LAST BADGES FRA LOCALSTORAGE =====
function loadBadgesFromLocalStorage() {
    const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
    const savedPromptsLocal = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
    
    userStats = {
        prompt_helper_uses: stats.promptHelperUses || 0,
        quizzes_completed: stats.quizzesCompleted || 0,
        perfect_quizzes: stats.perfectQuizzes || 0
    };
    
    if (savedPromptsLocal.length >= 5) {
        promptBasedBadges.push('saver');
    }
    if (savedPromptsLocal.filter(p => p.score >= 70).length >= 3) {
        promptBasedBadges.push('quality-writer');
    }
    
    loadBadges();
}

// ===== OPPRETT BADGE ELEMENT =====
function createBadgeElement(badge, isUnlocked) {
    const badgeDiv = document.createElement('div');
    badgeDiv.className = `badge-item ${isUnlocked ? '' : 'locked'}`;
    
    let badgeHTML = `
        <div class="badge-icon"><i class="${badge.icon}"></i></div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-description">${badge.description}</div>
    `;
    
    if (isUnlocked) {
        // Finn unlock date fra userBadges array
        const userBadge = userBadges.find(b => b.badge_id === badge.id);
        if (userBadge) {
            const date = new Date(userBadge.unlocked_at);
            badgeHTML += `<div class="badge-date">Unlocked ${formatDate(date)}</div>`;
        }
    }
    
    badgeDiv.innerHTML = badgeHTML;
    return badgeDiv;
}

// ===== LAST OG VIS LAGREDE PROMPTS =====
function loadSavedPrompts() {
    savedPromptsList.innerHTML = '';
    
    if (savedPrompts.length === 0) {
        savedPromptsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fa fa-file-text-o"></i></div>
                <p>No saved prompts yet.</p>
                <p>Use the <a href="prompt.html">Prompt Helper</a> to analyze and save your best prompts!</p>
            </div>
        `;
        return;
    }
    
    savedPrompts.forEach(prompt => {
        const promptElement = createPromptElement(prompt);
        savedPromptsList.appendChild(promptElement);
    });
}

// ===== FALLBACK: LAST PROMPTS FRA LOCALSTORAGE =====
function loadSavedPromptsFromLocalStorage() {
    savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
    
    // Konverter til database-format
    savedPrompts = savedPrompts.map(p => ({
        id: p.id,
        prompt_text: p.text,
        score: p.score,
        category: p.category,
        created_at: p.date
    }));
    
    loadSavedPrompts();
}

// ===== OPPRETT PROMPT ELEMENT =====
function createPromptElement(prompt) {
    const promptDiv = document.createElement('div');
    promptDiv.className = 'prompt-item';
    
    const scoreClass = getScoreClass(prompt.category);
    const scoreLabel = getScoreLabel(prompt.score);
    
    promptDiv.innerHTML = `
        <div class="prompt-header">
            <div class="prompt-score ${scoreClass}">${scoreLabel}: ${prompt.score}/100</div>
        </div>
        <div class="prompt-text">${escapeHtml(prompt.prompt_text)}</div>
        <div class="prompt-meta">
            <span class="prompt-date">Saved ${formatDate(new Date(prompt.created_at))}</span>
            <button class="delete-prompt-btn" onclick="deletePrompt('${prompt.id}')">Delete</button>
        </div>
    `;
    
    return promptDiv;
}

// ===== HJELPEFUNKSJONER =====

function getScoreClass(category) {
    if (category === 'good') return 'excellent';
    if (category === 'moderate') return 'good';
    return 'fair';
}

function getScoreLabel(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
}

function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== SLETT PROMPT =====
async function deletePrompt(promptId) {
    if (!confirm('Are you sure you want to delete this prompt?')) {
        return;
    }
    
    try {
        await window.AuthHelper.apiCall('/delete-prompt', {
            method: 'DELETE',
            body: JSON.stringify({ promptId })
        });
        
        // Refresh profildata
        await loadProfileData();
    } catch (error) {
        console.error('Error deleting prompt:', error);
        alert('Kunne ikke slette prompt. Prøv igjen senere.');
    }
}

// ===== INITIALISER NÅR SIDEN LASTER =====
document.addEventListener('DOMContentLoaded', initializeProfile);
