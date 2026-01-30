// ============================================================================
// FILE: assets/js/components/sidebar-user.js
// ============================================================================

/**
 * User Dashboard Sidebar
 */

import Router from "../core/router.js";

const SidebarUser = {
  /**
   * Initialize user sidebar
   */
  init() {
    this.setActiveLink();
    this.setupMobileSidebar();
  },

  /**
   * Set active sidebar link based on current page
   */
  setActiveLink() {
    const currentPage = Router.getCurrentPage();
    const sidebarLinks = document.querySelectorAll(".sidebar a");

    sidebarLinks.forEach((link) => {
      link.classList.remove("active");

      const href = link.getAttribute("href");
      if (href && href.includes(currentPage)) {
        link.classList.add("active");
      }
    });
  },

  /**
   * Setup mobile sidebar toggle
   */
  setupMobileSidebar() {
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.querySelector(".sidebar");

    if (!sidebarToggle || !sidebar) return;

    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  },
};

export default SidebarUser;
