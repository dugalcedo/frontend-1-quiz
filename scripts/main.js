import { loadRoutes, checkHash } from "./router.js";
import { fetchQuiz, fetchCategories } from "./quizFetcher.js";
import { startNewQuiz } from "./quiz.js";
import { loadDomVars, dom } from "./dom.js";
import { renderHighScores } from "./profile.js";


// laddar routes
await loadRoutes();
checkHash();
window.addEventListener("hashchange", () => {
    checkHash()
    switch(window.location.hash) {
        case "#profile": {
            renderHighScores()
            break
        }
    }

})

// om användaren refreshade på quiz sidan
if (window.location.hash === "#quiz") window.location.hash = "#";

// laddar DOM variabler
loadDomVars()

// laddar kategorierna
const {
    categories,
    categoryNames,
    categoryIds
} = await fetchCategories()

// skapar kategori-option elementer
categories.forEach(cat => {
    const option = document.createElement("option")
    option.value = cat.id
    option.innerText = cat.name
    dom.quizCategorySelect.append(option)
})

// handle start quiz
dom.startQuizForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const difficulty = dom.startQuizForm.difficulty.value
    const categoryId = parseInt(dom.startQuizForm.category.value)
    const quiz = await fetchQuiz(categoryId, difficulty)
    startNewQuiz(quiz)
})

// laddar highscores
await renderHighScores()