// FILE: assets/js/dashboards/admin/settings.js

import { requireAdmin } from "../../../core/auth-guard.js";
import { initAdminSidebar } from "../../../components/sidebar-admin.js";
import { adminService } from "../../../services/admin.service.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";
import { clearFormValidation } from "../../../base/validators.js";

export const initAdminSettings = async () => {
  if (!requireAdmin()) return;

  initAdminSidebar();
  await loadSettings();
  setupSettingsForm();
};

const loadSettings = async () => {
  showLoader();

  try {
    const settings = await adminService.getSystemSettings();
    populateSettings(settings);
  } catch (error) {
    console.error("Failed to load settings:", error);
  } finally {
    hideLoader();
  }
};

const populateSettings = (settings) => {
  const form = document.querySelector("#settings-form");
  if (!form) return;

  const fields = [
    "siteName",
    "siteEmail",
    "sitePhone",
    "currency",
    "commissionRate",
    "taxRate",
  ];

  fields.forEach((field) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      input.value = settings[field] || "";
    }
  });

  const maintenanceToggle = form.querySelector('[name="maintenanceMode"]');
  if (maintenanceToggle) {
    maintenanceToggle.checked = settings.maintenanceMode || false;
  }
};

const setupSettingsForm = () => {
  const form = document.querySelector("#settings-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormValidation("settings-form");

    const formData = new FormData(form);
    const settings = {
      siteName: formData.get("siteName"),
      siteEmail: formData.get("siteEmail"),
      sitePhone: formData.get("sitePhone"),
      currency: formData.get("currency"),
      commissionRate: parseFloat(formData.get("commissionRate")),
      taxRate: parseFloat(formData.get("taxRate")),
      maintenanceMode: formData.get("maintenanceMode") === "on",
    };

    showLoader();

    try {
      await adminService.updateSystemSettings(settings);
      showNotification("Settings updated successfully!", "success");
    } catch (error) {
      showNotification("Failed to update settings", "error");
    } finally {
      hideLoader();
    }
  });
};
