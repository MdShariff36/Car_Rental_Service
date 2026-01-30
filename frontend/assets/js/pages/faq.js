// ============================================================================
// FILE: assets/js/pages/faq.js
// ============================================================================

/**
 * FAQ Page
 * Accordion functionality and search
 */

const FAQPage = {
  init() {
    this.setupAccordion();
    this.setupSearch();
  },

  setupAccordion() {
    const accordionButtons = document.querySelectorAll(".faq-question");

    accordionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains("active");

        // Close all other items
        document.querySelectorAll(".faq-item").forEach((item) => {
          item.classList.remove("active");
        });

        // Toggle current item
        if (!isActive) {
          faqItem.classList.add("active");
        }
      });
    });
  },

  setupSearch() {
    const searchInput = document.getElementById("faqSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const faqItems = document.querySelectorAll(".faq-item");

      faqItems.forEach((item) => {
        const question = item
          .querySelector(".faq-question")
          ?.textContent.toLowerCase();
        const answer = item
          .querySelector(".faq-answer")
          ?.textContent.toLowerCase();

        if (question?.includes(searchTerm) || answer?.includes(searchTerm)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => FAQPage.init());
} else {
  FAQPage.init();
}

export default FAQPage;
