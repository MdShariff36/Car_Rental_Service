// ============================================================================
// FILE: assets/js/core/router.js
// ============================================================================

/**
 * Client-side Router
 * Handles navigation and active state
 */

const Router = {
  /**
   * Get current page name
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    return page;
  },

  /**
   * Check if on specific page
   */
  isPage(pageName) {
    const currentPage = this.getCurrentPage();
    return currentPage === pageName || currentPage === `${pageName}.html`;
  },

  /**
   * Navigate to page
   */
  navigateTo(url) {
    window.location.href = url;
  },

  /**
   * Reload current page
   */
  reload() {
    window.location.reload();
  },

  /**
   * Go back in history
   */
  goBack() {
    window.history.back();
  },

  /**
   * Set active navigation link
   */
  setActiveNavLink() {
    const currentPage = this.getCurrentPage();
    const navLinks = document.querySelectorAll(".nav a");

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const href = link.getAttribute("href");
      if (href && (href === currentPage || href.includes(currentPage))) {
        link.classList.add("active");
      }
    });
  },
};

export default Router;
