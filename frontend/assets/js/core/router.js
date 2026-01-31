// FILE: assets/js/core/router.js

/**
 * Router Module
 * Client-side routing and navigation utilities
 */

import { ROUTES, USER_ROLES } from "../base/config.js";
import { getUserRole, isAuthenticated } from "../base/storage.js";

// ============================================================
// Route Configuration
// ============================================================

/**
 * Define all application routes with their access requirements
 */
const routeConfig = {
  // Public routes
  "/index.html": { public: true, roles: [] },
  "/": { public: true, roles: [] },
  "/cars.html": { public: true, roles: [] },
  "/car-details.html": { public: true, roles: [] },
  "/services.html": { public: true, roles: [] },
  "/about.html": { public: true, roles: [] },
  "/contact.html": { public: true, roles: [] },
  "/faq.html": { public: true, roles: [] },
  "/blog.html": { public: true, roles: [] },
  "/terms.html": { public: true, roles: [] },
  "/privacy.html": { public: true, roles: [] },
  "/help.html": { public: true, roles: [] },
  "/compare.html": { public: true, roles: [] },
  "/review.html": { public: true, roles: [] },
  "/404.html": { public: true, roles: [] },

  // Auth routes (redirect if already logged in)
  "/login.html": {
    public: true,
    roles: [],
    redirectIfAuth: "/user/dashboard.html",
  },
  "/register.html": {
    public: true,
    roles: [],
    redirectIfAuth: "/user/dashboard.html",
  },
  "/forgot-password.html": {
    public: true,
    roles: [],
    redirectIfAuth: "/user/dashboard.html",
  },

  // Protected routes - require authentication
  "/booking.html": { public: false, roles: [USER_ROLES.USER, USER_ROLES.HOST] },
  "/booking-confirm.html": {
    public: false,
    roles: [USER_ROLES.USER, USER_ROLES.HOST],
  },
  "/newsletter.html": {
    public: false,
    roles: [USER_ROLES.USER, USER_ROLES.HOST],
  },

  // User dashboard routes
  "/user/dashboard.html": { public: false, roles: [USER_ROLES.USER] },
  "/user/my-bookings.html": { public: false, roles: [USER_ROLES.USER] },
  "/user/payments.html": { public: false, roles: [USER_ROLES.USER] },
  "/user/wishlist.html": { public: false, roles: [USER_ROLES.USER] },
  "/user/profile.html": { public: false, roles: [USER_ROLES.USER] },

  // Host dashboard routes
  "/host/dashboard.html": { public: false, roles: [USER_ROLES.HOST] },
  "/host/add-car.html": { public: false, roles: [USER_ROLES.HOST] },
  "/host/manage-cars.html": { public: false, roles: [USER_ROLES.HOST] },
  "/host/earnings.html": { public: false, roles: [USER_ROLES.HOST] },

  // Admin routes
  "/admin/login.html": {
    public: true,
    roles: [],
    redirectIfAuth: "/admin/dashboard.html",
  },
  "/admin/dashboard.html": { public: false, roles: [USER_ROLES.ADMIN] },
  "/admin/bookings.html": { public: false, roles: [USER_ROLES.ADMIN] },
  "/admin/cars.html": { public: false, roles: [USER_ROLES.ADMIN] },
  "/admin/add-car.html": { public: false, roles: [USER_ROLES.ADMIN] },
  "/admin/edit-car.html": { public: false, roles: [USER_ROLES.ADMIN] },
  "/admin/users.html": { public: false, roles: [USER_ROLES.ADMIN] },
  "/admin/reports.html": { public: false, roles: [USER_ROLES.ADMIN] },
  "/admin/settings.html": { public: false, roles: [USER_ROLES.ADMIN] },
};

// ============================================================
// Navigation Utilities
// ============================================================

/**
 * Get current route path
 */
export function getCurrentPath() {
  return window.location.pathname;
}

/**
 * Get route configuration for a path
 */
export function getRouteConfig(path) {
  // Normalize path
  const normalizedPath = path === "/" ? "/index.html" : path;
  return routeConfig[normalizedPath] || null;
}

/**
 * Check if current route is public
 */
export function isPublicRoute(path = getCurrentPath()) {
  const config = getRouteConfig(path);
  return config ? config.public : false;
}

/**
 * Check if user has access to route
 */
export function hasRouteAccess(path = getCurrentPath()) {
  const config = getRouteConfig(path);

  if (!config) {
    return true; // Allow access to unknown routes (will show 404)
  }

  // Public routes are accessible to all
  if (config.public) {
    return true;
  }

  // Protected routes require authentication
  if (!isAuthenticated()) {
    return false;
  }

  // Check role-based access
  if (config.roles && config.roles.length > 0) {
    const userRole = getUserRole();
    return config.roles.includes(userRole);
  }

  return true;
}

/**
 * Navigate to a route
 */
