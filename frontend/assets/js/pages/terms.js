// ============================================================================
// FILE: assets/js/pages/terms.js
// ============================================================================

/**
 * Terms & Conditions Page
 * Simple content page
 */

const TermsPage = {
  init() {
    // Could add table of contents navigation, etc.
    console.log("Terms page loaded");
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => TermsPage.init());
} else {
  TermsPage.init();
}

export default TermsPage;
