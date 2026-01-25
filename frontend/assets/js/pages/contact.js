// FILE: frontend/assets/js/pages/contact.js
import { submitContactMessage } from "../services/contact.service.js";

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
});

async function handleContactSubmit(event) {
  event.preventDefault();

  const submitBtn = event.target.querySelector("button[type='submit']");
  const originalText = submitBtn.innerText;

  try {
    // Collect form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value.trim(),
    };

    // Validate
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    // Show loading
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    // Submit to backend
    const response = await submitContactMessage(formData);

    // Show success
    alert(
      response.message ||
        "Message sent successfully! We'll get back to you soon.",
    );

    // Reset form
    event.target.reset();
  } catch (error) {
    console.error("Contact form error:", error);
    alert("Failed to send message. Please try again.");
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
}

export const init = () => {
  console.log("Contact page initialized");
};
