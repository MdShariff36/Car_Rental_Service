// FILE: assets/js/ui/notifications.js

export const showNotification = (message, type = "info", duration = 3000) => {
  const container = getOrCreateContainer();

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getIcon(type)}</span>
      <span class="notification-message">${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `;

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  const closeBtn = notification.querySelector(".notification-close");
  closeBtn?.addEventListener("click", () => {
    removeNotification(notification);
  });

  if (duration > 0) {
    setTimeout(() => {
      removeNotification(notification);
    }, duration);
  }

  return notification;
};

const getOrCreateContainer = () => {
  let container = document.querySelector("#notification-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  return container;
};

const removeNotification = (notification) => {
  notification.classList.remove("show");
  setTimeout(() => {
    notification.remove();
  }, 300);
};

const getIcon = (type) => {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  return icons[type] || icons.info;
};

export const showSuccess = (message, duration) => {
  return showNotification(message, "success", duration);
};

export const showError = (message, duration) => {
  return showNotification(message, "error", duration);
};

export const showWarning = (message, duration) => {
  return showNotification(message, "warning", duration);
};

export const showInfo = (message, duration) => {
  return showNotification(message, "info", duration);
};
