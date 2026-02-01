// FILE: assets/js/components/header.js

import { isAuthenticated, getUserRole, logout } from "../core/auth-guard.js";
import { CONFIG } from "../base/config.js";
import { storage } from "../base/storage.js";

export const initHeader = () => {
  updateHeaderAuth();
  updateMobileMenu();
  updateCartCount();

  document.addEventListener("click", handleHeaderClicks);
};

const updateHeaderAuth = () => {
  const authLinks = document.querySelector(".auth-links");
  const userMenu = document.querySelector(".user-menu");

  if (!authLinks || !userMenu) return;

  if (isAuthenticated()) {
    authLinks.style.display = "none";
    userMenu.style.display = "block";

    const user = storage.getUser();
    const userName = userMenu.querySelector(".user-name");
    if (userName && user) {
      userName.textContent = user.name || user.email;
    }

    updateUserMenuLinks();
  } else {
    authLinks.style.display = "block";
    userMenu.style.display = "none";
  }
};

const updateUserMenuLinks = () => {
  const role = getUserRole();
  const dashboardLink = document.querySelector("[data-dashboard-link]");

  if (!dashboardLink) return;

  if (role === CONFIG.AUTH.ROLES.ADMIN) {
    dashboardLink.href = CONFIG.ROUTES.ADMIN_DASHBOARD;
  } else if (role === CONFIG.AUTH.ROLES.HOST) {
    dashboardLink.href = CONFIG.ROUTES.HOST_DASHBOARD;
  } else {
    dashboardLink.href = CONFIG.ROUTES.USER_DASHBOARD;
  }
};

const updateMobileMenu = () => {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu?.classList.toggle("active");
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      mobileMenu?.classList.remove("active");
    });
  });
};

const updateCartCount = () => {
  const cart = storage.getCart();
  const cartBadge = document.querySelector(".cart-badge");

  if (cartBadge) {
    const count = cart?.length || 0;
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? "block" : "none";
  }
};

const handleHeaderClicks = (e) => {
  const logoutBtn = e.target.closest("[data-logout]");
  if (logoutBtn) {
    e.preventDefault();
    handleLogout();
  }

  const userMenuToggle = e.target.closest(".user-menu-toggle");
  if (userMenuToggle) {
    e.preventDefault();
    const dropdown = userMenuToggle.nextElementSibling;
    dropdown?.classList.toggle("show");
  }

  if (!e.target.closest(".user-menu")) {
    document.querySelectorAll(".user-menu .dropdown").forEach((dd) => {
      dd.classList.remove("show");
    });
  }
};

const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    logout();
  }
};

export const updateHeader = () => {
  updateHeaderAuth();
  updateCartCount();
};
