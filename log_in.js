const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // this checks if the password matches
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // either gets a user from the storage or its a empty array
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // checks if user has account already
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        alert("An account with this email already exists.");
        return;
    }

    // const that will make a new user
    const newUser = {
        name: name,
        email: email,
        password: password
    };

    // puts the new user into the array of users
    users.push(newUser);

    // saves updated array
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully! You can now log in.");

    signupForm.reset();
});

loginForm.addEventListener("submit", function (e) {
    // doesn't automatically refresh the page after the user presses the button
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // gets the user info from the array
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // sees if the user put in their info correctly
    const validUser = users.find(user => user.email === email && user.password === password);

    if (!validUser) {
        alert("Invalid email or password.");
        return;
    }

    sessionStorage.setItem("loggedInUser", JSON.stringify({
    name: validUser.name,
    email: validUser.email
    }));

sessionStorage.setItem("lastActivity", Date.now());

window.location.href = "home.html";

    // says that the user is logged in right now
    localStorage.setItem("loggedInUser", JSON.stringify(validUser));

    // brings user to home page
    window.location.href = "home.html";
});

// this will log the user out due to inactivity (code from stack overflow)

// Set timeout variables.
var timoutWarning = 540000; // Display warning in 9 Mins.
var timoutNow = 600000; // Timeout in 10 mins.
var logoutUrl = 'logout.php'; // URL to logout page.

var warningTimer;
var timeoutTimer;

// Start timers.
function StartTimers() {
    warningTimer = setTimeout("IdleWarning()", timoutWarning);
    timeoutTimer = setTimeout("IdleTimeout()", timoutNow);
}

// Reset timers.
function ResetTimers() {
    clearTimeout(warningTimer);
    clearTimeout(timeoutTimer);
    StartTimers();
    $("#timeout").dialog('close');
}

// Show idle timeout warning dialog.
function IdleWarning() {
    //$("#timeout").dialog({
    //modal: true
    alert("Warning! Your page will redirected to login page due to inactivity.");
//});
}

// Logout the user.
function IdleTimeout() {
    window.location = logoutUrl;
}
