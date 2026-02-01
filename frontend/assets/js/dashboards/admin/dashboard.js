// FILE: assets/js/dashboards/admin/dashboard.js

import { requireAdmin } from "../../../core/auth-guard.js";
import { initAdminSidebar } from "../../../components/sidebar-admin.js";
import { adminService } from "../../../services/admin.service.js";
import { formatCurrency, formatDate } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";

export const initAdminDashboard = async () => {
  if (!requireAdmin()) return;

  initAdminSidebar();
  await loadDashboardData();
};

const loadDashboardData = async () => {
  showLoader();

  try {
    const stats = await adminService.getDashboardStats();

    displayStats(stats);
    displayRecentBookings(stats.recentBookings);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  } finally {
    hideLoader();
  }
};

const displayStats = (stats) => {
  const statsContainer = document.querySelector("#dashboard-stats");
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${stats.totalUsers}</h3>
        <p>Total Users</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${stats.totalCars}</h3>
        <p>Total Cars</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${stats.totalBookings}</h3>
        <p>Total Bookings</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${formatCurrency(stats.totalRevenue)}</h3>
        <p>Total Revenue</p>
      </div>
    </div>
  `;
};

const displayRecentBookings = (bookings) => {
  const container = document.querySelector("#recent-bookings");
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = "<p>No recent bookings.</p>";
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Car</th>
          <th>Dates</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${bookings
          .map(
            (booking) => `
          <tr>
            <td>${booking.id}</td>
            <td>${booking.car?.name || "N/A"}</td>
            <td>${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</td>
            <td>${formatCurrency(booking.totalAmount)}</td>
            <td><span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span></td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const getStatusColor = (status) => {
  const colors = {
    pending: "warning",
    confirmed: "info",
    ongoing: "primary",
    completed: "success",
    cancelled: "danger",
  };
  return colors[status] || "secondary";
};
