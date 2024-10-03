import { loadRoutes, checkHash } from "./router.js";
import { fetchQuiz, fetchCategories } from "./quizFetcher.js";
import { startNewQuiz } from "./quiz.js";

// laddar routes
await loadRoutes();
checkHash();
window.addEventListener("hashchange", checkHash)

// laddar kategorierna
const {
    categories,
    categoryNames,
    categoryIds
} = await fetchCategories()

const quizCategorySelect = document.querySelector("#quiz-category-select")

// skapar kategori-option elementer
categories.forEach(cat => {
    const option = document.createElement("option")
    option.value = cat.id
    option.innerText = cat.name
    quizCategorySelect.append(option)
})

const startQuizForm = document.querySelector("#start-quiz-form")
startQuizForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const difficulty = startQuizForm.difficulty.value
    const categoryId = parseInt(startQuizForm.category.value)
    const quiz = await fetchQuiz(categoryId, difficulty)
    startNewQuiz(quiz)
})

