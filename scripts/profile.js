import { fetchCategories } from "./quizFetcher.js";
import { dom } from "./dom.js";

async function renderHighScores() {
     const { categoryNames } = await fetchCategories()
    const scores = JSON.parse(localStorage.getItem(`dugquiz`)||"{}");

     (["easy", "medium", "hard"]).forEach(difficulty => {
        const tbody = dom[`${difficulty}TableBody`]
        tbody.innerHTML = ""
        categoryNames.forEach(category => {
            const tr = document.createElement('tr')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')

            td1.innerText = category
            td2.innerText = parseInt(scores[`${category}/${difficulty}`]||"0") + "/10"

            tr.append(td1)
            tr.append(td2)
            tbody.append(tr)
        })
     })
}

export {
    renderHighScores
}