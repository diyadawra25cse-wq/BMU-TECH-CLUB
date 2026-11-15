
/* =================================
   BMU TECH CLUB - AUTH NAVBAR
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const visitorNav = document.getElementById("visitorNav");
    const studentNav = document.getElementById("studentNav");
    const joinSection = document.querySelector(".join-section");

    const welcomeStudent = document.getElementById("welcomeStudent");
    const profileInitial = document.getElementById("profileInitial");

    const profileDropdownBtn = document.getElementById("profileDropdownBtn");
    const profileDropdownMenu = document.getElementById("profileDropdownMenu");

    const logoutBtn = document.getElementById("logoutBtn");


    // Display the correct navbar.
    
async function updateNavbar() {

    const token = localStorage.getItem("authToken");

    // Default: Show visitor navbar
visitorNav.hidden = false;
studentNav.hidden = true;

// Show Join section for visitors
if (joinSection) {
    joinSection.style.display = "";
}
    
    

    // No token means the user is a visitor
    if (!token) {
        return;
    }

    try {

        // Verify the stored token with the backend
        const response = await fetch(`${window.API_BASE_URL || "http://localhost:5000"}/api/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        // Token is invalid or expired
        if (response.status === 401) {

            localStorage.removeItem("authToken");
            localStorage.removeItem("currentUser");

            return;
        }

        // Handle other server errors
        if (!response.ok) {
            throw new Error("Unable to verify login session.");
        }

        const result = await response.json();

        if (!result.success || !result.data || !result.data.fullName) {
            throw new Error("Invalid student information.");
        }

        // Update stored student information
        localStorage.setItem(
            "currentUser",
            JSON.stringify(result.data)
        );

        // Show student navbar
        if (visitorNav) visitorNav.hidden = true;
        if (studentNav) studentNav.hidden = false;
        // Hide Join section for logged-in students
if (joinSection) {
    joinSection.style.display = "none";
}

        welcomeStudent.textContent = "Hi, " + result.data.fullName;

        profileInitial.textContent =
            result.data.fullName.trim().charAt(0).toUpperCase();

    } catch (error) {

        console.error("Session verification error:", error);

        // Keep the saved token if the server is temporarily unavailable.
        // But do not display the authenticated navbar without verification.

        if (visitorNav) visitorNav.hidden = false;
        if (studentNav) studentNav.hidden = true;
        

    }
}



    // Open and close the profile dropdown.
    if (profileDropdownBtn && profileDropdownMenu) profileDropdownBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        const isOpen = !profileDropdownMenu.hidden;

        profileDropdownMenu.hidden = isOpen;

        profileDropdownBtn.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

    });


    // Close dropdown when clicking elsewhere.
    document.addEventListener("click", function (event) {

        if (profileDropdownMenu && profileDropdownBtn &&
            !profileDropdownMenu.contains(event.target) &&
            !profileDropdownBtn.contains(event.target)
        ) {

            profileDropdownMenu.hidden = true;

            profileDropdownBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });


    // Logout.
    if (logoutBtn) logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");

        window.location.href = "index.html";

    });


    // Update navbar when homepage loads.
    updateNavbar();

});
