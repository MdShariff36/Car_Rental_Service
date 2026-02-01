// Register Form JavaScript

document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1;
  const totalSteps = 3;

  // Get elements
  const form = document.getElementById("registerForm");
  const steps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll(".progress-step");
  const progressLines = document.querySelectorAll(".progress-line");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  // Password toggle functionality
  const toggleButtons = document.querySelectorAll(".toggle-password");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);
    });
  });

  // Password strength checker
  passwordInput.addEventListener("input", function () {
    checkPasswordStrength(this.value);
    checkPasswordRequirements(this.value);
  });

  function checkPasswordStrength(password) {
    const strengthBars = document.querySelectorAll(".strength-bar");
    const strengthText = document.querySelector(".strength-text");
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;

    // Reset bars
    strengthBars.forEach((bar) => {
      bar.classList.remove("active", "medium", "strong");
    });

    // Update bars and text
    for (let i = 0; i < strength; i++) {
      strengthBars[i].classList.add("active");
      if (strength >= 3) {
        strengthBars[i].classList.add("strong");
      } else if (strength >= 2) {
        strengthBars[i].classList.add("medium");
      }
    }

    const strengthLevels = ["Weak", "Fair", "Good", "Strong"];
    strengthText.textContent = strengthLevels[strength - 1] || "Weak";

    if (strength >= 3) {
      strengthText.style.color = "var(--success)";
    } else if (strength >= 2) {
      strengthText.style.color = "var(--warning)";
    } else {
      strengthText.style.color = "var(--error)";
    }
  }

  function checkPasswordRequirements(password) {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };

    Object.keys(requirements).forEach((req) => {
      const element = document.querySelector(`[data-req="${req}"]`);
      if (requirements[req]) {
        element.classList.add("valid");
      } else {
        element.classList.remove("valid");
      }
    });
  }

  // Navigation functions
  function showStep(step) {
    steps.forEach((s, index) => {
      s.classList.remove("active");
      if (index + 1 === step) {
        s.classList.add("active");
      }
    });

    progressSteps.forEach((s, index) => {
      s.classList.remove("active", "completed");
      if (index + 1 === step) {
        s.classList.add("active");
      } else if (index + 1 < step) {
        s.classList.add("completed");
      }
    });

    progressLines.forEach((line, index) => {
      line.classList.remove("completed");
      if (index + 1 < step) {
        line.classList.add("completed");
      }
    });

    // Update button visibility
    prevBtn.style.display = step === 1 ? "none" : "flex";
    nextBtn.style.display = step === totalSteps ? "none" : "flex";
    submitBtn.style.display = step === totalSteps ? "flex" : "none";
  }

  function validateStep(step) {
    const currentStepElement = document.querySelector(
      `.form-step[data-step="${step}"]`,
    );
    const inputs = currentStepElement.querySelectorAll(
      "input[required], select[required], textarea[required]",
    );
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "var(--error)";
        setTimeout(() => {
          input.style.borderColor = "";
        }, 2000);
      } else if (input.type === "email" && !isValidEmail(input.value)) {
        isValid = false;
        showNotification("Please enter a valid email address", "error");
        input.style.borderColor = "var(--error)";
      }
    });

    // Special validation for step 1
    if (step === 1) {
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (password !== confirmPassword) {
        isValid = false;
        showNotification("Passwords do not match", "error");
        confirmPasswordInput.style.borderColor = "var(--error)";
      }

      if (password.length < 8) {
        isValid = false;
        showNotification("Password must be at least 8 characters", "error");
        passwordInput.style.borderColor = "var(--error)";
      }
    }

    // Special validation for step 3
    if (step === 3) {
      const acceptTerms = document.getElementById("acceptTerms");
      if (!acceptTerms.checked) {
        isValid = false;
        showNotification("You must accept the Terms & Conditions", "error");
      }
    }

    return isValid;
  }

  // Event listeners
  nextBtn.addEventListener("click", function () {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    }
  });

  prevBtn.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    // Show loading state
    submitBtn.innerHTML = '<span class="btn-text">Creating Account...</span>';
    submitBtn.disabled = true;

    // Collect form data
    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      password: passwordInput.value,
      phone: document.getElementById("phone").value,
      dateOfBirth: document.getElementById("dateOfBirth").value,
      gender: document.getElementById("gender").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      pincode: document.getElementById("pincode").value,
      licenseNumber: document.getElementById("licenseNumber").value,
      licenseExpiry: document.getElementById("licenseExpiry").value,
      accountType: document.querySelector('input[name="accountType"]:checked')
        .value,
      newsletter: document.getElementById("newsletter").checked,
    };

    // Simulate API call
    setTimeout(() => {
      console.log("Form Data:", formData);
      showNotification(
        "Account created successfully! Redirecting...",
        "success",
      );

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    }, 2000);
  });

  // Helper functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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

  // Initialize
  showStep(currentStep);
});
