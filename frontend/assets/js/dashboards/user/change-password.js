// FILE: assets/js/user/change-password.js

document.addEventListener("DOMContentLoaded", function () {
  const changePasswordForm = document.getElementById("changePasswordForm");
  const currentPasswordInput = document.getElementById("currentPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const submitBtn = changePasswordForm.querySelector(".submit-btn");

  changePasswordForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification("All fields are required", "error");
      return;
    }

    if (newPassword.length < 8) {
      showNotification("New password must be at least 8 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("New passwords do not match", "error");
      return;
    }

    if (currentPassword === newPassword) {
      showNotification(
        "New password must be different from current password",
        "error",
      );
      return;
    }

    setLoadingState(true);

    try {
      await UserService.changePassword(currentPassword, newPassword);
      showNotification("Password changed successfully", "success");

      // Clear form
      changePasswordForm.reset();

      // Optional: Logout and redirect to login
      setTimeout(() => {
        AuthService.logout();
      }, 2000);
    } catch (error) {
      console.error("Change password error:", error);
      showNotification(error.message || "Failed to change password", "error");
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Changing...</span>';
      currentPasswordInput.disabled = true;
      newPasswordInput.disabled = true;
      confirmPasswordInput.disabled = true;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Change Password</span>';
      currentPasswordInput.disabled = false;
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
