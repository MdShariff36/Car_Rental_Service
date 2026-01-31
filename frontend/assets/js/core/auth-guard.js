// FILE: assets/js/core/auth-guard.js

/**
 * Auth Guard Module
 * Handles authentication and authorization checks
 * Protects routes and manages access control
 */

import { USER_ROLES } from "../base/config.js";
import {
  isAuthenticated,
  getUserData,
  getUserRole,
  removeAuthToken,
  clearAllAppData,
} from "../base/storage.js";
import {
  redirectIfAuthenticated,
  redirectToLoginIfNotAuthenticated,
  redirectIfNoAccess,
  getCurrentPath,
  navigateToLogin,
  handleLogoutNavigation,
  getDashboardUrl,
} from "./router.js";

// ============================================================
// Authentication Checks
// ============================================================

/**
 * Check if user is logged in
 */
export function checkAuth() {
  return isAuthenticated();
}

/**
 * Get current user
 */
export function getCurrentUser() {
  if (!isAuthenticated()) {
    return null;
  }
  return getUserData();
}

/**
 * Get current user role
 */
export function getCurrentUserRole() {
  if (!isAuthenticated()) {
    return null;
  }
  return getUserRole();
}

/**
 * Check if user has specific role
 */
export function hasRole(role) {
  const userRole = getCurrentUserRole();
  return userRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles) {
  const userRole = getCurrentUserRole();
  return roles.includes(userRole);
}

/**
 * Check if user is admin
 */
export function isAdmin() {
  return hasRole(USER_ROLES.ADMIN);
}

/**
 * Check if user is host
 */
export function isHost() {
  return hasRole(USER_ROLES.HOST);
}

/**
 * Check if user is regular user
 */
export function isUser() {
  return hasRole(USER_ROLES.USER);
}

// ============================================================
// Route Guards
// ============================================================

/**
 * Guard for public routes (redirect if already logged in)
 * Use on login/register pages
 */
export function guardPublicRoute() {
  return redirectIfAuthenticated();
}

/**
 * Guard for protected routes (require authentication)
 * Use on all pages that require login
 */
export function guardProtectedRoute() {
  if (!isAuthenticated()) {
    redirectToLoginIfNotAuthenticated();
    return false;
  }
  return true;
}

/**
 * Guard for role-specific routes
 * Use on dashboard pages
 */
export function guardRoleRoute(allowedRoles) {
  // First check authentication
  if (!isAuthenticated()) {
    redirectToLoginIfNotAuthenticated();
    return false;
  }

  // Then check role
  const userRole = getCurrentUserRole();
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard
    window.location.href = getDashboardUrl();
    return false;
  }

  return true;
}

/**
 * Guard for user dashboard routes
 */
export function guardUserRoute() {
  return guardRoleRoute([USER_ROLES.USER]);
}

/**
 * Guard for host dashboard routes
 */
export function guardHostRoute() {
  return guardRoleRoute([USER_ROLES.HOST]);
}

/**
 * Guard for admin dashboard routes
 */
export function guardAdminRoute() {
  return guardRoleRoute([USER_ROLES.ADMIN]);
}

/**
 * Universal route guard (checks all access rules)
 */
export function guardRoute() {
  return !redirectIfNoAccess();
}

// ============================================================
// Page-Level Guards
// ============================================================

/**
 * Initialize auth guard for current page
 * Call this on page load to handle route protection
 */
export function initAuthGuard() {
  const path = getCurrentPath();

  // Public routes that redirect if authenticated
  const publicRoutes = [
    "/login.html",
    "/register.html",
    "/forgot-password.html",
  ];
  if (publicRoutes.includes(path)) {
    guardPublicRoute();
    return;
  }

  // Admin routes
  if (path.startsWith("/admin/") && path !== "/admin/login.html") {
    guardAdminRoute();
    return;
  }

  // Host routes
  if (path.startsWith("/host/")) {
    guardHostRoute();
    return;
  }

  // User routes
  if (path.startsWith("/user/")) {
    guardUserRoute();
    return;
  }

  // Protected routes (booking, etc)
  const protectedRoutes = [
    "/booking.html",
    "/booking-confirm.html",
    "/newsletter.html",
  ];
  if (protectedRoutes.includes(path)) {
    guardProtectedRoute();
    return;
  }

  // All other routes are public
  return true;
}

