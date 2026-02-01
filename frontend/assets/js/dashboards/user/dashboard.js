// FILE: assets/js/dashboards/user/dashboard.js

import { requireUser } from "../../../core/auth-guard.js";
import { initUserSidebar } from "../../../components/sidebar-user.js";
import { bookingService } from "../../../services/booking.service.js";
import { storage } from "../../../base/storage.js";
import { formatCurrency, formatDate } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";

export const initUserDashboard = async () => {
  if (!requireUser()) return;

  initUserSidebar();
  await loadDashboardData();
};

const loadDashboardData = async () => {
  showLoader();

  try {
    const user = storage.getUser();
    const bookings = await bookingService.getUserBookings(user.id);
    const stats = await bookingService.getBookingStats(user.id, user.role);

    displayStats(stats);
    displayRecentBookings(bookings.slice(0, 5));
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
        <h3>${stats.total}</h3>
        <p>Total Bookings</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${stats.confirmed}</h3>
        <p>Confirmed</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${stats.ongoing}</h3>
        <p>Ongoing</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <h3>${stats.completed}</h3>
        <p>Completed</p>
      </div>
    </div>
  `;
};

const displayRecentBookings = (bookings) => {
  const container = document.querySelector("#recent-bookings");
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = "<p>No bookings yet.</p>";
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
