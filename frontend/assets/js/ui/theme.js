// ============================================================================
// FILE: assets/js/ui/theme.js
// ============================================================================

/**
 * Theme Manager
 * Handle light/dark mode switching
 */

import Storage from "../base/storage.js";

const Theme = {
  currentTheme: "light",

  /**
   * Initialize theme
   */
  init() {
    // Get saved theme or use default
    this.currentTheme = Storage.get("theme_preference", "light");
    this.applyTheme(this.currentTheme);

    // Setup theme toggle button if exists
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggle());
    }
  },

  /**
   * Apply theme
   */
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    Storage.set("theme_preference", theme);
  },

  /**
   * Toggle theme
   */
  toggle() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  },

  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  },
};

export default Theme;
