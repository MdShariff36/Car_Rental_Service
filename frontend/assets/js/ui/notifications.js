const Notifications = {
  show: (message, type = "info") => {
    const container =
      document.getElementById("notification-container") ||
      Notifications._createContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },
  _createContainer: () => {
    const div = document.createElement("div");
    div.id = "notification-container";
    document.body.appendChild(div);
    return div;
  },
};
