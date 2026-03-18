// ===== QUIZ - AI ETHICS KNOWLEDGE TEST =====
// Denne filen inneholder all logikk for quiz-systemet om AI-etikk og ansvarlig bruk

// ===== QUIZ-SPØRSMÅL DATABASE =====
// Array med alle spørsmålene, svar-alternativene, og riktig svar (index)
const quizQuestions = [
    {
        question: "What is the most important principle when using AI for academic work?",
        options: [
            "Always use AI to complete all assignments",
            "Understand and learn from AI-generated content",
            "Never acknowledge when you've used AI",
            "Copy AI outputs directly without review"
        ],
        correct: 1  // Index for riktig svar (starter på 0)
    },
    {
        question: "When should you cite AI usage in your academic work?",
        options: [
            "Never, it's not necessary",
            "Only when your professor asks",
            "Always, when AI contributed to your work",
            "Only for major assignments"
        ],
        correct: 2
    },
    {
        question: "What is a key risk of over-relying on AI?",
        options: [
            "Saving too much time",
            "Reduced critical thinking and learning",
            "Getting better grades",
            "Improving writing skills"
        ],
        correct: 1
    },
    {
        question: "How should you verify AI-generated information?",
        options: [
            "Trust it completely",
            "Cross-check with reliable sources",
            "Only verify if it seems wrong",
            "Ask the AI if it's correct"
        ],
        correct: 1
    },
    {
        question: "What is academic integrity?",
        options: [
            "Using AI for all assignments",
            "Getting the highest grade possible",
            "Honest and ethical conduct in academic work",
            "Working faster than others"
        ],
        correct: 2
    },
    {
        question: "When using AI for writing assignments, what is the best approach?",
        options: [
            "Submit the AI text exactly as it is",
            "Use AI for ideas and then write your own version",
            "Let AI do everything",
            "Copy from multiple AI responses"
        ],
        correct: 1
    },
    {
        question: "Why is it important not to share private information with AI?",
        options: [
            "Because AI might store or process the data",
            "Because AI will delete it immediately",
            "Because AI cannot read it",
            "Because AI will send it to friends"
        ],
        correct: 0
    },
    {
        question: "Which of these is an example of responsible AI use?",
        options: [
            "Using AI to cheat on exams",
            "Using AI to summarize a long article for studying",
            "Using AI to write essays without reading them",
            "Using AI to avoid learning"
        ],
        correct: 1
    },
    {
        question: "True or False: AI can sometimes make mistakes or provide incorrect information.",
        options: [
            "True",
            "False"
        ],
        correct: 0
    },
    {
        question: "True or False: AI should replace critical thinking.",
        options: [
            "True",
            "False"
        ],
        correct: 1
    },
    {
        question: "True or False: AI can help brainstorm ideas for projects.",
        options: [
            "True",
            "False"
        ],
        correct: 0
    },
    {
        question: "True or False: It is okay to submit AI-generated work without editing or understanding it.",
        options: [
            "True",
            "False"
        ],
        correct: 1
    },
    {
        question: "True or False: AI works best when used as a tool to support learning.",
        options: [
            "True",
            "False"
        ],
        correct: 0
    }
];

// ===== QUIZ-TILSTAND VARIABLER =====
let currentQuestion = 0;  // Hvilket spørsmål brukeren er på nå
let selectedAnswers = new Array(quizQuestions.length).fill(null);  // Lagrer brukerens valgte svar
let showingResults = false;  // Om brukeren ser resultatene nå

// ===== INITIALISER QUIZ =====
// Starter quizen når siden lastes
function initQuiz() {
    loadQuestion();
    updateProgress();  
}

// ===== LAST INN SPØRSMÅL =====
// Viser nåværende spørsmål med alle alternativer
function loadQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById('question').textContent = `Question ${currentQuestion + 1}: ${question.question}`;
    document.getElementById('questionCounter').textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    const isAnswered = selectedAnswers[currentQuestion] !== null;
    const correctIndex = question.correct;
    
    // Generer alle svar-alternativer
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        
        // Vis riktig/feil hvis allerede besvart
        if (isAnswered) {
            optionDiv.classList.add('disabled');
            if (index === correctIndex) {
                optionDiv.classList.add('correct');
            } else if (index === selectedAnswers[currentQuestion]) {
                optionDiv.classList.add('incorrect');
            }
        }
        
        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    updateButtons();
}

