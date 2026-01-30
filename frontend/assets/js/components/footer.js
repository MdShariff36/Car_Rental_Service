// ============================================================================
// FILE: assets/js/components/footer.js
// ============================================================================

/**
 * Footer Component
 * Handles footer functionality
 */

const Footer = {
  /**
   * Initialize footer
   */
  init() {
    this.setupNewsletterForm();
    this.updateYear();
  },

  /**
   * Setup newsletter subscription form
   */
  setupNewsletterForm() {
    const newsletterForm = document.getElementById("newsletterForm");

    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput?.value;

      if (!email) return;

      // TODO: Implement newsletter subscription API call
      console.log("Newsletter subscription:", email);

      // Show success message
      if (window.Notifications) {
        window.Notifications.success("Successfully subscribed to newsletter!");
      }

      newsletterForm.reset();
    });
  },

  /**
   * Update copyright year
   */
  updateYear() {
    const yearElement = document.getElementById("currentYear");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  },
};

export default Footer;
