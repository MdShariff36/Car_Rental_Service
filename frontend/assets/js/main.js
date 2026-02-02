/**
 * Main JavaScript - Global functionality
 * NO PAGE-SPECIFIC BACKEND CALLS
 * Only handles global UI features and navigation
 */

(() => {
  "use strict";

  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Main app initialized");

    // Initialize global features
    initializeNavigation();
    initializeAuthState();
    initializeMobileMenu();
    initializeScrollEffects();
  });

  /**
   * Initialize navigation
   */
  function initializeNavigation() {
    // Highlight active page in navigation
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href === currentPage ||
        (currentPage === "" && href === "index.html")
      ) {
        link.classList.add("active");
      }
    });

    // Handle logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", handleLogout);
    }
  }

  /**
   * Initialize authentication state
   * NO BACKEND CALL - just checks localStorage
   */
  function initializeAuthState() {
    const isLoggedIn = AuthService.isAuthenticated();

    // Update navigation based on auth state
    updateAuthUI(isLoggedIn);

    // Set user info if logged in
    if (isLoggedIn) {
      displayUserInfo();
    }
  }

  /**
   * Update UI based on authentication state
   */
  function updateAuthUI(isLoggedIn) {
    // Show/hide elements based on auth state
    const authElements = document.querySelectorAll("[data-auth-required]");
    const guestElements = document.querySelectorAll("[data-guest-only]");

    authElements.forEach((el) => {
      el.style.display = isLoggedIn ? "" : "none";
    });

    guestElements.forEach((el) => {
      el.style.display = isLoggedIn ? "none" : "";
    });
  }

  /**
   * Display user information
   */
  function displayUserInfo() {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    // Update user name displays
    const userNameElements = document.querySelectorAll("[data-user-name]");
    userNameElements.forEach((el) => {
      el.textContent = user.name || "User";
    });

    // Update user email displays
    const userEmailElements = document.querySelectorAll("[data-user-email]");
    userEmailElements.forEach((el) => {
      el.textContent = user.email || "";
    });

    // Update avatar if available
    const avatarElements = document.querySelectorAll("[data-user-avatar]");
    avatarElements.forEach((el) => {
      if (user.avatar) {
        el.src = user.avatar;
      } else {
        // Show initials
        el.textContent = getInitials(user.name);
      }
    });
  }

  /**
   * Get user initials
   */
  function getInitials(name) {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  }

  /**
   * Handle logout
   */
  function handleLogout(e) {
    e.preventDefault();

    // Confirm logout
    if (confirm("Are you sure you want to logout?")) {
      AuthService.logout();

      // Show notification
      showGlobalNotification("Logged out successfully", "success");

      // Redirect to home page
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    }
  }

  /**
   * Initialize mobile menu
   */
  function initializeMobileMenu() {
    const menuToggle = document.getElementById("mobileMenuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        menuToggle.classList.toggle("active");
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          mobileMenu.classList.remove("active");
          menuToggle.classList.remove("active");
        }
      });
    }
  }

  /**
   * Initialize scroll effects
   */
  function initializeScrollEffects() {
    const header = document.querySelector(".header");
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      // Add shadow on scroll
      if (currentScroll > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Hide header on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }

      lastScroll = currentScroll;
    });
  }

  /**
   * Show global notification
   */
  function showGlobalNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Make global functions available
  window.showGlobalNotification = showGlobalNotification;
})();
