// FILE: assets/js/main.js

(function () {
  "use strict";

  // Global initialization
  document.addEventListener("DOMContentLoaded", function () {
    initializeApp();
  });

  function initializeApp() {
    // Setup global error handler
    setupErrorHandler();

    // Initialize navigation
    initializeNavigation();

    // Initialize logout buttons
    initializeLogout();

    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize scroll effects
    initializeScrollEffects();
  }

  function setupErrorHandler() {
    window.addEventListener("unhandledrejection", function (event) {
      console.error("Unhandled promise rejection:", event.reason);
      showGlobalNotification("An unexpected error occurred", "error");
    });

    window.addEventListener("error", function (event) {
      console.error("Global error:", event.error);
    });
  }

  function initializeNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav a, .sidebar a");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && currentPath.includes(href)) {
        link.classList.add("active");
      }
    });
  }

  function initializeLogout() {
    const logoutButtons = document.querySelectorAll(
      '.logout-btn, [data-action="logout"]',
    );

    logoutButtons.forEach((button) => {
      button.addEventListener("click", async function (e) {
        e.preventDefault();

        if (confirm("Are you sure you want to logout?")) {
          if (typeof AuthService !== "undefined") {
            await AuthService.logout();
          } else {
            localStorage.clear();
            window.location.href = "/login.html";
          }
        }
      });
    });
  }

  function initializeMobileMenu() {
    const mobileToggle = document.querySelector(".mobile-toggle");
    const nav = document.querySelector(".nav");

    if (mobileToggle && nav) {
      mobileToggle.addEventListener("click", function () {
        nav.classList.toggle("open");
        mobileToggle.classList.toggle("active");
      });

      // Close menu when clicking outside
      document.addEventListener("click", function (e) {
        if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
          nav.classList.remove("open");
          mobileToggle.classList.remove("active");
        }
      });
    }
  }

  function initializeScrollEffects() {
    const header = document.querySelector(".site-header");

    if (header) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      });
    }

    // Back to top button
    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
          backToTop.style.display = "block";
        } else {
          backToTop.style.display = "none";
        }
      });

      backToTop.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  function showGlobalNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }

  // Make utility functions globally available
  window.AppUtils = {
    showNotification: showGlobalNotification,
    formatCurrency: function (amount) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    },
    formatDate: function (dateString) {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
    formatDateTime: function (dateString) {
      return new Date(dateString).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  };
})();
