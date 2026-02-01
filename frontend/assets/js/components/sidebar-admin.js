// FILE: assets/js/components/sidebar-admin.js

import { CONFIG } from "../base/config.js";

export const initAdminSidebar = () => {
  highlightActiveLink();
  setupMobileSidebar();
  setupCollapsibleMenus();
};

const highlightActiveLink = () => {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".sidebar-nav a");

  links.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");

      const parentMenu = link.closest(".submenu");
      if (parentMenu) {
        const toggle = parentMenu.previousElementSibling;
        toggle?.classList.add("active");
        parentMenu.style.display = "block";
      }
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

  const sidebarLinks = sidebar.querySelectorAll("a:not([data-submenu-toggle])");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        sidebar.classList.remove("show");
        overlay?.classList.remove("show");
      }
    });
  });
};

const setupCollapsibleMenus = () => {
  const toggles = document.querySelectorAll("[data-submenu-toggle]");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const submenu = toggle.nextElementSibling;

      if (submenu) {
        const isOpen = submenu.style.display === "block";
        submenu.style.display = isOpen ? "none" : "block";
        toggle.classList.toggle("active");
      }
    });
  });
};

export const getAdminSidebarItems = () => {
  return [
    {
      icon: "dashboard",
      label: "Dashboard",
      href: CONFIG.ROUTES.ADMIN_DASHBOARD,
    },
    {
      icon: "bookings",
      label: "Bookings",
      href: CONFIG.ROUTES.ADMIN_BOOKINGS,
    },
    {
      icon: "cars",
      label: "Cars",
      submenu: [
        { label: "All Cars", href: CONFIG.ROUTES.ADMIN_CARS },
        { label: "Add Car", href: CONFIG.ROUTES.ADMIN_ADD_CAR },
      ],
    },
    {
      icon: "users",
      label: "Users",
      href: CONFIG.ROUTES.ADMIN_USERS,
    },
    {
      icon: "reports",
      label: "Reports",
      href: CONFIG.ROUTES.ADMIN_REPORTS,
    },
    {
      icon: "settings",
      label: "Settings",
      href: CONFIG.ROUTES.ADMIN_SETTINGS,
    },
  ];
};
