// ============================================================================
// FILE: assets/js/components/header.js
// ============================================================================

/**
 * Header Component
 * Handles mobile menu, user dropdown, and navigation
 */

import Storage from "../base/storage.js";
import Router from "../core/router.js";

const Header = {
  /**
   * Initialize header functionality
   */
  init() {
    this.setupMobileMenu();
    this.setupUserDropdown();
    this.updateAuthUI();
    this.setupLogout();
    Router.setActiveNavLink();
  },

  /**
   * Setup mobile menu toggle
   */
  setupMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });

    // Close menu on link click (mobile)
    const navLinks = mainNav.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          mainNav.classList.remove("active");
          menuToggle.classList.remove("active");
        }
      });
    });
  },

  /**
   * Setup user profile dropdown
   */
  setupUserDropdown() {
    const profileTrigger = document.getElementById("profileTrigger");
    const profileMenu = document.getElementById("profileMenu");

    if (!profileTrigger || !profileMenu) return;

    profileTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      profileMenu.classList.remove("show");
    });

    // Prevent closing when clicking inside menu
    profileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  },

  /**
   * Update UI based on authentication status
   */
  updateAuthUI() {
    const authSection = document.getElementById("authSection");
    const userProfile = document.getElementById("userProfile");

    if (!authSection || !userProfile) return;

    const isAuthenticated = Storage.isAuthenticated();

    if (isAuthenticated) {
      authSection.style.display = "none";
      userProfile.style.display = "block";

      // Update user name
      const userData = Storage.getUserData();
      if (userData) {
        const userNameElement = userProfile.querySelector(".user-name");
        if (userNameElement) {
          userNameElement.textContent = userData.name || "User";
        }

        // Update avatar if available
        const avatarElement = userProfile.querySelector(".avatar");
        if (avatarElement && userData.avatar) {
          avatarElement.src = userData.avatar;
        }
      }
    } else {
      authSection.style.display = "flex";
      userProfile.style.display = "none";
    }
  },

  /**
   * Setup logout functionality
   */
  setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (confirm("Are you sure you want to logout?")) {
        Storage.logout();
        window.location.href = "/index.html";
      }
    });
  },
};

export default Header;
