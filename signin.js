
const signinForm = document.getElementById("signinForm");
const signinEmail = document.getElementById("signinEmail");
const signinPassword = document.getElementById("signinPassword");
const signinMessage = document.getElementById("signinMessage");

// Display a message below the form.
function showSigninMessage(text, type) {
    signinMessage.textContent = text;
    signinMessage.className = "signin-message is-visible";

    if (type === "error") {
        signinMessage.classList.add("is-error");
    } else {
        signinMessage.classList.add("is-info");
    }
}

// Handle form submission.
signinForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = signinEmail.value.trim().toLowerCase();
    const password = signinPassword.value;

    // Check that both fields have been filled.
    if (!email || !password) {
        showSigninMessage(
            "Please enter your email address and password.",
            "error"
        );
        return;
    }

    // Basic email format validation.
    if (
        !email.includes("@") ||
        !email.includes(".") ||
        email.startsWith("@") ||
        email.endsWith(".")
    ) {
        showSigninMessage(
            "Please enter a valid email address.",
            "error"
        );
        return;
    }

    // Read saved accounts from the browser.
    let users;

    try {
        users = JSON.parse(localStorage.getItem("registrations")) || [];
    } catch (error) {
        showSigninMessage(
            "Unable to read saved account information.",
            "error"
        );
        return;
    }

    // Find an account matching the entered email.
    
const user = users.find(function (account) {
    return (
        account.email &&
        account.email.toLowerCase() === email &&
        account.password === password
    );
});

if (!user) {
    const emailExists = users.some(function (account) {
        return (
            account.email &&
            account.email.toLowerCase() === email
        );
    });

    if (emailExists) {
        showSigninMessage(
            "Incorrect password. Please try again.",
            "error"
        );
    } else {
        showSigninMessage(
            "No account found with this email. Please join the club first.",
            "error"
        );
    }

    return;
}

showSigninMessage(
    "Sign-in successful! Welcome back.",
    "info"
);

    // Successful sign-in.
    showSigninMessage(
        "Sign-in successful! Welcome back.",
        "info"
    );

    // Add your destination page here when needed.
});
