// FILE: assets/js/core/auth-guard.js

(function () {
  "use strict";

  /**
   * Check if current page requires authentication
   */
  function requiresAuth() {
    const path = window.location.pathname;
    const protectedPaths = [
      "/user/",
      "/host/",
      "/admin/",
      "/booking.html",
      "/payment.html",
      "/profile.html",
    ];
    return protectedPaths.some((p) => path.includes(p));
  }

  /**
   * Check if page requires specific role
   */
  function getRequiredRole() {
    const path = window.location.pathname;
    if (path.includes("/admin/")) return "ADMIN";
    if (path.includes("/host/")) return "HOST";
    if (path.includes("/user/")) return "USER";
    return null;
  }

  /**
   * Guard route
   */
  async function guardRoute() {
    if (!requiresAuth()) {
      return;
    }

    // Check if authenticated
    if (!AuthService.isAuthenticated()) {
      AuthService.redirectToLogin(window.location.href);
      return;
    }

    // Check role if required
    const requiredRole = getRequiredRole();
    if (requiredRole && !AuthService.hasRole(requiredRole)) {
      window.location.href = "/403.html";
      return;
    }

    // Verify token is still valid
    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token invalid");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      AuthService.removeToken();
      AuthService.redirectToLogin(window.location.href);
    }
  }

  // Run guard on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", guardRoute);
  } else {
    guardRoute();
  }
})();
