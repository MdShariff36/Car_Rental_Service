// ============================================================================
// FILE: assets/js/main.js
// ============================================================================

/**
 * Main Application Entry Point
 * Initializes global components and utilities
 */

import CONFIG from "./base/config.js";
import Header from "./components/header.js";
import Footer from "./components/footer.js";
import Theme from "./ui/theme.js";
import Loader from "./ui/loader.js";
import Notifications from "./ui/notifications.js";

// Make core utilities available globally
window.CONFIG = CONFIG;
window.Loader = Loader;
window.Notifications = Notifications;

/**
 * Initialize application
 */
function initializeApp() {
  console.log(
    `%c${CONFIG.APP_NAME} v${CONFIG.APP_VERSION}`,
    "color: #14b8a6; font-size: 16px; font-weight: bold;",
  );

  // Initialize theme
  Theme.init();

  // Initialize header (navigation, mobile menu, user dropdown)
  Header.init();

  // Initialize footer
  Footer.init();

  // Initialize notifications system
  Notifications.init();

  // Initialize loader
  Loader.init();

  // Log successful initialization
  console.log("✓ Auto Prime Rental initialized successfully");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Global error handler
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  // Only show notification for non-script errors
  if (event.error && event.error.message) {
    Notifications.error("An unexpected error occurred");
  }
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  // Silently log - don't spam users with notifications for promise errors
});

// Service Worker registration (optional - for PWA)
if ("serviceWorker" in navigator && CONFIG.ENABLE_SW) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => console.log("SW registered:", registration))
      .catch((err) => console.log("SW registration failed:", err));
  });
}

export { initializeApp };
