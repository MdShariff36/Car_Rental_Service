// FILE: assets/js/components/sidebar-user.js

import { CONFIG } from "../base/config.js";

export const initUserSidebar = () => {
  highlightActiveLink();
  setupMobileSidebar();
};

const highlightActiveLink = () => {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".sidebar-nav a");

  links.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
};

const setupMobileSidebar = () => {
  const toggleBtn = document.querySelector("[data-sidebar-toggle]");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
    overlay?.classList.toggle("show");
  });

  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  });

  const sidebarLinks = sidebar.querySelectorAll("a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        sidebar.classList.remove("show");
        overlay?.classList.remove("show");
      }
    });
  });
};

export const getUserSidebarItems = () => {
  return [
    {
      icon: "dashboard",
      label: "Dashboard",
      href: CONFIG.ROUTES.USER_DASHBOARD,
    },
    {
      icon: "bookings",
      label: "My Bookings",
      href: CONFIG.ROUTES.USER_BOOKINGS,
    },
    {
      icon: "payments",
      label: "Payments",
      href: CONFIG.ROUTES.USER_PAYMENTS,
    },
    {
      icon: "wishlist",
      label: "Wishlist",
      href: CONFIG.ROUTES.USER_WISHLIST,
    },
    {
      icon: "profile",
      label: "Profile",
      href: CONFIG.ROUTES.USER_PROFILE,
    },
  ];
};
