// FILE: assets/js/pages/contact.js

import { showNotification } from "../ui/notifications.js";
import {
  validateEmail,
  validateRequired,
  showFieldError,
  showFieldSuccess,
  clearFormValidation,
} from "../base/validators.js";

export const initContact = () => {
  setupContactForm();
  initMap();
};

const setupContactForm = () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormValidation("contact-form");

    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    let isValid = true;

    const nameValidation = validateRequired(data.name, "Name");
    if (!nameValidation.valid) {
      showFieldError("name", nameValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("name");
    }

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      showFieldError("email", emailValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("email");
    }

    const messageValidation = validateRequired(data.message, "Message");
    if (!messageValidation.valid) {
      showFieldError("message", messageValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("message");
    }

    if (!isValid) return;

    const button = form.querySelector('button[type="submit"]');
    const originalText = button?.textContent;
    if (button) button.textContent = "Sending...";

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification(
        "Message sent successfully! We will get back to you soon.",
        "success",
      );
      form.reset();
      clearFormValidation("contact-form");
    } catch (error) {
      showNotification("Failed to send message. Please try again.", "error");
    } finally {
      if (button && originalText) {
        button.textContent = originalText;
      }
    }
  });
};

const initMap = () => {
  const mapContainer = document.querySelector("#contact-map");
  if (!mapContainer) return;

  mapContainer.innerHTML = `
    <div class="map-placeholder">
      <p>Map Location</p>
      <small>123 Car Rental Street, City, Country</small>
    </div>
  `;
};
