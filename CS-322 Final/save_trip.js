// pulls the user
const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

// if the user isn't logged in, it'll send them to log in page
if (!loggedInUser) {
    alert("Please log in to view your saved trips.");
    window.location.href = "log_in.html";
}

const upcomingTripsList = document.getElementById("upcomingTripsList");
const pastTripsList = document.getElementById("pastTripsList");
const upcomingTrips = [];
const pastTrips = [];

// gets trips that were added only by the user
const trips = JSON.parse(localStorage.getItem("trips")) || [];
const userTrips = trips.filter(trip => trip.userEmail === loggedInUser.email);

// this is for todays date
const today = new Date();
today.setHours(0, 0, 0, 0);

userTrips.forEach(trip => {
    const tripEndDate = new Date(trip.endDate);
    tripEndDate.setHours(0, 0, 0, 0);

    if (tripEndDate < today) {
        pastTrips.push(trip);
    } else {
        upcomingTrips.push(trip);
    }
});

// creates the trip card
function createTripCard(trip) {
    const card = document.createElement("div");
    card.classList.add("trip-card");
    const name = document.createElement("h3");
    name.textContent = trip.tripName;
    const cities = document.createElement("p");
    cities.innerHTML = `<strong>Cities:</strong> ${trip.cities.join(", ")}`;
    const dates = document.createElement("p");
    dates.innerHTML = `<strong>Dates:</strong> ${trip.startDate} to ${trip.endDate}`;
    const budget = document.createElement("p");
    budget.innerHTML = `<strong>Budget:</strong> ${trip.budget}`;

    card.appendChild(name);
    card.appendChild(cities);
    card.appendChild(dates);
    card.appendChild(budget);

    return card;
}

// puts trips that are done in the past trips and the upcoming ones in the upcoming trips
function renderTrips(tripArray, container, emptyMessage) {
    container.innerHTML = "";

    if (tripArray.length === 0) {
        const message = document.createElement("p");
        message.textContent = emptyMessage;
        container.appendChild(message);
        return;
    }

    tripArray.forEach(trip => {
        const tripCard = createTripCard(trip);
        container.appendChild(tripCard);
    });
}

// if the user didn't put anything that fits those sections
renderTrips(upcomingTrips, upcomingTripsList, "No upcoming trips saved yet.");
renderTrips(pastTrips, pastTripsList, "No past trips saved yet.");