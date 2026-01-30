// ============================================================================
// FILE: assets/js/base/helpers.js
// ============================================================================

/**
 * Utility Helper Functions
 * Common operations used across the application
 */

const Helpers = {
  /**
   * Safely query a DOM element
   */
  querySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.error(`Query selector error for "${selector}":`, error);
      return null;
    }
  },

  /**
   * Safely query multiple DOM elements
   */
  querySelectorAll(selector) {
    try {
      return Array.from(document.querySelectorAll(selector));
    } catch (error) {
      console.error(`Query selector all error for "${selector}":`, error);
      return [];
    }
  },

  /**
   * Format date to readable string
   */
  formatDate(date, format = "DD/MM/YYYY") {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return format.replace("DD", day).replace("MM", month).replace("YYYY", year);
  },

  /**
   * Format time to readable string
   */
  formatTime(time) {
    if (!time) return "";
    return time;
  },

  /**
   * Format currency
   */
  formatCurrency(amount, currency = "₹") {
    if (amount === null || amount === undefined) return "";
    return `${currency}${parseFloat(amount).toLocaleString("en-IN")}`;
  },

  /**
   * Calculate days between two dates
   */
  calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  /**
   * Debounce function calls
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function calls
   */
  throttle(func, limit = 100) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Get URL parameters
   */
  getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * Set URL parameter without page reload
   */
  setUrlParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, "", url);
  },

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(str) {
    const temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  },

  /**
   * Truncate text
   */
  truncate(str, length = 100) {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + "...";
  },

  /**
   * Copy to clipboard
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    }
  },

  /**
   * Scroll to element smoothly
   */
  scrollToElement(element, offset = 0) {
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Get today's date in YYYY-MM-DD format
   */
  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  /**
   * Validate phone number (Indian format)
   */
  isValidPhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
  },
};

export default Helpers;
