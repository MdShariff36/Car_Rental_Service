// ============================================================================
// FILE: assets/js/dashboards/host/add-car.js
// ============================================================================

/**
 * Add Car Page
 * Add new car listing
 */

import HostService from "../../services/host.service.js";
import Validators from "../../base/validators.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import SidebarHost from "../../components/sidebar-host.js";

const AddCarPage = {
  init() {
    if (!AuthGuard.requireRole("HOST")) return;

    SidebarHost.init();

    this.setupCarForm();
    this.setupImageUpload();
  },

  setupCarForm() {
    const carForm = document.getElementById("addCarForm");

    if (!carForm) return;

    carForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(carForm);
      const carData = {
        name: formData.get("name"),
        type: formData.get("type"),
        transmission: formData.get("transmission"),
        fuelType: formData.get("fuelType"),
        seats: formData.get("seats"),
        year: formData.get("year"),
        pricePerDay: formData.get("pricePerDay"),
        kmLimit: formData.get("kmLimit"),
        unlimitedKm: formData.get("unlimitedKm") === "on",
        location: formData.get("location"),
        description: formData.get("description"),
        features: formData
          .get("features")
          ?.split(",")
          .map((f) => f.trim()),
      };

      // Validate
      if (!carData.name || !carData.type || !carData.pricePerDay) {
        Notifications.error("Please fill in all required fields");
        return;
      }

      await this.submitCar(carData);
    });
  },

  async submitCar(carData) {
    Loader.show("Adding car...");

    try {
      const response = await HostService.addCar(carData);

      Loader.hide();

      if (response.success) {
        Notifications.success("Car added successfully!");

        setTimeout(() => {
          window.location.href = "manage-cars.html";
        }, 1500);
      } else {
        Notifications.error(response.error || "Failed to add car");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error adding car");
    }
  },

  setupImageUpload() {
    const imageInput = document.getElementById("carImages");
    const preview = document.getElementById("imagePreview");

    if (!imageInput || !preview) return;

    imageInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);

      preview.innerHTML = "";

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.width = "100px";
          img.style.height = "100px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "8px";
          img.style.margin = "5px";
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => AddCarPage.init());
} else {
  AddCarPage.init();
}

export default AddCarPage;
