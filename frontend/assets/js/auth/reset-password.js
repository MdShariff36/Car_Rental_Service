// FILE: assets/js/auth/reset-password.js

document.addEventListener("DOMContentLoaded", function () {
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const submitBtn = resetPasswordForm.querySelector(".submit-btn");

  // Get reset token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("token");

  if (!resetToken) {
    showNotification("Invalid or missing reset token", "error");
    setTimeout(() => (window.location.href = "/forgot-password.html"), 2000);
    return;
  }

  resetPasswordForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (!newPassword || !confirmPassword) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (newPassword.length < 8) {
      showNotification("Password must be at least 8 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    setLoadingState(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            newPassword: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      showNotification("Password reset successfully", "success");
      setTimeout(() => (window.location.href = "/login.html"), 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      showNotification(error.message || "Failed to reset password", "error");
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Resetting...</span>';
      newPasswordInput.disabled = true;
      confirmPasswordInput.disabled = true;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Reset Password</span>';
      newPasswordInput.disabled = false;
      confirmPasswordInput.disabled = false;
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
