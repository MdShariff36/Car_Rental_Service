// ============================================================================
// FILE: assets/js/pages/services.js
// ============================================================================

/**
 * Services Page
 * Display services information
 */

const ServicesPage = {
  init() {
    this.setupServiceCards();
  },

  setupServiceCards() {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
      card.addEventListener("click", () => {
        const serviceId = card.getAttribute("data-service-id");
        if (serviceId) {
          // Could open modal or navigate to detail page
          console.log("Service clicked:", serviceId);
        }
      });
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ServicesPage.init());
} else {
  ServicesPage.init();
}

export default ServicesPage;
