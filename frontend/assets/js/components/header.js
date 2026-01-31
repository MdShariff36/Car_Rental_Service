/**
 * Header Component
 * Handles navigation, mobile menu toggle, auth UI, and user profile dropdown
 *
 * HTML Selectors Used:
 * - #header: Main header container
 * - #mainNav: Navigation menu
 * - #menuToggle: Mobile menu toggle button
 * - #authSection: Login/signup buttons container
 * - #userProfile: User profile dropdown container
 * - #profileTrigger: Profile dropdown trigger button
 * - #profileMenu: Profile dropdown menu
 * - #logoutBtn: Logout button
 */

class Header {
  constructor() {
    this.headerHTML = `
    <header class="site-header" id="header">
      <div class="container">
        <div class="logo">
          <a href="index.html">
            <img src="assets/images/logo/logo.png" alt="Auto Prime Logo" />
            <strong>Auto Prime</strong>
          </a>
        </div>

        <nav class="nav" id="mainNav">
          <a href="index.html">Home</a>
          <a href="cars.html">Cars</a>
          <a href="services.html">Services</a>
          <a href="about.html">About</a>
          <a href="blog.html">Blog</a>
          <a href="contact.html">Contact</a>

          <!-- Auth Section - Dynamic -->
          <div class="auth-section" id="authSection">
            <a href="login.html" class="btn-login">Login</a>
            <a href="register.html" class="btn-register">Sign Up</a>
          </div>

          <!-- User Profile Dropdown - Hidden by default -->
          <div class="user-profile-dropdown" id="userProfile" style="display: none">
            <button class="profile-trigger" id="profileTrigger">
              <img src="assets/images/default-avatar.png" alt="User" class="avatar" />
              <span class="user-name">John Doe</span>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" />
              </svg>
            </button>
            <div class="dropdown-menu" id="profileMenu">
              <a href="user/dashboard.html" class="dropdown-item">
                <span class="icon">📊</span> Dashboard
              </a>
              <a href="user/my-bookings.html" class="dropdown-item">
                <span class="icon">🚗</span> My Bookings
              </a>
              <a href="user/wishlist.html" class="dropdown-item">
                <span class="icon">❤️</span> Wishlist
              </a>
              <a href="user/profile.html" class="dropdown-item">
                <span class="icon">👤</span> Profile
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item" id="logoutBtn">
                <span class="icon">🚪</span> Logout
              </a>
            </div>
          </div>
        </nav>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" id="menuToggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>`;
  }

  /**
   * Render the header HTML into the target element
   * @param {string} targetSelector - CSS selector for target element (default: '#header')
   */
  render(targetSelector = "#header") {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.outerHTML = this.headerHTML;
    }
  }

  /**
   * Initialize header functionality after rendering
   */
  init() {
    this.setupMobileMenuToggle();
    this.setupProfileDropdown();
    this.setupAuthUI();
    this.setActiveNavLink();
  }

  /**
   * Setup mobile menu toggle functionality
   * Toggles the 'active' class on #mainNav and #menuToggle
   */
  setupMobileMenuToggle() {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
      menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        mainNav.classList.toggle("active");
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
          menuToggle.classList.remove("active");
          mainNav.classList.remove("active");
        }
      });

      // Close menu when clicking on nav links
      const navLinks = mainNav.querySelectorAll("a");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          menuToggle.classList.remove("active");
          mainNav.classList.remove("active");
        });
      });
    }
  }

  /**
   * Setup profile dropdown toggle
   * Toggles visibility of #profileMenu when #profileTrigger is clicked
   */
  setupProfileDropdown() {
    const profileTrigger = document.getElementById("profileTrigger");
    const profileMenu = document.getElementById("profileMenu");

    if (profileTrigger && profileMenu) {
      profileTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle("active");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !profileMenu.contains(e.target) &&
          !profileTrigger.contains(e.target)
        ) {
          profileMenu.classList.remove("active");
        }
      });

      // Setup logout functionality
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      }
    }
  }

  /**
   * Setup auth UI based on user login status
   * Shows either #authSection (logged out) or #userProfile (logged in)
   */
  setupAuthUI() {
    const authSection = document.getElementById("authSection");
    const userProfile = document.getElementById("userProfile");

    // Check if user is logged in (check localStorage or session)
    const user = this.getCurrentUser();

    if (user && authSection && userProfile) {
      // User is logged in - show profile, hide auth buttons
      authSection.style.display = "none";
      userProfile.style.display = "block";

      // Update user name in profile dropdown
      const userName = userProfile.querySelector(".user-name");
      if (userName) {
        userName.textContent = user.name || "User";
      }

      // Update avatar if available
      const avatar = userProfile.querySelector(".avatar");
      if (avatar && user.avatar) {
        avatar.src = user.avatar;
      }
    } else if (authSection && userProfile) {
      // User is not logged in - show auth buttons, hide profile
      authSection.style.display = "flex";
      userProfile.style.display = "none";
    }
  }

  /**
   * Get current user from storage
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  /**
   * Handle user logout
   */
  handleLogout() {
    // Clear user data from storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to home page
    window.location.href = "index.html";
  }

  /**
   * Set active class on current page nav link
   */
  setActiveNavLink() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("#mainNav a");

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      if (
        linkHref === currentPage ||
        (currentPage === "" && linkHref === "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const header = new Header();
    header.render();
    header.init();
  });
}

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = Header;
}
