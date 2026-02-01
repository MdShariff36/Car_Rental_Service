// Forgot Password JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const resetForm = document.getElementById("resetForm");
  const emailInput = document.getElementById("email");
  const emailFormSection = document.getElementById("emailForm");
  const successSection = document.getElementById("successMessage");
  const sentEmailSpan = document.getElementById("sentEmail");
  const resendLink = document.getElementById("resendLink");
  const tryAgainBtn = document.getElementById("tryAgainBtn");

  // Form submission
  resetForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
      showNotification("Please enter your email address", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      emailInput.focus();
      return;
    }

    // Show loading state
    const submitBtn = resetForm.querySelector(".submit-btn");
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Success - show success message
      emailFormSection.style.display = "none";
      successSection.style.display = "block";
      sentEmailSpan.textContent = email;

      // Reset button
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;

      showNotification("Password reset link sent successfully!", "success");
    }, 1500);
  });

  // Resend link functionality
  if (resendLink) {
    resendLink.addEventListener("click", function (e) {
      e.preventDefault();

      const email = sentEmailSpan.textContent;

      // Show loading notification
      showNotification("Resending email...", "info");

      // Simulate resend
      setTimeout(() => {
        showNotification("Email resent successfully!", "success");
      }, 1500);
    });
  }

  // Try again button
  if (tryAgainBtn) {
    tryAgainBtn.addEventListener("click", function () {
      successSection.style.display = "none";
      emailFormSection.style.display = "block";
      emailInput.value = "";
      emailInput.focus();
    });
  }

  // Input focus effect
  emailInput.addEventListener("focus", function () {
    this.parentElement.classList.add("focused");
  });

  emailInput.addEventListener("blur", function () {
    this.parentElement.classList.remove("focused");
  });

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Notification helper
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

    if (!document.querySelector("#notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
                .notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                }

                .notification-success {
                    border-left: 4px solid #10B981;
                }

                .notification-error {
                    border-left: 4px solid #EF4444;
                }

                .notification-info {
                    border-left: 4px solid #0066FF;
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .notification-icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-weight: bold;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .notification-success .notification-icon {
                    background: #D1FAE5;
                    color: #10B981;
                }

                .notification-error .notification-icon {
                    background: #FEE2E2;
                    color: #EF4444;
                }

                .notification-info .notification-icon {
                    background: #DBEAFE;
                    color: #0066FF;
                }

                .notification-message {
                    color: #0F172A;
                    font-weight: 500;
                    font-size: 0.95rem;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                @media (max-width: 480px) {
                    .notification {
                        top: 1rem;
                        right: 1rem;
                        left: 1rem;
                        max-width: none;
                    }
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }

  // Auto-focus on email input
  emailInput.focus();
});
