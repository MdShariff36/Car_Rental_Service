// ============================================================================
// FILE: assets/js/ui/notifications.js
// ============================================================================

/**
 * Toast Notification System
 * Display success, error, warning, and info messages
 */

const Notifications = {
  container: null,
  autoHideDuration: 4000,

  /**
   * Initialize notification container
   */
  init() {
    this.container = document.getElementById("notification-container");
    if (!this.container) {
      // Create container if it doesn't exist
      this.container = document.createElement("div");
      this.container.id = "notification-container";
      this.container.className = "notification-container";
      document.body.appendChild(this.container);
    }
  },

  /**
   * Show notification
   */
  show(message, type = "info", duration = null) {
    if (!this.container) this.init();

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    // Add icon based on type
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };

    notification.innerHTML = `
      <span class="notification-icon">${icons[type] || icons.info}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close">&times;</button>
    `;

    // Add to container
    this.container.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add("show"), 10);

    // Close button handler
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => this.hide(notification));

    // Auto hide
    const hideAfter = duration || this.autoHideDuration;
    setTimeout(() => this.hide(notification), hideAfter);
  },

  /**
   * Hide notification
   */
  hide(notification) {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  },

  /**
   * Show success notification
   */
  success(message, duration = null) {
    this.show(message, "success", duration);
  },

  /**
   * Show error notification
   */
  error(message, duration = null) {
    this.show(message, "error", duration);
  },

  /**
   * Show warning notification
   */
  warning(message, duration = null) {
    this.show(message, "warning", duration);
  },

  /**
   * Show info notification
   */
  info(message, duration = null) {
    this.show(message, "info", duration);
  },
};

export default Notifications;
