// FILE: assets/js/dashboards/admin/edit-car.js

import { requireAdmin } from "../../../core/auth-guard.js";
import { initAdminSidebar } from "../../../components/sidebar-admin.js";
import { carService } from "../../../services/car.service.js";
import { getQueryParams } from "../../../base/helpers.js";
import {
  validateRequired,
  validateMin,
  showFieldError,
  showFieldSuccess,
  clearFormValidation,
} from "../../../base/validators.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";

export const initAdminEditCar = async () => {
  if (!requireAdmin()) return;

  initAdminSidebar();

  const params = getQueryParams();
  const carId = params.id;

  if (!carId) {
    showNotification("Invalid car ID", "error");
    window.location.href = "/admin/cars";
    return;
  }

  await loadCarData(carId);
  setupEditCarForm(carId);
  setupImagePreview();
};

/* ===================== LOAD CAR ===================== */
const loadCarData = async (carId) => {
  showLoader();

  try {
    const car = await carService.getCarById(carId);
    populateForm(car);
  } catch (error) {
    showNotification("Failed to load car data", "error");
    window.location.href = "/admin/cars";
  } finally {
    hideLoader();
  }
};

/* ===================== POPULATE FORM ===================== */
const populateForm = (car) => {
  const form = document.querySelector("#edit-car-form");
  if (!form) return;

  const fields = [
    "name",
    "brand",
    "type",
    "year",
    "seats",
    "transmission",
    "fuel",
    "pricePerDay",
    "description",
    "location",
  ];

  fields.forEach((field) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (input && car[field] !== undefined) {
      input.value = car[field];
    }
  });

  const imagePreview = document.querySelector("#image-preview");
  if (imagePreview && car.image) {
    imagePreview.src = car.image;
    imagePreview.style.display = "block";
  }

  if (Array.isArray(car.features)) {
    car.features.forEach((feature) => {
      const checkbox = form.querySelector(
        `input[name="features"][value="${feature}"]`,
      );
      if (checkbox) checkbox.checked = true;
    });
  }
};

/* ===================== FORM SUBMIT ===================== */
const setupEditCarForm = (carId) => {
  const form = document.querySelector("#edit-car-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormValidation("edit-car-form");

    const formData = new FormData(form);

    const carData = {
      name: formData.get("name"),
      brand: formData.get("brand"),
      type: formData.get("type"),
      year: Number(formData.get("year")),
      seats: Number(formData.get("seats")),
      transmission: formData.get("transmission"),
      fuel: formData.get("fuel"),
      pricePerDay: Number(formData.get("pricePerDay")),
      features: formData.getAll("features"),
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
      await carService.updateCar(carId, carData);
      showNotification("Car updated successfully!", "success");

      setTimeout(() => {
        window.location.href = "/admin/cars";
      }, 1500);
    } catch (error) {
      showNotification("Failed to update car", "error");
    } finally {
      hideLoader();
    }
  });
};

/* ===================== IMAGE PREVIEW ===================== */
const setupImagePreview = () => {
  const imageInput = document.querySelector("#carImage");
  const preview = document.querySelector("#image-preview");

  if (!imageInput || !preview) return;

  imageInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      preview.src = event.target.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  });
};