export function navigateTo(path, replace = false) {
  if (replace) {
    window.location.replace(path);
  } else {
    window.location.href = path;
  }
}

/**
 * Reload current page
 */
export function reloadPage() {
  window.location.reload();
}

/**
 * Go back in history
 */
export function goBack() {
  window.history.back();
}

/**
 * Go forward in history
 */
export function goForward() {
  window.history.forward();
}

// ============================================================
// Dashboard Routing
// ============================================================

/**
 * Get dashboard URL for user role
 */
export function getDashboardUrl(role = null) {
  const userRole = role || getUserRole();

  switch (userRole) {
    case USER_ROLES.USER:
      return ROUTES.USER_DASHBOARD;
    case USER_ROLES.HOST:
      return ROUTES.HOST_DASHBOARD;
    case USER_ROLES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
}

/**
 * Navigate to appropriate dashboard
 */
export function navigateToDashboard(role = null) {
  const dashboardUrl = getDashboardUrl(role);
  navigateTo(dashboardUrl);
}

// ============================================================
// Login/Logout Routing
// ============================================================

/**
 * Navigate to login with return URL
 */
export function navigateToLogin(returnUrl = null) {
  const url = returnUrl
    ? `${ROUTES.LOGIN}?return=${encodeURIComponent(returnUrl)}`
    : ROUTES.LOGIN;
  navigateTo(url);
}

/**
 * Get return URL from query params
 */
export function getReturnUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("return") || null;
}

/**
 * Handle post-login navigation
 */
export function handlePostLoginNavigation() {
  const returnUrl = getReturnUrl();

  if (returnUrl) {
    // Validate return URL to prevent open redirect
    if (returnUrl.startsWith("/") && !returnUrl.startsWith("//")) {
      navigateTo(returnUrl);
      return;
    }
  }

  // Navigate to dashboard based on role
  navigateToDashboard();
}

/**
 * Handle logout navigation
 */
export function handleLogoutNavigation() {
  navigateTo(ROUTES.HOME, true);
}

// ============================================================
// Redirect Utilities
// ============================================================

/**
 * Redirect if already authenticated
 */
export function redirectIfAuthenticated() {
  const currentPath = getCurrentPath();
  const config = getRouteConfig(currentPath);

  if (config && config.redirectIfAuth && isAuthenticated()) {
    const redirectUrl =
      typeof config.redirectIfAuth === "string"
        ? config.redirectIfAuth
        : getDashboardUrl();
    navigateTo(redirectUrl, true);
    return true;
  }

  return false;
}

/**
 * Redirect to login if not authenticated
 */
export function redirectToLoginIfNotAuthenticated() {
  if (!isAuthenticated()) {
    const currentPath = getCurrentPath();
    navigateToLogin(currentPath);
    return true;
  }
  return false;
}

/**
 * Redirect if no access
 */
export function redirectIfNoAccess() {
  const currentPath = getCurrentPath();

  if (!hasRouteAccess(currentPath)) {
    if (!isAuthenticated()) {
      navigateToLogin(currentPath);
    } else {
      // User is authenticated but doesn't have role access
      navigateToDashboard();
    }
    return true;
  }

  return false;
}

// ============================================================
// Route Matching
// ============================================================

/**
 * Check if current path matches a route
 */
export function isRoute(routePath) {
  return getCurrentPath() === routePath;
}

/**
 * Check if current path starts with a route prefix
 */
export function isRoutePrefix(prefix) {
  return getCurrentPath().startsWith(prefix);
}

/**
 * Check if in user dashboard area
 */
export function isUserDashboard() {
  return isRoutePrefix("/user/");
}

/**
 * Check if in host dashboard area
 */
export function isHostDashboard() {
  return isRoutePrefix("/host/");
}

/**
 * Check if in admin dashboard area
 */
export function isAdminDashboard() {
  return isRoutePrefix("/admin/");
}

/**
 * Check if in any dashboard area
 */
export function isDashboard() {
  return isUserDashboard() || isHostDashboard() || isAdminDashboard();
}

// ============================================================
// Query Parameters
// ============================================================

/**
 * Get query parameter
 */
export function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Get all query parameters
 */
export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

/**
 * Add query parameters to URL
 */
export function addQueryParams(params, replace = false) {
  const currentParams = new URLSearchParams(window.location.search);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      currentParams.set(key, value);
    } else {
      currentParams.delete(key);
    }
  });

  const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

  if (replace) {
    window.history.replaceState({}, "", newUrl);
  } else {
    window.history.pushState({}, "", newUrl);
  }
}

/**
 * Remove query parameter
 */
export function removeQueryParam(name, replace = false) {
  const params = new URLSearchParams(window.location.search);
  params.delete(name);

  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  if (replace) {
    window.history.replaceState({}, "", newUrl);
  } else {
    window.history.pushState({}, "", newUrl);
  }
}

/**
 * Clear all query parameters
 */
