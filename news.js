const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    alert("Please log in to view trip news.");
    window.location.href = "log_in.html";
}

const cityNewsList = document.getElementById("cityNewsList");

const trips = JSON.parse(localStorage.getItem("trips")) || [];
const userTrips = trips.filter(trip => trip.userEmail === loggedInUser.email);

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingTrips = userTrips.filter(trip => {
    const tripEndDate = new Date(trip.endDate);
    tripEndDate.setHours(0, 0, 0, 0);
    return tripEndDate >= today;
});

const upcomingCities = [...new Set(upcomingTrips.flatMap(trip => trip.cities))];

const NEWS_API_KEY = "adadf7fcb303437ab3cfa4a029864d6e";

async function getNewsForCity(city) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(city)}&language=en&sortBy=publishedAt&pageSize=3&apiKey=${NEWS_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "ok") {
            console.error(data);
            return [];
        }

        return data.articles;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function createArticleCard(article) {
    const card = document.createElement("div");
    card.classList.add("news-card");

    if (article.urlToImage) {
        const image = document.createElement("img");
        image.src = article.urlToImage;
        image.alt = article.title || "Article image";
        image.classList.add("news-image");
        card.appendChild(image);
    }

    const title = document.createElement("h3");
    title.textContent = article.title;

    const source = document.createElement("p");
    source.textContent = `Source: ${article.source.name}`;

    const description = document.createElement("p");
    description.textContent = article.description || "No description available.";

    const link = document.createElement("a");
    link.href = article.url;
    link.textContent = "Read article";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    card.appendChild(title);
    card.appendChild(source);
    card.appendChild(description);
    card.appendChild(link);

    return card;
}

async function renderCityNews() {
    cityNewsList.innerHTML = "";

    if (upcomingCities.length === 0) {
        cityNewsList.textContent = "No upcoming trip cities found.";
        return;
    }

    for (const city of upcomingCities) {
        const section = document.createElement("section");

        const heading = document.createElement("h2");
        heading.textContent = `News for ${city}`;
        section.appendChild(heading);

        const articles = await getNewsForCity(city);

        if (articles.length === 0) {
            const message = document.createElement("p");
            message.textContent = `No articles found for ${city}.`;
            section.appendChild(message);
        } else {
            articles.forEach(article => {
                section.appendChild(createArticleCard(article));
            });
        }

        cityNewsList.appendChild(section);
    }
}

renderCityNews();