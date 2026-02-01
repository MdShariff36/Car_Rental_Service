// FILE: assets/js/components/sidebar-host.js

import { CONFIG } from "../base/config.js";

export const initHostSidebar = () => {
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

export const getHostSidebarItems = () => {
  return [
    {
      icon: "dashboard",
      label: "Dashboard",
      href: CONFIG.ROUTES.HOST_DASHBOARD,
    },
    {
      icon: "add-car",
      label: "Add Car",
      href: CONFIG.ROUTES.HOST_ADD_CAR,
    },
    {
      icon: "cars",
      label: "Manage Cars",
      href: CONFIG.ROUTES.HOST_MANAGE_CARS,
    },
    {
      icon: "earnings",
      label: "Earnings",
      href: CONFIG.ROUTES.HOST_EARNINGS,
    },
  ];
};
