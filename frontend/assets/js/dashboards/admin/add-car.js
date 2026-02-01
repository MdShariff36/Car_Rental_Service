// FILE: assets/js/dashboards/admin/add-car.js

import { requireAdmin } from "../../../core/auth-guard.js";
import { initAdminSidebar } from "../../../components/sidebar-admin.js";
import { carService } from "../../../services/car.service.js";
import {
  validateRequired,
  validateMin,
  showFieldError,
  showFieldSuccess,
  clearFormValidation,
} from "../../../base/validators.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";

export const initAdminAddCar = () => {
  if (!requireAdmin()) return;

  initAdminSidebar();
  setupAddCarForm();
  setupImagePreview();
};

const setupAddCarForm = () => {
  const form = document.querySelector("#add-car-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormValidation("add-car-form");

    const formData = new FormData(form);
    const carData = {
      name: formData.get("name"),
      brand: formData.get("brand"),
      type: formData.get("type"),
      year: parseInt(formData.get("year")),
      seats: parseInt(formData.get("seats")),
      transmission: formData.get("transmission"),
      fuel: formData.get("fuel"),
      pricePerDay: parseFloat(formData.get("pricePerDay")),
      image: formData.get("image") || "/assets/images/car-placeholder.jpg",
      features: Array.from(formData.getAll("features")),
      description: formData.get("description"),
      location: formData.get("location"),
    };

    let isValid = true;

    const nameValidation = validateRequired(carData.name, "Car name");
    if (!nameValidation.valid) {
      showFieldError("name", nameValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("name");
    }

    const priceValidation = validateMin(
      carData.pricePerDay,
      0,
      "Price per day",
    );
    if (!priceValidation.valid) {
      showFieldError("pricePerDay", priceValidation.message);
      isValid = false;
    } else {
      showFieldSuccess("pricePerDay");
    }

    if (!isValid) return;

    showLoader();

    try {
      await carService.createCar(carData);
      showNotification("Car added successfully!", "success");

      setTimeout(() => {
        window.location.href = "/admin/cars";
      }, 1500);
    } catch (error) {
      showNotification("Failed to add car", "error");
    } finally {
      hideLoader();
    }
  });
};

const setupImagePreview = () => {
  const imageInput = document.querySelector("#carImage");
  const preview = document.querySelector("#image-preview");

  imageInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (preview && event.target?.result) {
        preview.src = event.target.result;
        preview.style.display = "block";
      }
    };
    reader.readAsDataURL(file);
  });
};
