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
        'write paper', 'do assignment', 'write the code', 'complete this for me',
        'do this assignment', 'solve my homework', 'write a report',
        'create essay', 'make my assignment', 'finish this', 'do it for me',
        'write the solution', 'write full code', 'complete the program',
        'write entire', 'make the code', 'generate essay', 'create my',
        'solve all', 'answer all questions', 'complete quiz', 'do this quiz',
        'write the answer', 'give answer', 'just write', 'write program for me',
        'create the solution', 'solve the assignment', 'do the work',
        'write this for me', 'complete code', 'write my code', 'do my project',
        'create the code', 'build this for me', 'write function for me',
        'make this code', 'solve everything', 'give me code', 'write solution',
        'finish my homework', 'complete my project', 'do exam for me',
        'create program for me', 'build the code', 'develop this for me',
        'write complete solution', 'full solution', 'give full code',
        'write all the code', 'solve this for me', 'answer this for me',
        'compose essay', 'draft my paper', 'write the essay',
        'generate code', 'produce code', 'output the code', 'provide the code',
        'make the solution', 'create solution', 'build solution',
        'code the entire', 'implement everything', 'do the entire',
        'write whole', 'complete whole', 'finish the assignment',
        'write lab report', 'write analysis', 'write summary for me',
        'write conclusion', 'write introduction for', 'solve test',
        'do the exam', 'answer exam', 'complete test', 'solve quiz',
        'write thesis', 'write dissertation', 'write research paper',
        'create presentation', 'make slides for', 'build website for me',
        'develop app for me', 'code app', 'program this', 'script this for me',
        'automate this for me', 'compute answer', 'calculate for me',
        'give direct answer', 'just give me', 'simply provide', 'tell me the answer',
        'what is the answer to', 'answers to homework', 'homework answers',
        'test answers', 'quiz answers', 'exam solutions', 'assignment solutions'
    ];
    
    const hasBadPhrase = badPhrases.some(phrase => lowerPrompt.includes(phrase));
    
    if (hasBadPhrase) {
        issues.push('Asks AI to complete work instead of helping you learn');
        issues.push('May violate academic integrity policies');
        score -= 40;
    } else {
        score += 5;
    }

    // ===== SJEKK FOR LÆRINGSORIENTERTE FRASER =====
    // Disse frasene indikerer at studenten ønsker å forstå og lære
    const goodPhrases = [
        'explain', 'help me understand', 'how does', 'can you clarify',
        'what is the difference', 'give examples', 'break down',
        'confused about', 'struggling with', 'help me learn', 'teach me',
        'guide me', 'show me how', 'walk me through', 'what are the steps',
        'how can i', 'help me figure out', 'point me in the right direction',
        'what should i consider', 'help me think', 'how do i approach',
        'what concepts', 'why does', 'how come', 'what causes',
        'help me debug', 'what am i missing', 'where am i going wrong',
        'can you guide', 'help me see', 'what is meant by', 'clarify the concept',
        'difference between', 'compare and contrast', 'give me hints',
        'suggest approaches', 'what strategy', 'how would you approach',
        'help me brainstorm', 'feedback on my approach', 'review my logic',
        'is my thinking correct', 'am i on the right track', 'check my understanding',
        'verify my approach', 'tips for', 'best practices', 'how to improve',
        'what resources', 'where can i learn', 'recommended reading',
        'help me explore', 'discuss with me', 'what are some ways',
        'how might i', 'what if i', 'alternatives to', 'pros and cons',
        'help me analyze', 'help me evaluate', 'critique my idea',
        'what are implications', 'help me reason', 'logic behind',
        'principle behind', 'concept of', 'theory of', 'explain why',
        'help me practice', 'exercise for', 'practice problems',
        'similar examples', 'analogies for', 'relate this to',
        'connect to', 'how does this relate', 'underlying principle',
        'fundamental concept', 'key idea', 'central theme',
        'help me recognize', 'identify patterns', 'common mistakes',
        'pitfalls to avoid', 'what to watch for', 'warning signs',
        'better way to', 'optimize my', 'improve my understanding',
        'deepen my knowledge', 'expand on', 'elaborate on',
        'more about', 'further explain', 'in other words',
        'simplify this', 'put simply', 'layman terms',
        'visualize this', 'diagram of', 'illustrate how',
        'real world example', 'practical application', 'use case',
        'when would i use', 'appropriate to use', 'best suited for',
        'help me compare', 'contrast with', 'similarity between',
        'relationship between', 'connection between', 'how relates to',
        'build my intuition', 'develop understanding', 'grasp the concept',
        'mental model', 'think about', 'way to remember',
        'mnemonic for', 'help me recall', 'remember this',
        'study strategy', 'learning technique', 'understand better',
        'make sense of', 'interpret this', 'meaning of',
        'significance of', 'importance of', 'why is this important',
        'what makes this', 'characteristics of', 'properties of',
        'features of', 'aspects of', 'components of',
        'parts of', 'elements of', 'how to structure',
        'organize my thoughts', 'framework for', 'model for'
    ];
    
    const hasGoodPhrase = goodPhrases.some(phrase => lowerPrompt.includes(phrase));
    
    if (hasGoodPhrase) {
        strengths.push('Uses learning-focused language');
        score += 15;
    } else {
        suggestions.push('Use learning-focused phrases like "explain", "help me understand", "how does"');
        issues.push('Lacks learning-focused language');
        score -= 10;
    }

    // ===== SJEKK LENGDE =====
    // Vurderer om promptet har nok kontekst
    if (prompt.length < 20) {
        issues.push('Prompt is too short - may not provide enough context');
        score -= 15;
    } else if (prompt.length >= 50 && prompt.length <= 200) {
        strengths.push('Good length with adequate context');
        score += 10;
    } else if (prompt.length > 200) {
        strengths.push('Provides detailed context');
        score += 15;
    }

    // ===== SJEKK FOR SPESIFISITET =====
    // Et spørsmålstegn indikerer et tydelig spørsmål
    if (prompt.includes('?')) {
        strengths.push('Asks a clear question');
        score += 10;
    }

    // ===== SJEKK FOKUS PÅ FORSTÅELSE VS SVAR =====
    // Fokus på svar-relaterte ord uten forståelses-ord kan være problematisk
    const answerFocusWords = ['answer', 'solution', 'result', 'give me the', 'tell me the', 'what is the'];
    const understandingWords = ['understand', 'learn', 'explain', 'why', 'how does', 'clarify'];
    
    const hasAnswerFocus = answerFocusWords.some(word => lowerPrompt.includes(word));
    const hasUnderstandingFocus = understandingWords.some(word => lowerPrompt.includes(word));
    
    if (hasAnswerFocus && !hasUnderstandingFocus) {
        issues.push('Focuses on getting answers rather than understanding');
        score -= 10;
    }

    // ===== SJEKK FOR AKADEMISK KONTEKST =====
    // Ser etter tegn på akademisk eller kursspesifikt innhold
    const academicKeywords = [
        'assignment', 'homework', 'course', 'class', 'lecture', 'textbook',
        'professor', 'teacher', 'study', 'exam', 'test', 'quiz',
        'chapter', 'lesson', 'module', 'project', 'lab', 'research',
        'algorithm', 'function', 'variable', 'code', 'program', 'data',
        'theory', 'concept', 'principle', 'formula', 'equation', 'proof',
        'analysis', 'method', 'process', 'system', 'model', 'framework',
        'learning', 'understanding', 'struggling', 'confused', 'studying'
    ];
    
    const hasAcademicContext = academicKeywords.some(keyword => lowerPrompt.includes(keyword));
    
    if (hasAcademicContext) {
        strengths.push('Includes academic or course-related context');
        score += 25;
    } else {
        suggestions.push('Add context about your assignment or what you\'re studying');
        issues.push('Missing academic context - is this related to your coursework?');
        score -= 15;
    }

    // ===== SJEKK FOR IKKE-AKADEMISKE EMNER =====
    // Vanlige ikke-akademiske emner som ofte ikke er relatert til skolearbeid
    const casualTopics = [
        'pizza', 'recipe', 'cooking', 'food', 'restaurant', 'movie', 'game',
        'sport', 'music', 'celebrity', 'fashion', 'shopping', 'travel',
        'vacation', 'hobby', 'entertainment', 'tv show', 'social media',
        'culinary', 'chef', 'cuisine', 'baking', 'ingredient', 'topping'
    ];
    
    const hasCasualTopic = casualTopics.some(topic => lowerPrompt.includes(topic));
    
    if (hasCasualTopic && !hasAcademicContext) {
        issues.push('Topic appears unrelated to academic coursework');
        suggestions.push('This tool is designed for educational/academic prompts');
        score -= 25;
    }

    // ===== SJEKK FOR ROLEPLAY PROMPTS =====
    // Detekterer prompts som ber AI om å spille en rolle, ofte ikke akademisk
    const roleplayPhrases = [
        'you are a', 'act as a', 'pretend you are', 'you are an expert',
        'you are the', 'roleplay as', 'imagine you are', 'you\'re a',
        'act like a', 'behave as a', 'take on the role'
    ];
    
    const isRoleplay = roleplayPhrases.some(phrase => lowerPrompt.includes(phrase));
    
    if (isRoleplay && !hasAcademicContext) {
        issues.push('Uses roleplay format not appropriate for academic learning');
        suggestions.push('Focus on your learning needs rather than AI roleplay');
        score -= 15;
    }

    // ===== SJEKK FOR SPESIFISITET OG DETALJER =====
    // Belønner prompts som gir spesifikk kontekst
    const wordCount = prompt.trim().split(/\s+/).length;
    if (wordCount >= 20) {
        strengths.push('Provides detailed information');
        score += 10;
    } else if (wordCount >= 10) {
        score += 5;
    } else if (wordCount < 5) {
        issues.push('Too vague - needs more specific information');
        score -= 10;
    }

    // ===== SJEKK FOR PERSONLIG LÆRINGSKONKEKST =====
    // Ser etter tegn på at studenten gir personlig kontekst om sin læringssituasjon
    const personalContextPhrases = [
        'i am', 'i\'m', 'my class', 'my course', 'my assignment', 'my homework',
        'i don\'t understand', 'i\'m confused', 'i\'m struggling', 'i tried',
        'i need help', 'i\'m learning', 'we are learning', 'we\'re studying',
        'our professor', 'our teacher', 'in my program', 'i\'ve been working on',
        'i can\'t figure out', 'i\'m working on', 'i need to', 'i have to',
        'i\'m supposed to', 'i should', 'for my', 'i wonder', 'i\'m trying to'
    ];
    
    const hasPersonalContext = personalContextPhrases.some(phrase => lowerPrompt.includes(phrase));
    
    if (hasPersonalContext) {
        strengths.push('Provides personal learning context');
        score += 15;
    } else {
        suggestions.push('Add personal context: What class is this for? What have you tried? What specifically confuses you?');
    }

    // ===== SJEKK FOR OVERGENERISKE FORESPØRSLER =====
    // Detekterer veldig brede, Wikipedia-lignende spørsmål
    const genericPatterns = [
        /^(explain|tell me|what is|describe|list)\s+(what|about|the)?\s+\w+\s+(is|are)/i,
        /^(explain|describe)\s+\w+(\s+\w+)?\s*\.?\s*$/i  // "explain java" eller "explain machine learning"
    ];
    
    const seemsGeneric = genericPatterns.some(pattern => pattern.test(prompt.trim()));
    const hasMultipleBroadQuestions = (lowerPrompt.match(/\blist\b|\bmention\b|\bdescribe\b|\bexplain\b/g) || []).length >= 3;
    
    if ((seemsGeneric || hasMultipleBroadQuestions) && !hasPersonalContext) {
        issues.push('Too generic - seems like a general information request rather than specific learning need');
        suggestions.push('Be more specific about YOUR learning situation and what YOU need help with');
        score -= 10;
    }

    // ===== NORMALISER POENGSUM =====
    // Sørger for at score er mellom 0 og 100
    score = Math.max(0, Math.min(100, score + 25));

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
