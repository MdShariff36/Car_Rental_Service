// FILE: assets/js/ui/theme.js

import { storage } from "../base/storage.js";

export const initTheme = () => {
  const savedTheme = storage.getTheme();
  applyTheme(savedTheme);
  setupThemeToggle();
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon(theme);
};

const setupThemeToggle = () => {
  const toggleBtn = document.querySelector("#theme-toggle");

  toggleBtn?.addEventListener("click", () => {
    const currentTheme = storage.getTheme();
    const newTheme = currentTheme === "light" ? "dark" : "light";

    storage.setTheme(newTheme);
    applyTheme(newTheme);
  });
};

const updateThemeIcon = (theme) => {
  const icon = document.querySelector("#theme-icon");
  if (!icon) return;

  icon.textContent = theme === "light" ? "🌙" : "☀️";
};

export const getTheme = () => {
  return storage.getTheme();
};

export const setTheme = (theme) => {
  storage.setTheme(theme);
  applyTheme(theme);
};

export const toggleTheme = () => {
  const currentTheme = storage.getTheme();
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
};
