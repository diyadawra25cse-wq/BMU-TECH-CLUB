console.log("BMU Tech Club JavaScript is connected!");

const KEY = "registrations";


function showMessage(text, type) {
    const message = document.getElementById("formMessage");

    if (!message) {
        return;
    }

    message.textContent = text;
    message.classList.remove("error", "success");
    message.classList.add(type);
}


function openSuccessPopup() {
    const popup = document.getElementById("registrationSuccessPopup");

    if (!popup) {
        return;
    }

    const tickWrap = popup.querySelector(".success-tick-wrap");
    const tickSvg = popup.querySelector(".success-tick-svg");

    // Restart the tick animation.
    if (tickWrap) {
        tickWrap.style.animation = "none";
    }

    if (tickSvg) {
        tickSvg.style.animation = "none";
    }

    popup.hidden = false;
    document.body.classList.add("success-popup-open");
    popup.classList.remove("is-visible");

    requestAnimationFrame(function () {
        // Restart CSS animations.
        void popup.offsetWidth;

        if (tickWrap) {
            tickWrap.style.animation = "";
        }

        if (tickSvg) {
            tickSvg.style.animation = "";
        }

        popup.classList.add("is-visible");

        const closeButton = popup.querySelector(".success-popup-close");

        if (closeButton) {
            closeButton.focus();
        }
    });
}

function closeSuccessPopup() {
    const popup = document.getElementById("registrationSuccessPopup");

    if (!popup) {
        return;
    }

    popup.classList.remove("is-visible");
    document.body.classList.remove("success-popup-open");

    setTimeout(function () {
        popup.hidden = true;
    }, 300);
}

// Connect the popup buttons.
const successPopup = document.getElementById("registrationSuccessPopup");

if (successPopup) {
    const closeButton = successPopup.querySelector(".success-popup-close");
    const continueButton = successPopup.querySelector(".success-popup-continue");

    if (closeButton) {
        closeButton.addEventListener("click", closeSuccessPopup);
    }

    if (continueButton) {
        continueButton.addEventListener("click", closeSuccessPopup);
    }

    // Close the popup when clicking outside its card.
    successPopup.addEventListener("click", function (event) {
        if (event.target === successPopup) {
            closeSuccessPopup();
        }
    });

    // Close the popup with the Escape key.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !successPopup.hidden) {
            closeSuccessPopup();
        }
    });
}


function getRegistrations() {
    const data = localStorage.getItem(KEY);

    if (data === null) {
        return [];
    }

    const registrations = JSON.parse(data);

    if (!Array.isArray(registrations)) {
        throw new Error("Stored registration data is invalid.");
    }

    return registrations;
}

function saveRegistration(registration) {
    const registrations = getRegistrations();

    registrations.push(registration);

    localStorage.setItem(KEY, JSON.stringify(registrations));
}


// Download all registrations as a JSON file
function downloadRegistrations() {
    const registrations = getRegistrations();

    const data = JSON.stringify(registrations, null, 4);

    const blob = new Blob([data], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "registrations.json";

    link.click();

    URL.revokeObjectURL(url);
}


const form = document.getElementById("registrationForm");

if (form) {
    const message = document.getElementById("formMessage");

    // We will handle validation using JavaScript.
    form.noValidate = true;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Read the values entered in the form.
        // Read the values entered in the form.
const fullName = document.getElementById("fullName").value.trim();
const email = document.getElementById("email").value.trim();
const studentId = document.getElementById("enrollmentNumber").value.trim();
const phoneNumber = document.getElementById("phoneNumber").value.trim();
const department = document.getElementById("course").value;
const year = document.getElementById("year").value;
const interest = document.getElementById("interest").value;
const password = document.getElementById("password").value;

        // Validate the form fields.
        if (!fullName || !email || !studentId || !phoneNumber ||
    !department || !year || !interest || !password) {
            showMessage("Please fill in all required fields.", "error");
            return;
        }

        
let hasNumber = false;

for (let i = 0; i < fullName.length; i++) {
    if (fullName[i] >= '0' && fullName[i] <= '9') {
        hasNumber = true;
        break;
    }
}

if (hasNumber) {
    showMessage("Please enter a valid name.", "error");
    return;
}



let hasInvalidCharacter = false;

for (let i = 0; i < fullName.length; i++) {
    let ch = fullName[i];

    if (!(ch >= 'A' && ch <= 'Z') &&
        !(ch >= 'a' && ch <= 'z') &&
        ch !== ' ' && ch !== '-') {
        hasInvalidCharacter = true;
        break;
    }
}

if (hasInvalidCharacter) {
    showMessage("Please enter a valid name", "error");
    return;
}


        // Basic email format validation.
        
let atPosition = email.indexOf('@');
let dotPosition = email.lastIndexOf('.');

if (atPosition < 1 ||
    dotPosition < atPosition + 2 ||
    dotPosition === email.length - 1) {

    showMessage("Please enter a valid email address.", "error");
    return;
}




        // Create an object containing the registration details.
        const registration = {
    fullName: fullName,
    email: email,
    password: password,
    studentId: studentId,
    phoneNumber: phoneNumber,
    department: department,
    year: year,
    interest: interest,
    submittedAt: new Date().toISOString()
};

        // Save the registration using your existing function.
        
try {
    // Check whether this student has already registered
    const registrations = getRegistrations();

    const alreadyRegistered = registrations.some(function (item) {
        return item.studentId &&
            item.studentId.toLowerCase() === studentId.toLowerCase();
    });

    if (alreadyRegistered) {
        showMessage("This enrollment number is already registered.", "error");
        return;
    }

    // Save only if this is a new registration
    saveRegistration(registration);

    showMessage("Registration successful!", "success");
    form.reset();
    openSuccessPopup();

} catch (error) {
    showMessage("Registration could not be saved. Please try again.", "error");
    console.error("Registration saving failed:", error);
}


});
}