// ===== VELG ET SVAR =====
// Håndterer når brukeren klikker på et svar-alternativ
function selectOption(index) {
    if (showingResults) return;
    
    // Ikke tillat å endre svar etter å ha svart
    if (selectedAnswers[currentQuestion] !== null) return;
    
    selectedAnswers[currentQuestion] = index;
    
    const questionIndex = currentQuestion;
    const correctIndex = quizQuestions[questionIndex].correct;
    
    // Vis visuell tilbakemelding på alle alternativ
    document.querySelectorAll('.option').forEach((opt, i) => {
        opt.classList.add('disabled');
        
        if (i === correctIndex) {
            opt.classList.add('correct');  // Grønn for riktig svar
        } else if (i === index) {
            opt.classList.add('incorrect');  // Rød for feil svar
        }
        
        opt.classList.remove('selected');
    });
    
    // Aktiver "Next" eller "Submit" knappen
    document.getElementById('nextBtn').disabled = false;
    document.getElementById('submitBtn').disabled = false;
}

// ===== OPPDATER KNAPPER =====
// Viser/skjuler Previous, Next og Submit knappene basert på hvor i quizen brukeren er
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Vis "Previous" kun hvis ikke på første spørsmål
    prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
    
    // Vis "Submit" på siste spørsmål, ellers "Next"
    if (currentQuestion === quizQuestions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        submitBtn.disabled = selectedAnswers[currentQuestion] === null;
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        nextBtn.disabled = selectedAnswers[currentQuestion] === null;
    }
}

// ===== OPPDATER FREMDRIFTSINDIKATOR =====
// Viser hvor langt i quizen brukeren er kommet
function updateProgress() {
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// ===== NESTE SPØRSMÅL =====
// Går til neste spørsmål i quizen
function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        loadQuestion();
        updateProgress();
    }
}

// ===== FORRIGE SPØRSMÅL =====
// Går tilbake til forrige spørsmål
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
        updateProgress();
    }
}

// ===== LEVER INN QUIZ =====
// Beregner poengsum og viser resultatene til brukeren
function submitQuiz() {
    showingResults = true;
    let score = 0;
    
    // Beregn hvor mange riktige svar brukeren hadde
    selectedAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correct) {
            score++;
        }
    });

    // Vis riktig/feil på nåværende spørsmål
    document.querySelectorAll('.option').forEach((opt, i) => {
        const questionIndex = currentQuestion;
        const correctIndex = quizQuestions[questionIndex].correct;
        
        if (i === correctIndex) {
            opt.classList.add('correct');
        } else if (i === selectedAnswers[questionIndex]) {
            opt.classList.add('incorrect');
        }
    });
    
    // Beregn prosentvis poengsum
    const percentage = (score / quizQuestions.length) * 100;
    
    // Skjul quiz-innholdet og vis resultatene
    document.getElementById('quizContent').style.display = 'none';
    const resultDiv = document.getElementById('quizResult');
    resultDiv.style.display = 'block';
    
    // Bestem tilbakemeldingsmelding basert på poengsum
    let message = '';
    if (percentage >= 80) {
        message = 'Excellent! You have a strong understanding of AI ethics.';
    } else if (percentage >= 60) {
        message = 'Good job! Consider reviewing the guidelines for better understanding.';
    } else {
        message = 'Keep learning! Review the guidelines and resources to improve your knowledge.';
    }
    
    // Vis resultat-skjermen
    resultDiv.innerHTML = `
        <div class="quiz-result">
            <h2>Quiz Complete! 🎉</h2>
            <p>Your Score: ${score} / ${quizQuestions.length} (${percentage.toFixed(0)}%)</p>
            <p style="margin-top: 16px;">${message}</p>
            <div class="quiz-buttons" style="margin-top: 32px;">
                <button class="btn btn-primary" onclick="resetQuiz()">Retake Quiz</button>
                <a href="guidelines.html" class="btn btn-secondary">Review Guidelines</a>
            </div>
        </div>
    `;
}

// ===== TILBAKESTILL QUIZ =====
// Starter quizen på nytt
function resetQuiz() {
    currentQuestion = 0;
    selectedAnswers = new Array(quizQuestions.length).fill(null);
    showingResults = false;
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    initQuiz();
}

// ===== EVENT LISTENERS =====
// Kobler knappene til deres funksjoner
document.getElementById('nextBtn').addEventListener('click', nextQuestion);
document.getElementById('prevBtn').addEventListener('click', prevQuestion);
document.getElementById('submitBtn').addEventListener('click', submitQuiz);

// ===== START QUIZEN =====
// Initialiser quizen når siden er ferdig lastet
initQuiz();
