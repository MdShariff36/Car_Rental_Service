// ============================================================================
// FILE: assets/js/dashboards/admin/dashboard.js
// ============================================================================

/**
 * Admin Dashboard
 * System overview and statistics
 */

import AdminService from "../../services/admin.service.js";
import Loader from "../../ui/loader.js";
import AuthGuard from "../../core/auth-guard.js";
import Helpers from "../../base/helpers.js";
import SidebarAdmin from "../../components/sidebar-admin.js";

const AdminDashboard = {
  init() {
    if (!AuthGuard.requireRole("ADMIN")) return;

    SidebarAdmin.init();

    this.loadDashboardStats();
  },

  async loadDashboardStats() {
    Loader.show("Loading dashboard...");

    try {
      const response = await AdminService.getDashboardStats();

      Loader.hide();

      if (response.success && response.data) {
        this.renderStats(response.data);
      }
    } catch (error) {
      Loader.hide();
      console.error("Error loading stats:", error);
    }
  },

  renderStats(stats) {
    const totalUsersEl = document.getElementById("totalUsers");
    if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers || 0;

    const totalCarsEl = document.getElementById("totalCars");
    if (totalCarsEl) totalCarsEl.textContent = stats.totalCars || 0;

    const totalBookingsEl = document.getElementById("totalBookings");
    if (totalBookingsEl) totalBookingsEl.textContent = stats.totalBookings || 0;

    const totalRevenueEl = document.getElementById("totalRevenue");
    if (totalRevenueEl)
      totalRevenueEl.textContent = Helpers.formatCurrency(
        stats.totalRevenue || 0,
      );
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => AdminDashboard.init());
} else {
  AdminDashboard.init();
}

export default AdminDashboard;
