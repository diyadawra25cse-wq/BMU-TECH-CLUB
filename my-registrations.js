
document.addEventListener("DOMContentLoaded", async function () {

    const message = document.getElementById("registrationsMessage");
    const container = document.getElementById("registrationsContainer");

    // Get the login token
    const token = localStorage.getItem("authToken");

    // Check whether the student is logged in
    if (!token) {
        message.textContent = "Please sign in to view your registrations.";
        return;
    }

    try {

        message.textContent = "Loading your registrations...";

        // Fetch registrations from the backend
        const response = await fetch(
            `${window.API_BASE_URL || "https://bmu-tech-club-backend.onrender.com"}/api/registrations/my`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const result = await response.json();

        // Handle unauthorized access
        if (response.status === 401) {
            message.textContent = "Your session has expired. Please sign in again.";
            return;
        }

        // Handle other errors
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to load registrations.");
        }

        const registrations = result.data;

        // Check if the student has any registrations
        if (!registrations || registrations.length === 0) {
            message.textContent = "You haven't registered for any events yet.";
            return;
        }

        // Clear the loading message
        message.textContent = "";

        // Display each registration
        registrations.forEach(function (registration) {

            const card = document.createElement("div");
            card.className = "registration-card";

            const eventName = document.createElement("h2");
            eventName.textContent = registration.eventName || "Event";

            const status = document.createElement("p");
            status.textContent = "Registered";
status.className = "registration-status";

            const name = document.createElement("p");
            name.textContent = "Name: " + (registration.fullName || "N/A");

            const enrollment = document.createElement("p");
            enrollment.textContent = "Enrollment Number: " +
                (registration.enrollmentNumber || "N/A");

            const email = document.createElement("p");
            email.textContent = "Email: " + (registration.email || "N/A");

            const course = document.createElement("p");
            course.textContent = "Course: " + (registration.course || "N/A");

            const date = document.createElement("p");

            date.textContent = "Registration Date: " +
                (registration.createdAt
                    ? new Date(registration.createdAt).toLocaleDateString()
                    : "N/A");

            card.appendChild(eventName);
            card.appendChild(status);
            card.appendChild(name);
            card.appendChild(enrollment);
            card.appendChild(email);
            card.appendChild(course);
            card.appendChild(date);

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Registration loading error:", error);

        message.textContent =
            "Something went wrong while loading your registrations. Please try again later.";

    }

});
