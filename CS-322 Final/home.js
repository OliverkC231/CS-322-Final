const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

const upcomingContainer = document.getElementById("homeUpcomingTrips");
const pastContainer = document.getElementById("homePastTrips");

function createHomeTripCard(trip) {
    const card = document.createElement("div");
    card.classList.add("home-trip-card");

    const tripName = document.createElement("h4");
    tripName.textContent = trip.tripName;

    const dates = document.createElement("p");
    dates.textContent = `${trip.startDate} to ${trip.endDate}`;

    card.appendChild(tripName);
    card.appendChild(dates);

    return card;
}

function showEmptyMessage(container, message) {
    const emptyMessage = document.createElement("p");
    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = message;
    container.appendChild(emptyMessage);
}

if (!loggedInUser) {
    showEmptyMessage(upcomingContainer, "Log in to see your trips.");
    showEmptyMessage(pastContainer, "Log in to see your trips.");
} else {
    const trips = JSON.parse(localStorage.getItem("trips")) || [];
    const userTrips = trips.filter(trip => trip.userEmail === loggedInUser.email);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingTrips = [];
    const pastTrips = [];

    userTrips.forEach(trip => {
        const tripEndDate = new Date(trip.endDate);
        tripEndDate.setHours(0, 0, 0, 0);

        if (tripEndDate < today) {
            pastTrips.push(trip);
        } else {
            upcomingTrips.push(trip);
        }
    });

    if (upcomingTrips.length === 0) {
        showEmptyMessage(upcomingContainer, "No upcoming trips yet.");
    } else {
        upcomingTrips.slice(0, 3).forEach(trip => {
            upcomingContainer.appendChild(createHomeTripCard(trip));
        });
    }

    if (pastTrips.length === 0) {
        showEmptyMessage(pastContainer, "No past trips yet.");
    } else {
        pastTrips.slice(0, 3).forEach(trip => {
            pastContainer.appendChild(createHomeTripCard(trip));
        });
    }
}