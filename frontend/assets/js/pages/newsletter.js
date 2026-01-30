// ============================================================================
// FILE: assets/js/pages/newsletter.js
// ============================================================================

/**
 * Newsletter Page
 * Newsletter subscription management
 */

import API from "../core/api.js";
import Validators from "../base/validators.js";
import Notifications from "../ui/notifications.js";
import Loader from "../ui/loader.js";

const NewsletterPage = {
  init() {
    this.setupSubscribeForm();
    this.setupUnsubscribeForm();
  },

  setupSubscribeForm() {
    const subscribeForm = document.getElementById("subscribeForm");

    if (!subscribeForm) return;

    subscribeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email")?.value;

      const validation = Validators.email(email);
      if (!validation.valid) {
        Notifications.error(validation.message);
        return;
      }

      await this.subscribe(email);
    });
  },

  setupUnsubscribeForm() {
    const unsubscribeForm = document.getElementById("unsubscribeForm");

    if (!unsubscribeForm) return;

    unsubscribeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("unsubscribeEmail")?.value;

      const validation = Validators.email(email);
      if (!validation.valid) {
        Notifications.error(validation.message);
        return;
      }

      await this.unsubscribe(email);
    });
  },

  async subscribe(email) {
    Loader.show("Subscribing...");

    try {
      const response = await API.post("/newsletter/subscribe", { email });

      Loader.hide();

      if (response.success) {
        Notifications.success("Successfully subscribed to newsletter!");
        document.getElementById("subscribeForm")?.reset();
      } else {
        Notifications.error("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error subscribing");
    }
  },

  async unsubscribe(email) {
    Loader.show("Unsubscribing...");

    try {
      const response = await API.post("/newsletter/unsubscribe", { email });

      Loader.hide();

      if (response.success) {
        Notifications.success("Successfully unsubscribed from newsletter");
        document.getElementById("unsubscribeForm")?.reset();
      } else {
        Notifications.error("Failed to unsubscribe. Please try again.");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error unsubscribing");
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => NewsletterPage.init());
} else {
  NewsletterPage.init();
}

export default NewsletterPage;
