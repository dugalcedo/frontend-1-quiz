// Den här modulen innehåller variabler och funkioner för att underlätta "client-side routing"

// Definierar routes, deras HTML filer i "routes" mappen och förknippade URL-hashar 
const routes = [
    {
        container: document.querySelector("#start-page"),
        file: "./routes/home.html",
        name: "home",
        hash: "#",
    },
    {
        container: document.querySelector("#quiz-page"),
        file: "./routes/quiz.html",
        hash: "#quiz",
        name: "quiz"
    },
    {
        container: document.querySelector("#profile-page"),
        file: "./routes/profile.html",
        hash: "#profile",
        name: "profile"
    }
]

// Så att jag kan lätt gömma alla containerna i hideAllRoutes()
const containers = routes.map(r => r.container);
// Container för när ett fetch fel uppstår
const notFoundContainer = document.querySelector("#not-found")

function hideAllRoutes() {
    hideNotFoundFoute()
    containers.forEach(c => c.classList.add("hidden"));
}

function hideNotFoundFoute() {
    notFoundContainer.classList.add("hidden")
}

function showNotFoundRoute() {
    hideAllRoutes()
    notFoundContainer.classList.remove("hidden")
}

// Kan ta in en hash (string) och den förknippade containern visas, utan de inte hittas, då visas not-found containern
function showRoute(hash) {
    hideAllRoutes()
    const route = routes.find(r => r.hash === hash);
    if (!route) return showNotFoundRoute();
    route.container.classList.remove("hidden");
}

// Ska körs så snart DOM:en laddades; det fetchar HTML:en för alla routes
async function loadRoutes() {
    for (const { container, file } of routes) {
        const res = await fetch(file)
        const html = !res.ok ? (`<h1>Page not found</h1>`):(await res.text()) 
        container.innerHTML = html
    }
}

// Ska körs direkt efter loadRoutes, samt när en hashchange händelse hörs
function checkHash() {
    hideAllRoutes()
    const hash = window.location.hash || "#";
    console.log(hash)
    const route = routes.find(r => r.hash === hash);
    if (!route) return showNotFoundRoute();
    showRoute(hash);
}

export {
    loadRoutes,
    checkHash
}