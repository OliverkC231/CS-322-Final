// for the budget slider (reference was ticketmaster's budget slider)
document.addEventListener("DOMContentLoaded", function (){

    const budgetSlider = document.getElementById("budgetSlider");
    const budgetValue = document.getElementById("budgetValue");

    noUiSlider.create(budgetSlider, {
        start: [2000, 8000],
        connect: true,
        range: {'min': 0,'max': 15000}
    });

    budgetSlider.noUiSlider.on('update', function (values) {
        budgetValue.textContent = `$${Math.round(values[0])} - $${Math.round(values[1])}`;
    });
});

// the array that holds all the cities the user selects
let selectedCities = [];

const cityInput = document.getElementById("cityVisting");
const suggestionsBox = document.getElementById("citySuggestions");
const selectedBox = document.getElementById("citiesSelected");

// this makes it so that the city is actually added when the user clicks it and doesn't allow for duplicates
function addCity(city) {
    if (selectedCities.includes(city)) return;

    selectedCities.push(city);
    renderSelectedCities();

    cityInput.value = "";
    suggestionsBox.innerHTML = "";
}

// this function is if the user wants to deselect a city
function removeCity(city) {
    selectedCities = selectedCities.filter(c => c !== city);
    renderSelectedCities();
}

// puts the array onto the screen
function renderSelectedCities() {

    selectedBox.innerHTML = "";

    selectedCities.forEach(city => {
        const tag = document.createElement("div");
        tag.classList.add("city-tag");

        const name = document.createElement("span");
        name.textContent = city;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.classList.add("remove-btn");

        removeBtn.addEventListener("click", function () {
            removeCity(city);
        });

        tag.appendChild(removeBtn);
        tag.appendChild(name);

        selectedBox.appendChild(tag);

        selectedBox.style.marginBottom = "20px";
    });
}

cityInput.addEventListener("input", async function () {

    const query = cityInput.value.trim();
    suggestionsBox.innerHTML = "";

    if (!query) return;

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`);
        const data = await response.json();

        if (!data.results) return;

        data.results.forEach(place => {

            const cityName = place.name;
            const country = place.country;

            // consistent format everywhere
            const fullName = country ? `${cityName}, ${country}`: cityName;
            const li = document.createElement("li");
            li.textContent = fullName;

            li.addEventListener("click", function () {
                addCity(fullName);
            });

            suggestionsBox.appendChild(li);
        });

    } catch (error) {
        console.error("City API error:", error);
    }

    const form = document.getElementById("addTripForm");

});

const form = document.getElementById("addTripForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tripName = document.getElementById("tripName").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const budget = document.getElementById("budgetValue").textContent;
    const typedCity = cityInput.value.trim();
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const trip = {
        userEmail: loggedInUser.email,
        tripName: tripName,
        cities: selectedCities,
        startDate: startDate,
        endDate: endDate,
        budget: budget
    };

    if (typedCity === "" && selectedCities.length === 0) {
        e.preventDefault();
        alert("Please type a city or select at least one city.");
        cityInput.focus();
        return;
    }

    if (typedCity !== "" && selectedCities.length === 0) {
        addCity(typedCity);
    }

    document.getElementById("previewTripName").textContent = tripName;
    document.getElementById("previewCities").textContent = selectedCities.join(", ");
    document.getElementById("previewDates").textContent = `${startDate} to ${endDate}`;
    document.getElementById("previewBudget").textContent = budget;
});

const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const preview = document.getElementById("dateRangePreview");

function updatePreview() {
    if (startInput.value && endInput.value) {
        preview.textContent = `${startInput.value} → ${endInput.value}`;
    }
}

startInput.addEventListener("change", updatePreview);
endInput.addEventListener("change", updatePreview);

startInput.addEventListener("change", () => {
    endInput.min = startInput.value;
});