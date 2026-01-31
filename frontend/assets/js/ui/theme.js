/**
 * Theme Utility
 * Manages light/dark theme switching
 *
 * Expected HTML (optional - fails safely if not present):
 * <button id="theme-toggle" aria-label="Toggle theme">
 *   <span class="theme-icon">🌙</span>
 * </button>
 *
 * Selectors Used:
 * - #theme-toggle: Theme toggle button (optional)
 * - .theme-icon: Icon element inside toggle button (optional)
 *
 * Storage:
 * - localStorage.theme: Stores user's theme preference
 *
 * Classes Applied:
 * - .dark-theme: Applied to <html> element for dark mode
 * - .light-theme: Applied to <html> element for light mode
 */

class Theme {
  constructor() {
    this.toggleButton = null;
    this.iconElement = null;
    this.currentTheme = "light";
    this.storageKey = "theme";

    // Theme configurations
    this.themes = {
      light: {
        icon: "🌙",
        label: "Switch to dark mode",
        class: "light-theme",
      },
      dark: {
        icon: "☀️",
        label: "Switch to light mode",
        class: "dark-theme",
      },
    };

    this.init();
  }

  /**
   * Initialize theme system
   */
  init() {
    // Find toggle button (optional)
    this.toggleButton = document.getElementById("theme-toggle");

    if (this.toggleButton) {
      this.iconElement = this.toggleButton.querySelector(".theme-icon");
      this.setupToggleButton();
    } else {
      console.info(
        "Theme: #theme-toggle not found. Theme switching via UI disabled, but programmatic switching still works.",
      );
    }

    // Load saved theme or detect system preference
    this.loadTheme();
  }

  /**
   * Setup toggle button event listener
   */
  setupToggleButton() {
    if (!this.toggleButton) return;

    this.toggleButton.addEventListener("click", () => {
      this.toggle();
    });

    // Keyboard accessibility
    this.toggleButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Load theme from storage or system preference
   */
  loadTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      this.setTheme(savedTheme, false);
    } else {
      // Check system preference
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.setTheme(prefersDark ? "dark" : "light", false);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          // Only auto-switch if user hasn't set a preference
          if (!localStorage.getItem(this.storageKey)) {
            this.setTheme(e.matches ? "dark" : "light", false);
          }
        });
    }
  }

  /**
   * Set theme
   * @param {string} theme - 'light' or 'dark'
   * @param {boolean} save - Whether to save to localStorage (default: true)
   */
  setTheme(theme, save = true) {
    if (!this.themes[theme]) {
      console.warn(`Theme: Invalid theme "${theme}". Use "light" or "dark".`);
      return;
    }

    const html = document.documentElement;
    const oldTheme = this.currentTheme;
    this.currentTheme = theme;

    // Remove old theme class
    if (this.themes[oldTheme]) {
      html.classList.remove(this.themes[oldTheme].class);
    }

    // Add new theme class
    html.classList.add(this.themes[theme].class);

    // Update data attribute for CSS
    html.setAttribute("data-theme", theme);

    // Update toggle button
    this.updateToggleButton();

    // Save to localStorage
    if (save) {
      try {
        localStorage.setItem(this.storageKey, theme);
      } catch (error) {
        console.warn("Theme: Could not save theme to localStorage", error);
      }
    }

    // Dispatch custom event for other components
    this.dispatchThemeChangeEvent(theme, oldTheme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  /**
   * Update toggle button icon and label
   */
  updateToggleButton() {
    if (!this.toggleButton) return;

    const config = this.themes[this.currentTheme];

    // Update icon
    if (this.iconElement) {
      this.iconElement.textContent = config.icon;
    }

    // Update aria-label
    this.toggleButton.setAttribute("aria-label", config.label);
  }

  /**
   * Get current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Check if dark mode is active
   * @returns {boolean} True if dark mode is active
   */
  isDark() {
    return this.currentTheme === "dark";
  }

  /**
   * Check if light mode is active
   * @returns {boolean} True if light mode is active
   */
  isLight() {
    return this.currentTheme === "light";
  }

  /**
   * Dispatch theme change event
   * @param {string} newTheme - New theme
   * @param {string} oldTheme - Previous theme
   */
  dispatchThemeChangeEvent(newTheme, oldTheme) {
    const event = new CustomEvent("themechange", {
      detail: {
        theme: newTheme,
        previousTheme: oldTheme,
        isDark: newTheme === "dark",
        isLight: newTheme === "light",
      },
    });

    window.dispatchEvent(event);
  }

  /**
   * Reset theme to system preference
   */
  resetToSystemPreference() {
    localStorage.removeItem(this.storageKey);
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.setTheme(prefersDark ? "dark" : "light", false);
  }

  /**
   * Add event listener for theme changes
   * @param {Function} callback - Callback function receiving theme details
   */
  onChange(callback) {
    if (typeof callback !== "function") {
      console.warn("Theme: onChange callback must be a function");
      return;
    }

    window.addEventListener("themechange", (e) => {
      callback(e.detail);
    });
  }
}

// Create singleton instance
const theme = new Theme();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = theme;
}

// Global access
if (typeof window !== "undefined") {
  window.theme = theme;
}