// ============================================================
// Permission Checks
// ============================================================

/**
 * Check if user can book cars
 */
export function canBook() {
  return isAuthenticated() && (isUser() || isHost());
}

/**
 * Check if user can list cars
 */
export function canListCars() {
  return isAuthenticated() && (isHost() || isAdmin());
}

/**
 * Check if user can manage users
 */
export function canManageUsers() {
  return isAuthenticated() && isAdmin();
}

/**
 * Check if user can view bookings
 */
export function canViewBookings() {
  return isAuthenticated();
}

/**
 * Check if user can cancel booking
 */
export function canCancelBooking(booking) {
  if (!isAuthenticated()) return false;

  // Admins can cancel any booking
  if (isAdmin()) return true;

  // Users can cancel their own bookings
  const user = getCurrentUser();
  return booking.userId === user.id;
}

/**
 * Check if user can edit car
 */
export function canEditCar(car) {
  if (!isAuthenticated()) return false;

  // Admins can edit any car
  if (isAdmin()) return true;

  // Hosts can edit their own cars
  if (isHost()) {
    const user = getCurrentUser();
    return car.hostId === user.id;
  }

  return false;
}

/**
 * Check if user can view reports
 */
export function canViewReports() {
  return isAuthenticated() && (isHost() || isAdmin());
}

// ============================================================
// Auth State Management
// ============================================================

/**
 * Handle successful login
 */
export function handleLoginSuccess(userData, token) {
  // Token and user data should already be saved by the login API call
  // This function is for any additional post-login logic

  return {
    success: true,
    role: userData.role,
    redirectUrl: getDashboardUrl(userData.role),
  };
}

/**
 * Handle logout
 */
export function handleLogout() {
  // Clear all app data
  clearAllAppData();

  // Redirect to home
  handleLogoutNavigation();

  return true;
}

/**
 * Force logout (session expired, unauthorized, etc)
 */
export function forceLogout(reason = "Session expired") {
  // Clear all app data
  clearAllAppData();

  // Redirect to login with message
  const currentPath = getCurrentPath();
  navigateToLogin(currentPath);

  return {
    success: true,
    reason,
  };
}

// ============================================================
// Session Management
// ============================================================

/**
 * Check if session is valid
 */
export function isSessionValid() {
  // Basic check - could be extended with token expiration check
  return isAuthenticated();
}

/**
 * Refresh session
 */
export async function refreshSession() {
  // This would typically make an API call to refresh the token
  // For now, just check if session is still valid
  return isSessionValid();
}

/**
 * Validate session on activity
 */
let lastActivity = Date.now();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function updateActivity() {
  lastActivity = Date.now();
}

export function checkSessionTimeout() {
  const now = Date.now();
  const timeSinceActivity = now - lastActivity;

  if (timeSinceActivity > SESSION_TIMEOUT) {
    forceLogout("Session timeout due to inactivity");
    return false;
  }

  return true;
}

/**
 * Initialize session monitoring
 */
export function initSessionMonitoring() {
  // Update activity on user interaction
  const events = ["mousedown", "keydown", "scroll", "touchstart"];
  events.forEach((event) => {
    document.addEventListener(event, updateActivity);
  });

  // Check session timeout periodically
  setInterval(() => {
    if (isAuthenticated()) {
      checkSessionTimeout();
    }
  }, 60000); // Check every minute

  return true;
}

// ============================================================
// Feature Flags (Role-based features)
// ============================================================

/**
 * Get enabled features for current user
 */
