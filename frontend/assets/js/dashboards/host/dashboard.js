// FILE: assets/js/dashboards/host/dashboard.js

import { requireHost } from "../../../core/auth-guard.js";
import { initHostSidebar } from "../../../components/sidebar-host.js";
import { hostService } from "../../../services/host.service.js";
import { storage } from "../../../base/storage.js";
import { formatCurrency, formatDate } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";

export const initHostDashboard = async () => {
  if (!requireHost()) return;

  initHostSidebar();
  await loadDashboardData();
};

const loadDashboardData = async () => {
  showLoader();

  try {
    const user = storage.getUser();
    const dashboardData = await hostService.getHostDashboard(user.id);

    displayStats(dashboardData);
    displayRecentBookings(dashboardData.recentBookings);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  } finally {
    hideLoader();
  }
};

const displayStats = (data) => {
  const statsContainer = document.querySelector("#dashboard-stats");
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${data.totalCars}</h3>
        <p>Total Cars</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${data.activeCars}</h3>
        <p>Active Cars</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${data.totalBookings}</h3>
        <p>Total Bookings</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${formatCurrency(data.totalEarnings)}</h3>
        <p>Total Earnings</p>
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
