let currentQuiz = null;
let currentQuestionIndex = 0;

let questionH2 = document.querySelector("#question h2")
let answersEl = document.querySelector("#answers")

function startNewQuiz(quiz) {
    currentQuiz = quiz;
    window.location.hash = "#quiz"
    nextQuestion()
}

function nextQuestion() {
    currentQuestionIndex++;
    renderQuestion();
}

function renderQuestion() {
    answersEl.innerHTML = "";

    // question
    const q = currentQuiz[currentQuestionIndex];
    questionH2.innerText = q.question;

    // answers
    q.answers.forEach(a => {
        const el = createAnswer(a)
        answersEl.append(el)
    })
}

function createAnswer(answer) {
    const answerEl = document.createElement("div")
    answerEl.classList.add("answer")
    answerEl.innerText = answer
}

export {
    startNewQuiz
}