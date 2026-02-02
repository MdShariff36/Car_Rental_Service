// FILE: assets/js/user/profile.js

document.addEventListener("DOMContentLoaded", async function () {
  const profileForm = document.getElementById("profileForm");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const submitBtn = profileForm.querySelector(".submit-btn");

  // Load current profile
  await loadProfile();

  profileForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const userData = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
    };

    // Validation
    if (!userData.firstName || !userData.lastName) {
      showNotification("Name fields are required", "error");
      return;
    }

    setLoadingState(true);

    try {
      await UserService.updateProfile(userData);
      showNotification("Profile updated successfully", "success");
    } catch (error) {
      console.error("Update profile error:", error);
      showNotification(error.message || "Failed to update profile", "error");
    } finally {
      setLoadingState(false);
    }
  });

  async function loadProfile() {
    showLoader();
    try {
      const user = await UserService.getProfile();

      firstNameInput.value = user.firstName || "";
      lastNameInput.value = user.lastName || "";
      emailInput.value = user.email || "";
      phoneInput.value = user.phone || "";
      addressInput.value = user.address || "";

      // Email is typically read-only
      emailInput.disabled = true;
    } catch (error) {
      console.error("Load profile error:", error);
      showNotification("Failed to load profile", "error");
    } finally {
      hideLoader();
    }
  }

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Saving...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Save Changes</span>';
    }
  }

  function showLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "flex";
  }

  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "none";
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
