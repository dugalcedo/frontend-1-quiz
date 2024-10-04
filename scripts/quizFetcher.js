export const NUMBER_OF_QUESTIONS = 10
const API_ROOT = `https://opentdb.com/api.php?amount=${NUMBER_OF_QUESTIONS}&category={cat}&difficulty={diff}&type=multiple`

function shuffle(arr) {
    const shuffled = []
    const len = arr.length
    for (let i = 0; i < len; i++) {
        const r = Math.floor(Math.random()*arr.length)
        shuffled.push(arr[r])
        arr.splice(r, 1)
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
    if(!res.ok) throw [categoryId, difficulty, res];
    const data = await res.json()
    console.log("data:", data)
    if (data.response_code !== 0) throw [categoryId, difficulty, res, data];
    const questions = data.results.map((r)=>{
        return {
            question: r.question,
            answers: shuffle([...r.incorrect_answers, r.correct_answer]).map(a => a),
            correctAnswer: r.correct_answer
        }
    })

    // fix the question that implies Red Hot Chilli Peppers is punk when they are actually garbage
    sanitizeRHCP(questions)

    return {
        questions,
        difficulty,
        categoryId,
        category: data.results[0].category,
    };
}

function sanitizeRHCP(questions) {
    questions.forEach(q => {
        if (q.question.includes("Californication") && q.question.includes("punk rock")) {
            q.answers.push("Red Hot Chili Peppers is not punk rock")
            q.correctAnswer = "Red Hot Chili Peppers is not punk rock"
        }
    })
}

export {
    fetchQuiz,
    fetchCategories
}