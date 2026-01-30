// ============================================================================
// AUTO PRIME RENTAL - HOST & ADMIN DASHBOARDS + MAIN.JS
// Host dashboard pages, Admin dashboard pages, and main entry point
// ============================================================================

// ============================================================================
// FILE: assets/js/dashboards/host/dashboard.js
// ============================================================================

/**
 * Host Dashboard
 * Overview for car hosts
 */

import HostService from "../../services/host.service.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import Helpers from "../../base/helpers.js";
import SidebarHost from "../../components/sidebar-host.js";

const HostDashboard = {
  init() {
    if (!AuthGuard.requireRole("HOST")) return;

    SidebarHost.init();

    this.loadDashboardStats();
    this.loadRecentBookings();
    this.loadEarnings();
  },

  async loadDashboardStats() {
    try {
      const response = await HostService.getDashboardStats();

      if (response.success && response.data) {
        this.renderStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  },

  renderStats(stats) {
    const totalCarsEl = document.getElementById("totalCars");
    if (totalCarsEl) totalCarsEl.textContent = stats.totalCars || 0;

    const activeBookingsEl = document.getElementById("activeBookings");
    if (activeBookingsEl)
      activeBookingsEl.textContent = stats.activeBookings || 0;

    const totalEarningsEl = document.getElementById("totalEarnings");
    if (totalEarningsEl)
      totalEarningsEl.textContent = Helpers.formatCurrency(
        stats.totalEarnings || 0,
      );

    const avgRatingEl = document.getElementById("avgRating");
    if (avgRatingEl)
      avgRatingEl.textContent = `⭐ ${(stats.avgRating || 0).toFixed(1)}`;
  },

  async loadRecentBookings() {
    const container = document.getElementById("recentBookingsContainer");

    if (!container) return;

    try {
      const response = await HostService.getCarBookings();

      if (response.success && response.data) {
        container.innerHTML = response.data
          .slice(0, 5)
          .map(
            (booking) => `
          <tr>
            <td>#${booking.id}</td>
            <td>${booking.car.name}</td>
            <td>${Helpers.formatDate(booking.pickupDate)}</td>
            <td>${Helpers.formatCurrency(booking.totalPrice)}</td>
            <td><span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span></td>
          </tr>
        `,
          )
          .join("");
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  },

  async loadEarnings() {
    try {
      const response = await HostService.getEarnings("month");

      if (response.success && response.data) {
        // Display earnings chart or data
        console.log("Earnings data:", response.data);
      }
    } catch (error) {
      console.error("Error loading earnings:", error);
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => HostDashboard.init());
} else {
  HostDashboard.init();
}

export default HostDashboard;
