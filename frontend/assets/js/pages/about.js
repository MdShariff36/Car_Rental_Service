// ============================================================================
// FILE: assets/js/pages/about.js
// ============================================================================

/**
 * About Page
 * Simple page with minimal JavaScript
 */

const AboutPage = {
  init() {
    // Setup any animations or interactions
    this.setupTeamCards();
  },

  setupTeamCards() {
    const teamCards = document.querySelectorAll(".team-card");

    teamCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => AboutPage.init());
} else {
  AboutPage.init();
}

export default AboutPage;
