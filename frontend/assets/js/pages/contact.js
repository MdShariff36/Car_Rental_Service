// FILE: assets/js/pages/contact.js

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const submitBtn = contactForm.querySelector(".submit-btn");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim(),
    };

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(formData.email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    setLoadingState(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/support/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      showNotification(
        "Message sent successfully. We will get back to you soon!",
        "success",
      );
      contactForm.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      showNotification(error.message || "Failed to send message", "error");
    } finally {
      setLoadingState(false);
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Send Message</span>';
    }
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
});
