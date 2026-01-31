/**
 * Notifications Utility
 * Toast notification system using existing markup
 *
 * Existing HTML Markup:
 * <div id="notification-container" class="notification-container"></div>
 *
 * Selectors Used:
 * - #notification-container: Container for toast notifications
 *
 * Dynamic Elements Created:
 * - .notification: Individual notification toast
 * - .notification-icon: Icon for notification type
 * - .notification-content: Content wrapper
 * - .notification-title: Notification title
 * - .notification-message: Notification message
 * - .notification-close: Close button
 */

class Notifications {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.defaultDuration = 5000; // 5 seconds
    this.maxNotifications = 5;
    this.init();
  }

  /**
   * Initialize notifications by finding existing container
   */
  init() {
    this.container = document.getElementById("notification-container");
    if (!this.container) {
      console.warn(
        "Notifications: #notification-container not found in DOM. Notifications will fail safely.",
      );
    }
  }

  /**
   * Show a notification
   * @param {Object} options - Notification options
   * @param {string} options.type - Type: 'success', 'error', 'warning', 'info'
   * @param {string} options.title - Notification title
   * @param {string} options.message - Notification message
   * @param {number} options.duration - Duration in ms (0 = permanent)
   * @param {boolean} options.closable - Show close button
   * @returns {HTMLElement|null} The notification element or null if container not found
   */
  show(options = {}) {
    if (!this.container) {
      console.warn(
        "Notifications: Cannot show notification - container not found",
      );
      return null;
    }

    const {
      type = "info",
      title = "",
      message = "",
      duration = this.defaultDuration,
      closable = true,
    } = options;

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");

    // Build notification HTML
    const iconMap = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };

    notification.innerHTML = `
      <div class="notification-icon">${iconMap[type] || iconMap.info}</div>
      <div class="notification-content">
        ${title ? `<div class="notification-title">${title}</div>` : ""}
        ${message ? `<div class="notification-message">${message}</div>` : ""}
      </div>
      ${closable ? '<button class="notification-close" aria-label="Close notification">&times;</button>' : ""}
    `;

    // Add to container
    this.container.appendChild(notification);

    // Track notification
    this.notifications.push(notification);

    // Limit number of notifications
    if (this.notifications.length > this.maxNotifications) {
      const oldest = this.notifications.shift();
      this.remove(oldest);
    }

    // Setup close button
    if (closable) {
      const closeBtn = notification.querySelector(".notification-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.remove(notification));
      }
    }

    // Animate in
    setTimeout(() => {
      notification.classList.add("notification-show");
    }, 10);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    return notification;
  }

  /**
   * Show success notification
   * @param {string} message - Success message
   * @param {string} title - Optional title
   * @param {number} duration - Duration in ms
   */
  success(message, title = "Success", duration = this.defaultDuration) {
    return this.show({ type: "success", title, message, duration });
  }

  /**
   * Show error notification
   * @param {string} message - Error message
   * @param {string} title - Optional title
   * @param {number} duration - Duration in ms
   */
  error(message, title = "Error", duration = this.defaultDuration) {
    return this.show({ type: "error", title, message, duration });
  }

  /**
   * Show warning notification
   * @param {string} message - Warning message
   * @param {string} title - Optional title
   * @param {number} duration - Duration in ms
   */
  warning(message, title = "Warning", duration = this.defaultDuration) {
    return this.show({ type: "warning", title, message, duration });
  }

  /**
   * Show info notification
   * @param {string} message - Info message
   * @param {string} title - Optional title
   * @param {number} duration - Duration in ms
   */
  info(message, title = "Info", duration = this.defaultDuration) {
    return this.show({ type: "info", title, message, duration });
  }

  /**
   * Remove a notification
   * @param {HTMLElement} notification - Notification element to remove
   */
  remove(notification) {
    if (!notification || !notification.parentElement) return;

    // Animate out
    notification.classList.remove("notification-show");
    notification.classList.add("notification-hide");

    // Remove from DOM after animation
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }

      // Remove from tracking array
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 300); // Match animation duration
  }

  /**
   * Remove all notifications
   */
  clearAll() {
    const notificationsCopy = [...this.notifications];
    notificationsCopy.forEach((notification) => {
      this.remove(notification);
    });
  }

  /**
   * Set default duration for notifications
   * @param {number} duration - Duration in milliseconds
   */
  setDefaultDuration(duration) {
    this.defaultDuration = duration;
  }

  /**
   * Set maximum number of notifications to display
   * @param {number} max - Maximum number of notifications
   */
  setMaxNotifications(max) {
    this.maxNotifications = max;
  }
}

// Create singleton instance
const notifications = new Notifications();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = notifications;
}

// Global access
if (typeof window !== "undefined") {
  window.notifications = notifications;
}
