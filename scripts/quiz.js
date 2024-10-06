import { dom, onDomVarsLoaded } from "./dom.js";
import { fetchQuiz, NUMBER_OF_QUESTIONS } from "./quizFetcher.js"
import { Countdown } from "./countdown.js";

// Quiz state
let currentQuiz = null;
let currentQuestion = null;
let currentQuestionIndex = -1;
let canGuess = true;
let points = 0;

// countdown config
const questionCountdown = new Countdown(10); 
questionCountdown.onTick = time => {
    dom.quizQTime.innerText = time.toFixed(1) + "s"
    dom.quizTimeMeter.value = time
}
questionCountdown.onComplete = () => {
    dom.quizQTime.innerText = "TIMES UP!"
    canGuess = false;
    dom.quizNextBtn.classList.remove("hidden");
}

// Eftersom den här filen importeras innan "loadDomVars" anropas i main-filen
// Det här är kanske inte super genomtänkt, känns lite konstigt men det funkar
onDomVarsLoaded(()=>{ 
    dom.quizNextBtn.addEventListener("click", nextQuestion)

    dom.qrcTryAgain.addEventListener("click", async () => {
        const newQuiz = await fetchQuiz(currentQuiz.categoryId, currentQuiz.difficulty)
        startNewQuiz(newQuiz)
    })
})

// För att ställa om quiz staten
function resetQuiz() {
    showQuiz()
    currentQuestion = null;
    currentQuiz = null;
    currentQuestionIndex = -1;
    canGuess = true;
    points = 0;
    questionCountdown.clear();
    updateQuestionMeter()
}


function startNewQuiz(quiz) {
    resetQuiz()
    showQuiz()
    currentQuiz = quiz;
    window.location.hash = "#quiz"
    nextQuestion()
}

function nextQuestion() {
    currentQuestionIndex++;
    currentQuestion = currentQuiz.questions[currentQuestionIndex];
    questionCountdown.clear();
    questionCountdown.startFromBeginning();
    updateQuestionMeter()
    if (currentQuestionIndex > NUMBER_OF_QUESTIONS-1) {
        endQuiz()
    } else {
        canGuess = true;
        renderQuestion();
    }
}

function renderQuestion() {
    dom.answersEl.innerHTML = "";
    dom.quizQResult.innerHTML = "";
    dom.quizQResult.classList.remove("hidden");
    dom.quizNextBtn.classList.add("hidden");

    // question
    const q = currentQuestion;
    dom.questionH2.innerHTML = q.question;

    // answers
    q.answers.forEach(a => {
        const el = createAnswer(a)
        dom.answersEl.append(el)
    })
}

function createAnswer(answer) {
    const answerBtn = document.createElement("button")
    answerBtn.classList.add("answer")
    answerBtn.innerHTML = answer
    answerBtn.dataset.answer = answer
    answerBtn.addEventListener("click", handleAnswerBtn)
    return answerBtn
}

function handleAnswerBtn(e) {
    if (!canGuess) return;
    canGuess = false;
    const answer = e.target.dataset.answer;

    // determine correct
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) points++;
    e.target.classList.add(isCorrect ? "correct" : "incorrect")
    dom.quizQResult.setAttribute("class", isCorrect ? "correct" : "incorrect");
    dom.quizQResult.innerText = isCorrect ? "Korrekt!" : "Fel."

    // show correct
    if (!isCorrect) {
        const buttons = e.target.parentElement.querySelectorAll(":scope button");
        const correctButton = ([...buttons]).find(b => b.innerHTML === currentQuestion.correctAnswer);
        correctButton.style.outline = "5px solid green";
    }

    // show next button
    dom.quizNextBtn.classList.remove("hidden");

    // clear timer
    questionCountdown.clear()
    dom.quizQTime.innerText = ""
}

// båda visar quizen och gömmar quiz-resultatet
function showQuiz() {
    dom.quizSection.classList.remove("hidden")
    dom.quizResultSection.classList.add("hidden")
}

// båda visar resultatet och gömmar quizen
function showResult() {
    dom.quizResultPointsSpan.innerText = points
    dom.quizResultMessageP.innerText = getHighScoreMessage()
    dom.qrcCategory = quiz.category
    dom.qrcDifficulty = quiz.difficulty

    dom.quizResultSection.classList.remove("hidden")
    dom.quizSection.classList.add("hidden")
}

function endQuiz() {
    showResult()
    saveHighScore()
}

function getHighScore() {
    const scores = JSON.parse(localStorage.getItem("dugquiz")||"{}")
    return parseInt(scores[`${currentQuiz.category}/${currentQuiz.difficulty}`] || "0")
}

function forceSaveScore() {
    const category = currentQuiz.category.replaceAll("&amp;", "&")
    const scores = JSON.parse(localStorage.getItem("dugquiz")||"{}")
    scores[`${category}/${currentQuiz.difficulty}`] = points;
    localStorage.setItem("dugquiz", JSON.stringify(scores))
}

function getHighScoreMessage() {
    const currentHighScore = getHighScore()
    if (currentHighScore === points) {
        return `Det var samma som ditt högsta betyg!`
    } else if (currentHighScore > points) {
        return `Det var inte din bästa...`
    } else {
        return `Det var ett nytt högsta betyg!`
    }
}

function saveHighScore() {
    const currentHighScore = getHighScore()
    if (points > currentHighScore) forceSaveScore()
}

function updateQuestionMeter() {
    dom.quizProgressTextSpan.innerText = currentQuestionIndex+1
}

export {
    startNewQuiz
}