export function getEnabledFeatures() {
  const userRole = getCurrentUserRole();

  const features = {
    // Common features
    browseCars: true,
    searchCars: true,
    viewCarDetails: true,

    // User features
    bookCars: canBook(),
    viewBookings: canViewBookings(),
    manageWishlist: isAuthenticated(),

    // Host features
    listCars: canListCars(),
    manageCars: isHost() || isAdmin(),
    viewEarnings: isHost() || isAdmin(),

    // Admin features
    manageUsers: canManageUsers(),
    viewAllBookings: isAdmin(),
    viewReports: canViewReports(),
    manageSettings: isAdmin(),
  };

  return features;
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature) {
  const features = getEnabledFeatures();
  return features[feature] || false;
}

// ============================================================
// UI Visibility Helpers
// ============================================================

/**
 * Should show admin menu
 */
export function shouldShowAdminMenu() {
  return isAdmin();
}

/**
 * Should show host menu
 */
export function shouldShowHostMenu() {
  return isHost();
}

/**
 * Should show user menu
 */
export function shouldShowUserMenu() {
  return isUser();
}

/**
 * Should show login button
 */
export function shouldShowLoginButton() {
  return !isAuthenticated();
}

/**
 * Should show user profile
 */
export function shouldShowUserProfile() {
  return isAuthenticated();
}

/**
 * Get user display name
 */
export function getUserDisplayName() {
  if (!isAuthenticated()) {
    return "Guest";
  }

  const user = getCurrentUser();
  return user.name || user.firstName || user.email || "User";
}

/**
 * Get user avatar URL
 */
export function getUserAvatarUrl() {
  if (!isAuthenticated()) {
    return "assets/images/default-avatar.png";
  }

  const user = getCurrentUser();
  return (
    user.avatar || user.profilePicture || "assets/images/default-avatar.png"
  );
}

// ============================================================
// Validation Helpers
// ============================================================

/**
 * Validate user can perform action
 */
export function validateAction(action, resource = null) {
  const validations = {
    book: canBook,
    listCar: canListCars,
    manageUsers: canManageUsers,
    viewReports: canViewReports,
    cancelBooking: () => canCancelBooking(resource),
    editCar: () => canEditCar(resource),
  };

  const validator = validations[action];
  if (!validator) {
    console.warn(`Unknown action: ${action}`);
    return false;
  }

  return validator();
}

/**
 * Require authentication
 */
export function requireAuth() {
  if (!isAuthenticated()) {
    const currentPath = getCurrentPath();
    navigateToLogin(currentPath);
    return false;
  }
  return true;
}

/**
 * Require specific role
 */
export function requireRole(role) {
  if (!requireAuth()) {
    return false;
  }

  if (!hasRole(role)) {
    window.location.href = getDashboardUrl();
    return false;
  }

  return true;
}

/**
 * Require any of specified roles
 */
export function requireAnyRole(roles) {
  if (!requireAuth()) {
    return false;
  }

  if (!hasAnyRole(roles)) {
    window.location.href = getDashboardUrl();
    return false;
  }

  return true;
}

// Export all as default
export default {
  // Auth checks
  checkAuth,
  getCurrentUser,
  getCurrentUserRole,
  hasRole,
  hasAnyRole,
  isAdmin,
  isHost,
  isUser,

  // Route guards
  guardPublicRoute,
  guardProtectedRoute,
  guardRoleRoute,
  guardUserRoute,
  guardHostRoute,
  guardAdminRoute,
  guardRoute,
  initAuthGuard,

  // Permissions
  canBook,
  canListCars,
  canManageUsers,
  canViewBookings,
  canCancelBooking,
  canEditCar,
  canViewReports,

  // Auth state
  handleLoginSuccess,
  handleLogout,
  forceLogout,

  // Session
  isSessionValid,
  refreshSession,
  updateActivity,
  checkSessionTimeout,
  initSessionMonitoring,

  // Features
  getEnabledFeatures,
  isFeatureEnabled,

  // UI helpers
  shouldShowAdminMenu,
  shouldShowHostMenu,
  shouldShowUserMenu,
  shouldShowLoginButton,
  shouldShowUserProfile,
  getUserDisplayName,
  getUserAvatarUrl,

  // Validation
  validateAction,
  requireAuth,
  requireRole,
  requireAnyRole,
};
