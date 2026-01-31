/**
 * Main Application Entry Point
 * Detects current page and initializes only required modules
 * NO direct DOM manipulation - delegates to page-specific modules
 */

// Import core modules
import { initializeHeader } from "./components/header.js";
import { initializeFooter } from "./components/footer.js";
import { initializeAuthGuard } from "./core/auth-guard.js";
import { getUserData } from "./base/storage.js";

/**
 * Page detection and initialization
 */
class AppInitializer {
  constructor() {
    this.currentPage = this.detectPage();
    this.userRole = this.getUserRole();
  }

  /**
   * Detect current page from URL path
   * @returns {Object} Page information
   */
  detectPage() {
    const path = window.location.pathname;
    const filename = path.split("/").pop() || "index.html";
    const directory = path.split("/").slice(-2, -1)[0] || "root";

    return {
      path,
      filename,
      directory,
      isAuthPage: this.isAuthenticationPage(filename),
      isDashboard: this.isDashboardPage(directory),
      requiresAuth: this.requiresAuthentication(filename, directory),
    };
  }

  /**
   * Check if page is an authentication page
   * @param {string} filename - Current page filename
   * @returns {boolean}
   */
  isAuthenticationPage(filename) {
    const authPages = ["login.html", "register.html", "forgot-password.html"];
    return authPages.includes(filename);
  }

  /**
   * Check if page is a dashboard page
   * @param {string} directory - Current directory
   * @returns {boolean}
   */
  isDashboardPage(directory) {
    const dashboardDirs = ["user", "host", "admin"];
    return dashboardDirs.includes(directory);
  }

  /**
   * Check if page requires authentication
   * @param {string} filename - Current page filename
   * @param {string} directory - Current directory
   * @returns {boolean}
   */
  requiresAuthentication(filename, directory) {
    // Public pages that don't require auth
    const publicPages = [
      "index.html",
      "about.html",
      "services.html",
      "cars.html",
      "car-details.html",
      "contact.html",
      "faq.html",
      "terms.html",
      "privacy.html",
      "blog.html",
      "help.html",
      "404.html",
      "login.html",
      "register.html",
      "forgot-password.html",
    ];

    // If it's a dashboard or user-specific page, require auth
    if (this.isDashboardPage(directory)) {
      return true;
    }

    // If it's in the protected pages, require auth
    const protectedPages = [
      "booking.html",
      "booking-confirm.html",
      "my-bookings.html",
      "profile.html",
      "wishlist.html",
      "payments.html",
    ];

    if (protectedPages.includes(filename)) {
      return true;
    }

    // Otherwise, check if it's NOT in public pages
    return !publicPages.includes(filename);
  }

  /**
   * Get current user role
   * @returns {string|null}
   */
  getUserRole() {
    const userData = getUserData();
    return userData?.role || null;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Always initialize header and footer (if they exist on page)
      this.initializeCommonComponents();

      // Handle authentication if required
      if (this.currentPage.requiresAuth) {
        await this.handleAuthentication();
      }

      // Initialize page-specific modules
      await this.initializePageModules();

      // Mark app as initialized
      document.body.classList.add("app-initialized");
    } catch (error) {
      console.error("Application initialization error:", error);
      this.handleInitError(error);
    }
  }

  /**
   * Initialize common components (header, footer)
   */
  initializeCommonComponents() {
    // Initialize header if it exists
    const headerElement = document.getElementById("header");
    if (headerElement && typeof initializeHeader === "function") {
      try {
        initializeHeader();
      } catch (error) {
        console.warn("Header initialization failed:", error);
      }
    }

    // Initialize footer if it exists
    const footerElement = document.getElementById("footer");
    if (footerElement && typeof initializeFooter === "function") {
      try {
        initializeFooter();
      } catch (error) {
        console.warn("Footer initialization failed:", error);
      }
    }
  }

  /**
   * Handle authentication requirements
   */
  async handleAuthentication() {
    if (typeof initializeAuthGuard === "function") {
      try {
        const isAuthenticated = await initializeAuthGuard(
          this.currentPage.directory,
        );

        if (!isAuthenticated && !this.currentPage.isAuthPage) {
          // Redirect to login if not authenticated
          const loginUrl = this.getLoginUrl();
          window.location.href = loginUrl;
          return false;
        }

        return isAuthenticated;
      } catch (error) {
        console.error("Auth guard error:", error);
        return false;
      }
    }
    return true;
  }

  /**
   * Get appropriate login URL based on current directory
   * @returns {string}
   */
  getLoginUrl() {
    const { directory } = this.currentPage;

    // Determine the relative path to login based on directory depth
    if (directory === "admin") {
      return "../admin/login.html";
    } else if (["user", "host"].includes(directory)) {
      return "../login.html";
    } else {
      return "login.html";
    }
  }

  /**
   * Initialize page-specific modules
   */
  async initializePageModules() {
    const { filename, directory } = this.currentPage;

    // Route to appropriate page initializer
    switch (directory) {
      case "user":
        await this.initializeUserPages(filename);
        break;
      case "host":
        await this.initializeHostPages(filename);
        break;
      case "admin":
        await this.initializeAdminPages(filename);
        break;
      default:
        await this.initializePublicPages(filename);
        break;
    }
  }

  /**
   * Initialize user dashboard pages
   * @param {string} filename
   */
  async initializeUserPages(filename) {
    // User pages are initialized by their own scripts
    // main.js doesn't need to do anything except ensure auth
    console.log(`User page loaded: ${filename}`);
  }

  /**
   * Initialize host dashboard pages
   * @param {string} filename
   */
  async initializeHostPages(filename) {
    // Host pages are initialized by their own scripts
    console.log(`Host page loaded: ${filename}`);
  }

  /**
   * Initialize admin dashboard pages
   * @param {string} filename
   */
  async initializeAdminPages(filename) {
    // Admin pages are initialized by their own scripts
    console.log(`Admin page loaded: ${filename}`);
  }

  /**
   * Initialize public pages
   * @param {string} filename
   */
  async initializePublicPages(filename) {
    // Public pages initialize their own modules via page-specific scripts
    // No additional initialization needed here
    console.log(`Public page loaded: ${filename}`);
  }

  /**
   * Handle initialization errors
   * @param {Error} error
   */
  handleInitError(error) {
    console.error("Failed to initialize application:", error);

    // Don't show error UI on production, just log it
    // In development, you could show an error overlay
    if (window.location.hostname === "localhost") {
      console.error("Stack trace:", error.stack);
    }
  }
}

/**
 * Initialize application when DOM is ready
 */
function initApp() {
  const app = new AppInitializer();
  app.init();
}

// Initialize when DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  // DOM already loaded
  initApp();
}

/**
 * Export for potential external use
 */
export { AppInitializer };
