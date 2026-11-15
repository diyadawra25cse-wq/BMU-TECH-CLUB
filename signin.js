const API_BASE = window.API_BASE_URL || "http://localhost:5000";
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
signinForm.addEventListener("submit", async function (event) {
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

    try {
        // Send login details to the backend.
        const response = await fetch(
            `${API_BASE}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const result = await response.json();

        // Handle incorrect credentials or other errors.
        if (!response.ok) {
            showSigninMessage(
                result.message || "Login failed. Please try again.",
                "error"
            );
            return;
        }

        // Save the JWT token for future authenticated requests.
        localStorage.setItem("authToken", result.token);

        // Save basic user information (never save the password).
        localStorage.setItem(
            "currentUser",
            JSON.stringify(result.data)
        );

        showSigninMessage(
            "Sign-in successful! Welcome back.",
            "info"
        );

        // Clear the password field.
        signinPassword.value = "";
        // Redirect to homepage after successful login.
        window.location.href = "index.html"; 

    } catch (error) {
        showSigninMessage(
            "Unable to connect to the server. Please try again.",
            "error"
        );

        console.error("Sign-in failed:", error);
    }
});