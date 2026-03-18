// ===== PROMPT HELPER - AI PROMPT EVALUATION TOOL =====
// Denne filen inneholder all logikk for å evaluere og gi tilbakemelding på AI-prompts

// ===== DOM ELEMENT REFERANSER =====
// Henter alle nødvendige HTML-elementer for å håndtere prompt-formularet
const promptForm = document.getElementById('promptForm');
const promptInput = document.getElementById('promptInput');
const feedback = document.getElementById('feedback');
const feedbackIcon = document.getElementById('feedbackIcon');
const feedbackTitle = document.getElementById('feedbackTitle');
const feedbackScore = document.getElementById('feedbackScore');
const feedbackDetails = document.getElementById('feedbackDetails');

// ===== EKSEMPEL-PROMPTS FUNKSJONALITET =====
// Gjør det mulig å klikke på eksempel-prompts for å fylle inn tekstfeltet
document.querySelectorAll('.example-item').forEach(item => {
    item.addEventListener('click', () => {
        promptInput.value = item.dataset.example;
        promptInput.focus();
    });
});

// ===== SKJEMA INNSENDING =====
// Håndterer når brukeren sender inn et prompt for evaluering
promptForm.addEventListener('submit', (e) => {
    e.preventDefault();
    analyzePrompt(promptInput.value);
});

// ===== HOVED ANALYSE FUNKSJON =====
// Tar inn et prompt og starter evalueringsprosessen
function analyzePrompt(prompt) {
    const analysis = evaluatePrompt(prompt);
    displayFeedback(analysis);
}

// ===== PROMPT EVALUERING =====
// Evaluerer kvaliteten på et prompt basert på flere kriterier
// Returnerer et objekt med poengsum, kategori, problemer, styrker og forslag
function evaluatePrompt(prompt) {
    let score = 0;
    const issues = [];        // Liste over problemer med promptet
    const strengths = [];     // Liste over positive aspekter
    const suggestions = [];   // Forslag til forbedring

    const lowerPrompt = prompt.toLowerCase();

    // ===== SJEKK FOR PROBLEMATISKE FRASER =====
    // Disse frasene indikerer at studenten ber AI om å gjøre arbeidet for dem
    const badPhrases = [
        'write essay', 'write my', 'do my homework', 'solve this problem for me',
        'give me the answer', 'complete assignment', 'write code for',
        'write paper', 'do assignment'
    ];
    
    const hasBadPhrase = badPhrases.some(phrase => lowerPrompt.includes(phrase));
    
    if (hasBadPhrase) {
        issues.push('Asks AI to complete work instead of helping you learn');
        issues.push('May violate academic integrity policies');
        score -= 30;
    } else {
        strengths.push('Does not ask AI to do work for you');
        score += 15;
    }

    // ===== SJEKK FOR LÆRINGSORIENTERTE FRASER =====
    // Disse frasene indikerer at studenten ønsker å forstå og lære
    const goodPhrases = [
        'explain', 'help me understand', 'how does', 'can you clarify',
        'what is the difference', 'give examples', 'break down',
        'confused about', 'struggling with'
    ];
    
    const hasGoodPhrase = goodPhrases.some(phrase => lowerPrompt.includes(phrase));
    
    if (hasGoodPhrase) {
        strengths.push('Focuses on understanding and learning');
        score += 20;
    } else {
        suggestions.push('Consider phrasing it as a question to foster learning');
    }

    // ===== SJEKK LENGDE =====
    // Vurderer om promptet har nok kontekst
    if (prompt.length < 20) {
        issues.push('Prompt is too short - may not provide enough context');
        score -= 10;
    } else if (prompt.length > 50) {
        strengths.push('Provides adequate context');
        score += 10;
    }

    // ===== SJEKK FOR SPESIFISITET =====
    // Et spørsmålstegn indikerer et tydelig spørsmål
    if (prompt.includes('?')) {
        strengths.push('Asks a clear question');
        score += 10;
    }

    // ===== SJEKK FOKUS PÅ FORSTÅELSE VS SVAR =====
    // Fokus på "answer" uten "understand" kan være problematisk
    if (lowerPrompt.includes('answer') && !lowerPrompt.includes('understand')) {
        issues.push('Focuses on getting answers rather than understanding');
        score -= 10;
    }

    // ===== NORMALISER POENGSUM =====
    // Sørger for at score er mellom 0 og 100
    score = Math.max(0, Math.min(100, score + 50));

    // ===== BESTEM KATEGORI =====
    // Kategoriserer promptet basert på poengsum
    let category = 'moderate';
    if (score >= 70) category = 'good';      // Godt prompt
    if (score < 50) category = 'bad';        // Dårlig/problematisk prompt

    return {
        score,
        category,
        issues,
        strengths,
        suggestions
    };
}

// ===== VIS TILBAKEMELDING =====
// Viser evalueringsresultatet til brukeren med passende styling og meldinger
function displayFeedback(analysis) {
    feedback.style.display = 'block';
    feedback.className = `feedback-section ${analysis.category}`;

    // ===== SETT IKON OG TITTEL BASERT PÅ KATEGORI =====
    if (analysis.category === 'good') {
        feedbackIcon.textContent = '✓';
        feedbackTitle.textContent = 'Great Prompt!';
        feedbackScore.textContent = `Score: ${analysis.score}/100 - This is an effective learning-focused prompt.`;
    } else if (analysis.category === 'bad') {
        feedbackIcon.textContent = '✗';
        feedbackTitle.textContent = 'Problematic Prompt';
        feedbackScore.textContent = `Score: ${analysis.score}/100 - This prompt may violate academic integrity.`;
    } else {
        feedbackIcon.textContent = '!';
        feedbackTitle.textContent = 'Could Be Improved';
        feedbackScore.textContent = `Score: ${analysis.score}/100 - This prompt could be more effective.`;
    }

    // ===== BYGG DETALJERT TILBAKEMELDING =====
    let detailsHTML = '';

    // Vis styrker
    if (analysis.strengths.length > 0) {
        detailsHTML += '<h4>✓ Strengths:</h4><ul>';
        analysis.strengths.forEach(strength => {
            detailsHTML += `<li>${strength}</li>`;
        });
        detailsHTML += '</ul>';
    }

    // Vis problemer
    if (analysis.issues.length > 0) {
        detailsHTML += '<h4>✗ Issues:</h4><ul>';
        analysis.issues.forEach(issue => {
            detailsHTML += `<li>${issue}</li>`;
        });
        detailsHTML += '</ul>';
    }

    // Vis forslag
    if (analysis.suggestions.length > 0) {
        detailsHTML += '<h4>💡 Suggestions:</h4><ul>';
        analysis.suggestions.forEach(suggestion => {
            detailsHTML += `<li>${suggestion}</li>`;
        });
        detailsHTML += '</ul>';
    }

    feedbackDetails.innerHTML = detailsHTML;
}