/* ===== EVENT REGISTRATION FORMS ===== */

const eventForms = document.querySelectorAll("[data-event-form]");

eventForms.forEach(function (eventForm) {
    eventForm.noValidate = true;

    eventForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const eventName = eventForm.dataset.eventForm;

        // Find the correct message element for this event.
        let messageId;

        if (eventName === "coding-challenge") {
            messageId = "codingFormMessage";
        } else if (eventName === "ai-future-talk") {
            messageId = "aiTalkFormMessage";
        } else if (eventName === "web-development-workshop") {
            messageId = "webDevFormMessage";
        }

        const message = document.getElementById(messageId);

        function showEventMessage(text, type) {
            if (!message) return;

            message.textContent = text;
            message.classList.remove("error", "success");
            message.classList.add(type);
        }

        // Read the entered details.
        const fullName = eventForm.querySelector(
            '[name="fullName"]'
        ).value.trim();

        const studentId = eventForm.querySelector(
            '[name="enrollmentNumber"]'
        ).value.trim();

        const email = eventForm.querySelector(
            '[name="email"]'
        ).value.trim();

        const phoneNumber = eventForm.querySelector(
            '[name="phoneNumber"]'
        ).value.trim();

        const course = eventForm.querySelector(
            '[name="course"]'
        ).value;

        // Check required fields.
        if (
            !fullName ||
            !studentId ||
            !email ||
            !phoneNumber ||
            !course
        ) {
            showEventMessage(
                "Please fill in all required fields.",
                "error"
            );
            return;
        }

        // Validate the name.
        if (!/^[A-Za-z -]+$/.test(fullName)) {
            showEventMessage(
                "Please enter a valid name using letters, spaces or hyphens.",
                "error"
            );
            return;
        }

        // Validate the email.
        const atPosition = email.indexOf("@");
        const dotPosition = email.lastIndexOf(".");

        if (
            atPosition < 1 ||
            dotPosition < atPosition + 2 ||
            dotPosition === email.length - 1
        ) {
            showEventMessage(
                "Please enter a valid email address.",
                "error"
            );
            return;
        }

        // Collect selected AI interests, if applicable.
        const selectedInterests = Array.from(
            eventForm.querySelectorAll(
                'input[name="aiInterests"]:checked'
            )
        ).map(function (checkbox) {
            return checkbox.value;
        });

        // Prepare the registration record.
        const registration = {
            eventName: eventName,
            fullName: fullName,
            studentId: studentId,
            email: email,
            phoneNumber: phoneNumber,
            department: course,
            submittedAt: new Date().toISOString()
        };

        if (eventName === "ai-future-talk") {
            registration.aiInterests = selectedInterests;
        }

        try {
            // Read the registrations already saved.
            const registrations = getRegistrations();

            // Prevent duplicate registration for this event.
            const alreadyRegistered = registrations.some(
                function (item) {
                    return (
                        item.eventName === eventName &&
                        item.studentId &&
                        item.studentId.toLowerCase() ===
                            studentId.toLowerCase()
                    );
                }
            );

            if (alreadyRegistered) {
                showEventMessage(
                    "This enrollment number is already registered for this event.",
                    "error"
                );
                return;
            }

            // Save the new registration.
            saveRegistration(registration);

            // Update the popup message before opening it.
            const popupMessage = document.getElementById(
                "successPopupMessage"
            );

            if (popupMessage) {
                popupMessage.textContent =
                    "Your registration for this event has been submitted successfully!";
            }

            showEventMessage(
                "Registration successful!",
                "success"
            );

            eventForm.reset();

            // Open the existing animated success popup.
            openSuccessPopup();

        } catch (error) {
            showEventMessage(
                "Registration could not be saved. Please try again.",
                "error"
            );

            console.error(
                "Event registration saving failed:",
                error
            );
        }
    });
});
