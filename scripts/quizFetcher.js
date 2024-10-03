const API_ROOT = "https://opentdb.com/api.php?amount=10&category={cat}&difficulty={diff}&type=multiple"

function shuffle(arr) {
    const shuffled = []
    for (let i = 0; i < arr.length; i++) {
        shuffled.push(arr[Math.floor(Math.random()*arr.length)])
    }
    return shuffled
}

async function fetchCategories() {
    const res = await fetch("https://opentdb.com/api_category.php")
    const data = await res.json()
    return {
        categories: data.trivia_categories,
        categoryNames: data.trivia_categories.map(c => c.name),
        categoryIds: data.trivia_categories.map(c => c.id)
    }
}

function createQuizURI(categoryId, difficulty) {
    return API_ROOT.replace("{cat}", categoryId).replace("{diff}",difficulty)
}

async function fetchQuiz(categoryId, difficulty) {
    const uri = createQuizURI(categoryId, difficulty)
    const res = await fetch(uri)
    if(!res.ok) throw null;
    const data = await res.json()
    if (data.response_code !== 0) throw null;
    const questions = data.results.map((r)=>{
        return {
            question: r.question,
            answers: shuffle([...r.incorrect_answers, r.correct_answer]).map(a => a),
            correctAnswer: r.correct_answer
        }
    })
    return questions;
}

export {
    fetchQuiz,
    fetchCategories
}