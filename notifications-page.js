
document.addEventListener("DOMContentLoaded", () => {

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
    );

    const userId = currentUser.id || currentUser.email;

    const list = document.getElementById("allNotificationsList");
    const markAllBtn = document.getElementById("markAllPageReadBtn");

    if (!list || !markAllBtn) {
        console.error("Notification page elements not found.");
        return;
    }

    if (!userId) {
        list.textContent = "Please sign in to view your notifications.";
        markAllBtn.disabled = true;
        return;
    }

    const storageKey = `notifications_${userId}`;

    function getNotifications() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "[]");
        } catch (error) {
            console.error("Error reading notifications:", error);
            return [];
        }
    }

    function renderNotifications() {

        const notifications = getNotifications();

        list.innerHTML = "";

     if (notifications.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "You have no notifications yet.";
    emptyMessage.className = "no-notifications-message";
    list.appendChild(emptyMessage);
    return;
}

        notifications.forEach(notification => {

            const card = document.createElement("div");

            card.className = notification.read
                ? "notification-page-card read"
                : "notification-page-card unread";

            const title = document.createElement("h3");
            title.textContent = notification.title;

            const message = document.createElement("p");
            message.textContent = notification.message;

            const status = document.createElement("p");
            status.textContent = notification.read
                ? "Status: Read"
                : "Status: Unread";

            card.append(title, message, status);
            list.appendChild(card);
        });
    }

    markAllBtn.addEventListener("click", () => {

        const notifications = getNotifications();

        notifications.forEach(notification => {
            notification.read = true;
        });

        localStorage.setItem(
            storageKey,
            JSON.stringify(notifications)
        );

        renderNotifications();
    });

    renderNotifications();

});
