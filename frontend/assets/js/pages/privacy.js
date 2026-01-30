// ============================================================================
// FILE: assets/js/pages/privacy.js
// ============================================================================

/**
 * Privacy Policy Page
 * Simple content page
 */

const PrivacyPage = {
  init() {
    console.log("Privacy page loaded");
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => PrivacyPage.init());
} else {
  PrivacyPage.init();
}

export default PrivacyPage;
