// FILE: assets/js/pages/newsletter.js

import { storage } from "../base/storage.js";
import {
  validateEmail,
  showFieldError,
  showFieldSuccess,
} from "../base/validators.js";
import { showNotification } from "../ui/notifications.js";

export const initNewsletter = () => {
  setupNewsletterForm();
  displayStats();
};

const setupNewsletterForm = () => {
  const form = document.querySelector("#newsletter-signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector("#email");
    const email = emailInput?.value;

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      showFieldError("email", emailValidation.message);
      return;
    }

    showFieldSuccess("email");

    const button = form.querySelector('button[type="submit"]');
    const originalText = button?.textContent;
    if (button) button.textContent = "Subscribing...";

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const subscribers = storage.get("newsletter_subscribers", []);

      if (subscribers.includes(email)) {
        showNotification("You are already subscribed!", "info");
      } else {
        subscribers.push(email);
        storage.set("newsletter_subscribers", subscribers);
        showNotification("Thank you for subscribing!", "success");
        form.reset();
      }

      displayStats();
    } catch (error) {
      showNotification("Failed to subscribe. Please try again.", "error");
    } finally {
      if (button && originalText) {
        button.textContent = originalText;
      }
    }
  });
};

const displayStats = () => {
  const statsEl = document.querySelector("#newsletter-stats");
  if (!statsEl) return;

  const subscribers = storage.get("newsletter_subscribers", []);

  statsEl.innerHTML = `
    <div class="stat-card">
      <h3>${subscribers.length}</h3>
      <p>Total Subscribers</p>
    </div>
  `;
};
