// FILE: assets/js/dashboards/admin/cars.js

import { requireAdmin } from "../../../core/auth-guard.js";
import { initAdminSidebar } from "../../../components/sidebar-admin.js";
import { carService } from "../../../services/car.service.js";
import { formatCurrency } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";
import { confirmModal } from "../../../components/modal.js";

export const initAdminCars = async () => {
  if (!requireAdmin()) return;

  initAdminSidebar();
  await loadCars();
  setupSearch();
};

let allCars = [];

const loadCars = async () => {
  showLoader();

  try {
    allCars = await carService.getAllCars();
    displayCars(allCars);
  } catch (error) {
    console.error("Failed to load cars:", error);
  } finally {
    hideLoader();
  }
};

const displayCars = (cars) => {
  const container = document.querySelector("#cars-table");
  if (!container) return;

  if (cars.length === 0) {
    container.innerHTML = '<p class="text-center">No cars found.</p>';
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
              <a href="/admin/edit-car?id=${car.id}" class="btn btn-sm btn-primary">Edit</a>
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

const setupSearch = () => {
  const searchInput = document.querySelector("#car-search");

  searchInput?.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = allCars.filter(
      (car) =>
        car.name.toLowerCase().includes(searchTerm) ||
        car.brand.toLowerCase().includes(searchTerm) ||
        car.type.toLowerCase().includes(searchTerm),
    );

    displayCars(filtered);
  });
};
