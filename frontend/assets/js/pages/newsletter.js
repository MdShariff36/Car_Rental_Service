// FILE: assets/js/pages/newsletter.js

document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const submitBtn = newsletterForm.querySelector(".submit-btn");

  newsletterForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      showNotification("Please enter your email address", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    setLoadingState(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Subscription failed");
      }

      showNotification("Successfully subscribed to newsletter!", "success");
      newsletterForm.reset();
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      showNotification(error.message || "Subscription failed", "error");
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
      submitBtn.innerHTML = '<span class="btn-text">Subscribing...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Subscribe</span>';
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
