const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser")
);

if (!loggedInUser) {
    alert("Please log in to view trip news.");
    window.location.href = "log_in.html";
}

const cityNewsList =
    document.getElementById("cityNewsList");

const trips =
    JSON.parse(localStorage.getItem("trips")) || [];

const userTrips = trips.filter(
    trip => trip.userEmail === loggedInUser.email
);

const today = new Date();

today.setHours(0, 0, 0, 0);

const upcomingTrips = userTrips.filter(trip => {

    const tripEndDate =
        new Date(trip.endDate);

    tripEndDate.setHours(0, 0, 0, 0);

    return tripEndDate >= today;
});

// unique cities
// limits to only 3 cities
const upcomingCities = [
    ...new Set(
        upcomingTrips.flatMap(
            trip => trip.cities
        )
    )
].slice(0, 3);

// your NewsAPI key
const NEWS_API_KEY = "adadf7fcb303437ab3cfa4a029864d6e";

// delay helper
function wait(ms) {
    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}

// gets news for city
async function getNewsForCity(city) {

    // removes country from city name
    const searchCity =
        city.split(",")[0].trim();

    // gets date from 1 month ago
    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(
        oneMonthAgo.getMonth() - 1
    );

    const formattedDate =
        oneMonthAgo
            .toISOString()
            .split("T")[0];

    const url =
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchCity)}&from=${formattedDate}&language=en&sortBy=publishedAt&pageSize=3&apiKey=${NEWS_API_KEY}`;

    try {

        const response =
            await fetch(url);

        const data =
            await response.json();

        console.log(
            "NewsAPI response:",
            data
        );

        if (data.status !== "ok") {

            console.error(
                "NewsAPI Error:",
                data.message
            );

            return [];
        }

        return data.articles || [];

    } catch (error) {

        console.error(
            `Error getting news for ${city}:`,
            error
        );

        return [];
    }
}

// creates article card
function createArticleCard(article) {

    const card =
        document.createElement("div");

    card.classList.add("news-card");

    // image
    if (article.urlToImage) {

        const image =
            document.createElement("img");

        image.src =
            article.urlToImage;

        image.alt =
            article.title;

        image.classList.add(
            "news-image"
        );

        card.appendChild(image);
    }

    // title
    const title =
        document.createElement("h3");

    title.textContent =
        article.title;

    // source
    const source =
        document.createElement("p");

    source.innerHTML =
        `<strong>Source:</strong> ${article.source.name}`;

    // published date
    const publishedDate =
        document.createElement("p");

    const date =
        new Date(article.publishedAt);

    publishedDate.innerHTML =
        `<strong>Published:</strong> ${date.toLocaleDateString()}`;

    // description
    const description =
        document.createElement("p");

    description.textContent =
        article.description ||
        "No description available.";

    // article link
    const link =
        document.createElement("a");

    link.href =
        article.url;

    link.textContent =
        "Read Full Article";

    link.target =
        "_blank";

    // add everything
    card.appendChild(title);

    card.appendChild(source);

    card.appendChild(publishedDate);

    card.appendChild(description);

    card.appendChild(link);

    return card;
}

// renders all city news
async function renderCityNews() {

    cityNewsList.innerHTML = "";

    if (upcomingCities.length === 0) {

        const message =
            document.createElement("p");

        message.textContent =
            "No upcoming trip cities found.";

        cityNewsList.appendChild(message);

        return;
    }

    // loops through cities
    for (const city of upcomingCities) {

        const citySection =
            document.createElement("section");

        citySection.classList.add(
            "city-news-section"
        );

        const heading =
            document.createElement("h2");

        heading.textContent =
            `News for ${city}`;

        citySection.appendChild(heading);

        // gets articles
        const articles =
            await getNewsForCity(city);

        // if no articles
        if (articles.length === 0) {

            const noNews =
                document.createElement("p");

            noNews.textContent =
                `No news found for ${city}.`;

            citySection.appendChild(noNews);

        } else {

            // adds article cards
            articles.forEach(article => {

                const articleCard =
                    createArticleCard(article);

                citySection.appendChild(
                    articleCard
                );
            });
        }

        cityNewsList.appendChild(
            citySection
        );

        // waits 1.5 seconds between requests
        await wait(1500);
    }
}

// starts app
renderCityNews();