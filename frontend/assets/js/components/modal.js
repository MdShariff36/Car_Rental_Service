// ============================================================================
// FILE: assets/js/components/modal.js
// ============================================================================

/**
 * Modal Component
 * Reusable modal dialog handler
 */

const Modal = {
  /**
   * Open modal
   */
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Setup close handlers
    this.setupCloseHandlers(modal);
  },

  /**
   * Close modal
   */
  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove("active");
    document.body.style.overflow = "";
  },

  /**
   * Setup close handlers for modal
   */
  setupCloseHandlers(modal) {
    // Close button
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.close(modal.id);
      });
    }

    // Backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.close(modal.id);
      }
    });

    // ESC key
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        this.close(modal.id);
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);
  },
};

export default Modal;
