import { fetchCategories } from "./quizFetcher.js";
import { dom } from "./dom.js";

async function renderHighScores() {
     const { categoryNames } = await fetchCategories()
    const scores = JSON.parse(localStorage.getItem(`dugquiz`)||"{}");

     (["easy", "medium", "hard"]).forEach(difficulty => {
        const tbody = dom[`${difficulty}TableBody`]
        tbody.innerHTML = ""
        categoryNames.forEach(category => {
            category = category.replaceAll("&amp;", "&")
            const tr = document.createElement('tr')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')

            td1.innerText = category
            const score = parseInt(scores[`${category}/${difficulty}`]||"0")
            td2.innerText = score + "/10"

            // if score 0, lower opacity
            if (score === 0) {
                tr.style.opacity = "0.3"
            } else if (score < 5) {
                tr.style.backgroundColor = "#ff000033"
            } else if (score < 7) {
                tr.style.backgroundColor = "#ff880033"
            } else if (score < 10) {
                tr.style.backgroundColor = "#ffff0033"
            } else {
                tr.style.backgroundColor = "#00ff0033"
            }

            tr.append(td1)
            tr.append(td2)
            tbody.append(tr)
        })
     })
}

export {
    renderHighScores
}