
document.addEventListener("DOMContentLoaded", () => {

    // Get the logged-in student's information
    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
    );

    const userId = currentUser.id || currentUser.email || "guest";
    const storageKey = `notifications_${userId}`;

    // Get saved notifications
    function getNotifications() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "[]");
        } catch (error) {
            console.error("Unable to load notifications:", error);
            return [];
        }
    }

    // Save notifications
    function saveNotifications(notifications) {
        localStorage.setItem(
            storageKey,
            JSON.stringify(notifications)
        );
    }

    // Add a notification (available on every page loading this script)
    window.addNotification = function(title, message) {

        const notifications = getNotifications();

        notifications.unshift({
            id: Date.now(),
            title: title,
            message: message,
            createdAt: new Date().toISOString(),
            read: false
        });

        saveNotifications(notifications);
        renderNotifications();
    };

    // Find notification dropdown elements
    const notificationsBtn = document.getElementById("notificationsBtn");
    const notificationsMenu = document.getElementById("notificationsMenu");
    const notificationBadge = document.getElementById("notificationBadge");
    const notificationsList = document.getElementById("notificationsList");
    const markAllReadBtn = document.getElementById("markAllReadBtn");

    // Display notifications if dropdown exists on this page
    function renderNotifications() {

        if (!notificationBadge || !notificationsList) return;

        const notifications = getNotifications();

        const unreadCount = notifications.filter(
            notification => !notification.read
        ).length;

        notificationBadge.textContent = unreadCount;
        notificationBadge.hidden = unreadCount === 0;

        notificationsList.innerHTML = "";

        if (notifications.length === 0) {
            notificationsList.textContent = "No notifications yet.";
            return;
        }

        notifications.forEach(notification => {

            const item = document.createElement("div");
            item.className = "notification-item";

            if (!notification.read) {
                item.classList.add("unread");
            }

            const content = document.createElement("div");
            content.className = "notification-content";

            const title = document.createElement("h4");
            title.textContent = notification.title;

            const message = document.createElement("p");
            message.textContent = notification.message;

            const time = document.createElement("small");
            time.textContent = new Date(
                notification.createdAt
            ).toLocaleString();

            content.append(title, message, time);
            item.appendChild(content);
            notificationsList.appendChild(item);
        });
    }

    // Open and close dropdown
    if (notificationsBtn && notificationsMenu) {

        notificationsBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            notificationsMenu.hidden = !notificationsMenu.hidden;

            notificationsBtn.setAttribute(
                "aria-expanded",
                String(!notificationsMenu.hidden)
            );
        });

        // Close when clicking outside
        document.addEventListener("click", (event) => {

            if (
                !notificationsMenu.contains(event.target) &&
                !notificationsBtn.contains(event.target)
            ) {
                notificationsMenu.hidden = true;
                notificationsBtn.setAttribute("aria-expanded", "false");
            }
        });

        // Close with Escape
        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                notificationsMenu.hidden = true;
                notificationsBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Mark all notifications as read
    if (markAllReadBtn) {

        markAllReadBtn.addEventListener("click", () => {

            const notifications = getNotifications();

            notifications.forEach(notification => {
                notification.read = true;
            });

            saveNotifications(notifications);
            renderNotifications();
        });
    }

    // Display saved notifications
    renderNotifications();

});