export function clearQueryParams(replace = false) {
  const newUrl = window.location.pathname;

  if (replace) {
    window.history.replaceState({}, "", newUrl);
  } else {
    window.history.pushState({}, "", newUrl);
  }
}

// ============================================================
// Hash Navigation
// ============================================================

/**
 * Get current hash
 */
export function getHash() {
  return window.location.hash.slice(1); // Remove #
}

/**
 * Set hash
 */
export function setHash(hash, replace = false) {
  const newHash = hash.startsWith("#") ? hash : `#${hash}`;

  if (replace) {
    window.location.replace(newHash);
  } else {
    window.location.hash = newHash;
  }
}

/**
 * Clear hash
 */
export function clearHash(replace = false) {
  if (replace) {
    window.history.replaceState(
      "",
      document.title,
      window.location.pathname + window.location.search,
    );
  } else {
    window.location.hash = "";
  }
}

// ============================================================
// Breadcrumb Generation
// ============================================================

/**
 * Generate breadcrumb from current path
 */
export function generateBreadcrumb() {
  const path = getCurrentPath();
  const parts = path.split("/").filter((p) => p && p !== "index.html");

  const breadcrumb = [{ name: "Home", path: "/index.html" }];

  let currentPath = "";
  parts.forEach((part) => {
    currentPath += "/" + part;

    // Format name (remove .html, capitalize)
    const name = part
      .replace(".html", "")
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumb.push({
      name,
      path: currentPath,
    });
  });

  return breadcrumb;
}

// ============================================================
// Route History
// ============================================================

let routeHistory = [];
const MAX_HISTORY = 10;

/**
 * Add to route history
 */
export function addToHistory(path) {
  routeHistory.unshift(path);
  if (routeHistory.length > MAX_HISTORY) {
    routeHistory = routeHistory.slice(0, MAX_HISTORY);
  }
}

/**
 * Get route history
 */
export function getHistory() {
  return [...routeHistory];
}

/**
 * Get previous route
 */
export function getPreviousRoute() {
  return routeHistory[1] || null;
}

/**
 * Clear route history
 */
export function clearHistory() {
  routeHistory = [];
}

// ============================================================
// Page Title Management
// ============================================================

/**
 * Set page title
 */
export function setPageTitle(title) {
  document.title = `${title} | Auto Prime Rental`;
}

/**
 * Get page title from path
 */
export function getPageTitleFromPath(path = getCurrentPath()) {
  const titles = {
    "/index.html": "Home",
    "/cars.html": "Browse Cars",
    "/car-details.html": "Car Details",
    "/booking.html": "Complete Booking",
    "/booking-confirm.html": "Booking Confirmed",
    "/services.html": "Our Services",
    "/about.html": "About Us",
    "/contact.html": "Contact Us",
    "/faq.html": "FAQ",
    "/blog.html": "Blog",
    "/login.html": "Login",
    "/register.html": "Sign Up",
    "/forgot-password.html": "Forgot Password",
    "/user/dashboard.html": "Dashboard",
    "/user/my-bookings.html": "My Bookings",
    "/user/wishlist.html": "Wishlist",
    "/user/profile.html": "Profile",
    "/host/dashboard.html": "Host Dashboard",
    "/host/add-car.html": "Add Car",
    "/host/manage-cars.html": "Manage Cars",
    "/admin/dashboard.html": "Admin Dashboard",
  };

  return titles[path] || "Auto Prime Rental";
}

// ============================================================
// Initialize
// ============================================================

/**
 * Initialize router
 */
export function initRouter() {
  // Add current path to history
  addToHistory(getCurrentPath());

  // Track route changes
  window.addEventListener("popstate", () => {
    addToHistory(getCurrentPath());
  });

  return true;
}

// Export all as default
export default {
  // Path utilities
  getCurrentPath,
  getRouteConfig,
  isPublicRoute,
  hasRouteAccess,

  // Navigation
  navigateTo,
  reloadPage,
  goBack,
  goForward,

  // Dashboard
  getDashboardUrl,
  navigateToDashboard,

  // Login/Logout
  navigateToLogin,
  getReturnUrl,
  handlePostLoginNavigation,
  handleLogoutNavigation,

  // Redirects
  redirectIfAuthenticated,
  redirectToLoginIfNotAuthenticated,
  redirectIfNoAccess,

  // Route matching
  isRoute,
  isRoutePrefix,
  isUserDashboard,
  isHostDashboard,
  isAdminDashboard,
  isDashboard,

  // Query params
  getQueryParam,
  getQueryParams,
  addQueryParams,
  removeQueryParam,
  clearQueryParams,

  // Hash
  getHash,
  setHash,
  clearHash,

  // Breadcrumb
  generateBreadcrumb,

  // History
  addToHistory,
  getHistory,
  getPreviousRoute,
  clearHistory,

  // Title
  setPageTitle,
  getPageTitleFromPath,

  // Initialize
  initRouter,
};
