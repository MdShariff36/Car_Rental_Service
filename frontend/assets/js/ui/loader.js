// ============================================================================
// FILE: assets/js/ui/loader.js
// ============================================================================

/**
 * Loading Overlay Manager
 * Shows/hides loading spinner
 */

const Loader = {
  loaderElement: null,

  /**
   * Initialize loader
   */
  init() {
    this.loaderElement = document.getElementById("loader");
  },

  /**
   * Show loader
   */
  show(message = "Loading...") {
    if (!this.loaderElement) this.init();

    if (this.loaderElement) {
      const textElement = this.loaderElement.querySelector("p");
      if (textElement) {
        textElement.textContent = message;
      }
      this.loaderElement.style.display = "flex";
    }
  },

  /**
   * Hide loader
   */
  hide() {
    if (!this.loaderElement) this.init();

    if (this.loaderElement) {
      this.loaderElement.style.display = "none";
    }
  },
};

export default Loader;
