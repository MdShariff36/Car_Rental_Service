// FILE: assets/js/dashboards/host/manage-cars.js

import { requireHost } from "../../../core/auth-guard.js";
import { initHostSidebar } from "../../../components/sidebar-host.js";
import { carService } from "../../../services/car.service.js";
import { storage } from "../../../base/storage.js";
import { formatCurrency } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";
import { confirmModal } from "../../../components/modal.js";

export const initManageCars = async () => {
  if (!requireHost()) return;

  initHostSidebar();
  await loadCars();
};

const loadCars = async () => {
  showLoader();

  try {
    const user = storage.getUser();
    const cars = await carService.getHostCars(user.id);
    displayCars(cars);
  } catch (error) {
    console.error("Failed to load cars:", error);
  } finally {
    hideLoader();
  }
};

const displayCars = (cars) => {
  const container = document.querySelector("#cars-list");
  if (!container) return;

  if (cars.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h3>No cars added yet</h3>
        <p>Start adding your cars to get bookings!</p>
        <a href="/host/add-car" class="btn btn-primary">Add Car</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Type</th>
          <th>Price/Day</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${cars
          .map(
            (car) => `
          <tr>
            <td><img src="${car.image}" alt="${car.name}" style="width: 60px; height: 40px; object-fit: cover;" onerror="this.src='/assets/images/car-placeholder.jpg'"></td>
            <td>${car.name}</td>
            <td>${car.type}</td>
            <td>${formatCurrency(car.pricePerDay)}</td>
            <td>
              <span class="badge bg-${car.available ? "success" : "danger"}">
                ${car.available ? "Available" : "Unavailable"}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-primary" data-toggle-availability="${car.id}">
                ${car.available ? "Mark Unavailable" : "Mark Available"}
              </button>
              <button class="btn btn-sm btn-danger" data-delete-car="${car.id}">Delete</button>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  setupCarActions();
};

const setupCarActions = () => {
  document.querySelectorAll("[data-toggle-availability]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const carId = btn.getAttribute("data-toggle-availability");

      showLoader();

      try {
        const car = await carService.getCarById(carId);
        await carService.updateCar(carId, { available: !car.available });
        showNotification("Car availability updated", "success");
        await loadCars();
      } catch (error) {
        showNotification("Failed to update availability", "error");
      } finally {
        hideLoader();
      }
    });
  });

  document.querySelectorAll("[data-delete-car]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const carId = btn.getAttribute("data-delete-car");

      const confirmed = await confirmModal(
        "Are you sure you want to delete this car?",
      );
      if (!confirmed) return;

      showLoader();

      try {
        await carService.deleteCar(carId);
        showNotification("Car deleted successfully", "success");
        await loadCars();
      } catch (error) {
        showNotification("Failed to delete car", "error");
      } finally {
        hideLoader();
      }
    });
  });
};
