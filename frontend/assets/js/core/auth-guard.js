// FILE: assets/js/core/auth-guard.js

import { storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

export const isAuthenticated = () => {
  const token = storage.getToken();
  const user = storage.getUser();
  return !!(token && user);
};

export const getUserRole = () => {
  const user = storage.getUser();
  return user?.role || null;
};

export const requireAuth = (allowedRoles = []) => {
  if (!isAuthenticated()) {
    window.location.href = CONFIG.ROUTES.LOGIN;
    return false;
  }

  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      window.location.href = CONFIG.ROUTES.HOME;
      return false;
    }
  }

  return true;
};

export const requireGuest = () => {
  if (isAuthenticated()) {
    const role = getUserRole();
    if (role === CONFIG.AUTH.ROLES.ADMIN) {
      window.location.href = CONFIG.ROUTES.ADMIN_DASHBOARD;
    } else if (role === CONFIG.AUTH.ROLES.HOST) {
      window.location.href = CONFIG.ROUTES.HOST_DASHBOARD;
    } else {
      window.location.href = CONFIG.ROUTES.USER_DASHBOARD;
    }
    return false;
  }
  return true;
};

export const requireAdmin = () => {
  return requireAuth([CONFIG.AUTH.ROLES.ADMIN]);
};

export const requireHost = () => {
  return requireAuth([CONFIG.AUTH.ROLES.HOST]);
};

export const requireUser = () => {
  return requireAuth([CONFIG.AUTH.ROLES.USER]);
};

export const canAccessRoute = (route) => {
  const publicRoutes = [
    CONFIG.ROUTES.HOME,
    CONFIG.ROUTES.ABOUT,
    CONFIG.ROUTES.SERVICES,
    CONFIG.ROUTES.CARS,
    CONFIG.ROUTES.CAR_DETAILS,
    CONFIG.ROUTES.CONTACT,
    CONFIG.ROUTES.FAQ,
    CONFIG.ROUTES.TERMS,
    CONFIG.ROUTES.PRIVACY,
    CONFIG.ROUTES.LOGIN,
    CONFIG.ROUTES.REGISTER,
  ];

  if (publicRoutes.includes(route)) {
    return true;
  }

  if (!isAuthenticated()) {
    return false;
  }

  const role = getUserRole();
  const routePath = route.split("/")[1];

  if (routePath === "admin" && role !== CONFIG.AUTH.ROLES.ADMIN) {
    return false;
  }

  if (routePath === "host" && role !== CONFIG.AUTH.ROLES.HOST) {
    return false;
  }

  if (routePath === "user" && role !== CONFIG.AUTH.ROLES.USER) {
    return false;
  }

  return true;
};

export const redirectToDashboard = () => {
  const role = getUserRole();

  if (role === CONFIG.AUTH.ROLES.ADMIN) {
    window.location.href = CONFIG.ROUTES.ADMIN_DASHBOARD;
  } else if (role === CONFIG.AUTH.ROLES.HOST) {
    window.location.href = CONFIG.ROUTES.HOST_DASHBOARD;
  } else {
    window.location.href = CONFIG.ROUTES.USER_DASHBOARD;
  }
};

export const logout = () => {
  storage.removeToken();
  storage.removeUser();
  storage.removeCart();
  window.location.href = CONFIG.ROUTES.HOME;
};
