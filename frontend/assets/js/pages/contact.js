// ============================================================================
// AUTO PRIME RENTAL - SIMPLE PAGES & AUTH
// Contact, FAQ, Terms, Privacy, and Authentication pages
// ============================================================================

// ============================================================================
// FILE: assets/js/pages/contact.js
// ============================================================================

/**
 * Contact Page
 * Contact form submission
 */

import Validators from "../base/validators.js";
import API from "../core/api.js";
import Loader from "../ui/loader.js";
import Notifications from "../ui/notifications.js";

const ContactPage = {
  init() {
    this.setupContactForm();
  },

  setupContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value;
      const email = document.getElementById("email")?.value;
      const phone = document.getElementById("phone")?.value;
      const subject = document.getElementById("subject")?.value;
      const message = document.getElementById("message")?.value;

      // Validate
      const nameValidation = Validators.required(name, "Name");
      if (!nameValidation.valid) {
        Notifications.error(nameValidation.message);
        return;
      }

      const emailValidation = Validators.email(email);
      if (!emailValidation.valid) {
        Notifications.error(emailValidation.message);
        return;
      }

      if (phone) {
        const phoneValidation = Validators.phone(phone);
        if (!phoneValidation.valid) {
          Notifications.error(phoneValidation.message);
          return;
        }
      }

      const messageValidation = Validators.required(message, "Message");
      if (!messageValidation.valid) {
        Notifications.error(messageValidation.message);
        return;
      }

      // Submit
      await this.submitContact({ name, email, phone, subject, message });
    });
  },

  async submitContact(data) {
    Loader.show("Sending message...");

    try {
      const response = await API.post("/contact", data);

      Loader.hide();

      if (response.success) {
        Notifications.success(
          "Message sent successfully! We will get back to you soon.",
        );

        const form = document.getElementById("contactForm");
        if (form) form.reset();
      } else {
        Notifications.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error sending message");
      console.error("Contact error:", error);
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ContactPage.init());
} else {
  ContactPage.init();
}

export default ContactPage;
