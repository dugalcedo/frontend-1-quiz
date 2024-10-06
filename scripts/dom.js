const domVarHooks = [];

const dom = {}

const elements = {
    // home
    quizCategorySelect: "#quiz-category-select",
    startQuizForm: "#start-quiz-form",

    // quiz
    quizSection: "#quiz",
    answersEl: "#answers",
    questionH2: "#question h2",
    quizNextBtn: "#quiz-next-btn",
    quizQTime: "#quiz-q-time span",
    quizQResult: "#quiz-q-result",
    quizResultSection: "#quiz-result",
    quizResultMessageP: "#quiz-result-message",
    quizResultPointsSpan: "#quiz-result-points",
    qrcCategory: "#qrc-category",
    qrcDifficulty: "#qrc-difficulty",
    qrcTryAgain: "#qrc-try-again",
    quizProgressTextSpan: "#quiz-progress span",
    quizTimeMeter: "#quiz-time-meter meter",

    // profile
    easyTableBody: "#easy tbody",
    mediumTableBody: "#medium tbody",
    hardTableBody: "#hard tbody",
}

function loadDomVars() {
    Object.entries(elements).forEach(([key, selector]) => {
        dom[key] = document.querySelector(selector)
    })
    domVarHooks.forEach(hook => {
        hook()
    })
}

function onDomVarsLoaded(cb) {
    domVarHooks.push(()=>{
        cb(dom)
    })
}

export { loadDomVars, dom, onDomVarsLoaded }