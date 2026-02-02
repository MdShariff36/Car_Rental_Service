// FILE: assets/js/admin/settings.js

document.addEventListener("DOMContentLoaded", async function () {
  const settingsForm = document.getElementById("settingsForm");
  const submitBtn = settingsForm
    ? settingsForm.querySelector(".submit-btn")
    : null;

  await loadSettings();

  if (settingsForm) {
    settingsForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      await saveSettings();
    });
  }

  async function loadSettings() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/admin/settings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load settings");
      }

      const settings = await response.json();
      populateSettings(settings);
    } catch (error) {
      console.error("Load settings error:", error);
      showNotification("Failed to load settings", "error");
    } finally {
      hideLoader();
    }
  }

  function populateSettings(settings) {
    const commissionRateInput = document.getElementById("commissionRate");
    if (commissionRateInput && settings.commissionRate !== undefined) {
      commissionRateInput.value = settings.commissionRate;
    }

    const taxRateInput = document.getElementById("taxRate");
    if (taxRateInput && settings.taxRate !== undefined) {
      taxRateInput.value = settings.taxRate;
    }

    const cancellationPenaltyInput = document.getElementById(
      "cancellationPenalty",
    );
    if (
      cancellationPenaltyInput &&
      settings.cancellationPenalty !== undefined
    ) {
      cancellationPenaltyInput.value = settings.cancellationPenalty;
    }

    const minBookingDaysInput = document.getElementById("minBookingDays");
    if (minBookingDaysInput && settings.minBookingDays !== undefined) {
      minBookingDaysInput.value = settings.minBookingDays;
    }
  }

  async function saveSettings() {
    const settings = {
      commissionRate: parseFloat(
        document.getElementById("commissionRate").value,
      ),
      taxRate: parseFloat(document.getElementById("taxRate").value),
      cancellationPenalty: parseFloat(
        document.getElementById("cancellationPenalty").value,
      ),
      minBookingDays: parseInt(document.getElementById("minBookingDays").value),
    };

    setLoadingState(true);

    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save settings");
      }

      showNotification("Settings saved successfully", "success");
    } catch (error) {
      console.error("Save settings error:", error);
      showNotification(error.message || "Failed to save settings", "error");
    } finally {
      setLoadingState(false);
    }
  }

  function setLoadingState(loading) {
    if (submitBtn) {
      if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Saving...</span>';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Save Settings</span>';
      }
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
