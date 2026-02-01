// FILE: assets/js/dashboards/admin/reports.js

import { requireAdmin } from "../../../core/auth-guard.js";
import { initAdminSidebar } from "../../../components/sidebar-admin.js";
import { adminService } from "../../../services/admin.service.js";
import { formatCurrency } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";

export const initAdminReports = async () => {
  if (!requireAdmin()) return;

  initAdminSidebar();
  await loadReports();
  setupReportFilters();
};

const loadReports = async (type = "monthly") => {
  showLoader();

  try {
    const reports = await adminService.getReports(type);
    displayReports(reports);
  } catch (error) {
    console.error("Failed to load reports:", error);
  } finally {
    hideLoader();
  }
};

const displayReports = (reports) => {
  const container = document.querySelector("#reports-summary");
  if (!container) return;

  container.innerHTML = `
    <div class="row">
      <div class="col-md-3">
        <div class="stat-card">
          <h3>${reports.bookings}</h3>
          <p>Total Bookings</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <h3>${formatCurrency(reports.revenue)}</h3>
          <p>Total Revenue</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <h3>${formatCurrency(reports.averageBookingValue)}</h3>
          <p>Avg Booking Value</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <h3>${reports.popularCars.length}</h3>
          <p>Popular Cars</p>
        </div>
      </div>
    </div>

    ${
      reports.popularCars.length > 0
        ? `
      <div class="mt-4">
        <h4>Popular Cars</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Car</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            ${reports.popularCars
              .map(
                (item) => `
              <tr>
                <td>${item.car?.name || "N/A"}</td>
                <td>${item.bookingCount}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
        : ""
    }
  `;
};

const setupReportFilters = () => {
  const filterSelect = document.querySelector("#report-type");

  filterSelect?.addEventListener("change", (e) => {
    const type = e.target.value;
    loadReports(type);
  });

  const exportBtn = document.querySelector("#export-report");
  exportBtn?.addEventListener("click", () => {
    alert("Report export functionality will be implemented in backend");
  });
};
