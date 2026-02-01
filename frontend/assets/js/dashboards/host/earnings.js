// FILE: assets/js/dashboards/host/earnings.js

import { requireHost } from "../../../core/auth-guard.js";
import { initHostSidebar } from "../../../components/sidebar-host.js";
import { hostService } from "../../../services/host.service.js";
import { storage } from "../../../base/storage.js";
import { formatCurrency, formatDate } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";

export const initEarnings = async () => {
  if (!requireHost()) return;

  initHostSidebar();
  await loadEarnings();
};

const loadEarnings = async () => {
  showLoader();

  try {
    const user = storage.getUser();
    const earnings = await hostService.getHostEarnings(user.id);

    displayStats(earnings);
    displayEarningsList(earnings.earnings);
  } catch (error) {
    console.error("Failed to load earnings:", error);
  } finally {
    hideLoader();
  }
};

const displayStats = (earnings) => {
  const statsContainer = document.querySelector("#earnings-stats");
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="col-md-4">
      <div class="stat-card">
        <h3>${formatCurrency(earnings.total)}</h3>
        <p>Total Earnings</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card">
        <h3>${formatCurrency(earnings.thisMonth)}</h3>
        <p>This Month</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card">
        <h3>${earnings.bookingsCount}</h3>
        <p>Completed Bookings</p>
      </div>
    </div>
  `;
};

const displayEarningsList = (earningsList) => {
  const container = document.querySelector("#earnings-list");
  if (!container) return;

  if (earningsList.length === 0) {
    container.innerHTML = '<p class="text-center">No earnings yet.</p>';
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Booking ID</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${earningsList
          .map(
            (earning) => `
          <tr>
            <td>${formatDate(earning.date)}</td>
            <td>${earning.id}</td>
            <td>${formatCurrency(earning.amount)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
};
