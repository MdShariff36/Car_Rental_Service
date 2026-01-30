// ============================================================================
// FILE: assets/js/dashboards/host/manage-cars.js
// ============================================================================

/**
 * Manage Cars Page
 * Host's car listing management
 */

import HostService from "../../services/host.service.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import Helpers from "../../base/helpers.js";
import SidebarHost from "../../components/sidebar-host.js";

const ManageCarsPage = {
  init() {
    if (!AuthGuard.requireRole("HOST")) return;

    SidebarHost.init();

    this.loadCars();
    this.setupDeleteHandlers();
  },

  async loadCars() {
    const container = document.getElementById("carsTableBody");

    if (!container) return;

    Loader.show("Loading cars...");

    try {
      const response = await HostService.getCars();

      Loader.hide();

      if (response.success && response.data) {
        if (response.data.length === 0) {
          container.innerHTML =
            '<tr><td colspan="7" class="text-center">No cars listed yet. <a href="add-car.html">Add your first car</a></td></tr>';
        } else {
          container.innerHTML = response.data
            .map((car) => this.createCarRow(car))
            .join("");
        }
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Failed to load cars");
    }
  },

  createCarRow(car) {
    const statusClass = car.active ? "badge-success" : "badge-secondary";
    const statusText = car.active ? "Active" : "Inactive";

    return `
      <tr>
        <td>
          <img src="${car.image}" alt="${car.name}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td><strong>${car.name}</strong></td>
        <td>${car.type}</td>
        <td>${Helpers.formatCurrency(car.pricePerDay)}/day</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>${car.bookings || 0} bookings</td>
        <td>
          <div class="action-buttons">
            <a href="edit-car.html?id=${car.id}" class="btn btn-sm btn-outline">Edit</a>
            <button class="btn btn-sm btn-danger" onclick="window.ManageCarsPage.deleteCar('${car.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  },

  async deleteCar(carId) {
    if (
      !confirm(
        "Are you sure you want to delete this car? This action cannot be undone.",
      )
    )
      return;

    Loader.show("Deleting car...");

    try {
      const response = await HostService.deleteCar(carId);

      Loader.hide();

      if (response.success) {
        Notifications.success("Car deleted successfully");
        this.loadCars();
      } else {
        Notifications.error(response.error || "Failed to delete car");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error deleting car");
    }
  },

  setupDeleteHandlers() {
    window.ManageCarsPage = this;
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ManageCarsPage.init());
} else {
  ManageCarsPage.init();
}

export default ManageCarsPage;
