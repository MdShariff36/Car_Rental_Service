/**
 * Loader Utility
 * Controls the loading overlay using existing markup
 *
 * Existing HTML Markup:
 * <div id="loader" class="loader-overlay" style="display: none">
 *   <div class="spinner"></div>
 *   <p>Loading...</p>
 * </div>
 *
 * Selectors Used:
 * - #loader: Main loader overlay container
 * - #loader p: Loading message text
 */

class Loader {
  constructor() {
    this.loaderElement = null;
    this.messageElement = null;
    this.init();
  }

  /**
   * Initialize loader by finding existing DOM elements
   */
  init() {
    this.loaderElement = document.getElementById("loader");
    if (this.loaderElement) {
      this.messageElement = this.loaderElement.querySelector("p");
    } else {
      console.warn(
        "Loader: #loader element not found in DOM. Loader will fail safely.",
      );
    }
  }

  /**
   * Show the loader with optional custom message
   * @param {string} message - Optional loading message (default: "Loading...")
   */
  show(message = "Loading...") {
    if (!this.loaderElement) {
      console.warn("Loader: Cannot show loader - element not found");
      return;
    }

    // Update message if provided and message element exists
    if (this.messageElement && message) {
      this.messageElement.textContent = message;
    }

    // Show loader
    this.loaderElement.style.display = "flex";

    // Prevent body scroll when loader is active
    document.body.style.overflow = "hidden";
  }

  /**
   * Hide the loader
   */
  hide() {
    if (!this.loaderElement) {
      console.warn("Loader: Cannot hide loader - element not found");
      return;
    }

    this.loaderElement.style.display = "none";

    // Restore body scroll
    document.body.style.overflow = "";
  }

  /**
   * Show loader for a specific duration
   * @param {number} duration - Duration in milliseconds
   * @param {string} message - Optional loading message
   * @returns {Promise} Resolves when loader is hidden
   */
  showFor(duration, message = "Loading...") {
    return new Promise((resolve) => {
      this.show(message);
      setTimeout(() => {
        this.hide();
        resolve();
      }, duration);
    });
  }

  /**
   * Wrap an async function with loader
   * @param {Function} asyncFn - Async function to execute
   * @param {string} message - Optional loading message
   * @returns {Promise} Result of the async function
   */
  async wrap(asyncFn, message = "Loading...") {
    if (!this.loaderElement) {
      console.warn(
        "Loader: Element not found, executing function without loader",
      );
      return await asyncFn();
    }

    try {
      this.show(message);
      const result = await asyncFn();
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.hide();
    }
  }

  /**
   * Update loader message while it's visible
   * @param {string} message - New message to display
   */
  updateMessage(message) {
    if (!this.messageElement) {
      console.warn("Loader: Cannot update message - message element not found");
      return;
    }

    this.messageElement.textContent = message;
  }

  /**
   * Check if loader is currently visible
   * @returns {boolean} True if loader is visible
   */
  isVisible() {
    if (!this.loaderElement) return false;
    return this.loaderElement.style.display !== "none";
  }
}

// Create singleton instance
const loader = new Loader();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = loader;
}

// Global access
if (typeof window !== "undefined") {
  window.loader = loader;
}
