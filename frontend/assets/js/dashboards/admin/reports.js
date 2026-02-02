// FILE: assets/js/admin/reports.js

document.addEventListener("DOMContentLoaded", async function () {
  const reportTypeSelect = document.getElementById("reportType");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const generateReportBtn = document.getElementById("generateReportBtn");
  const reportContainer = document.getElementById("reportContainer");

  if (generateReportBtn) {
    generateReportBtn.addEventListener("click", generateReport);
  }

  async function generateReport() {
    const reportType = reportTypeSelect ? reportTypeSelect.value : "revenue";
    const startDate = startDateInput ? startDateInput.value : null;
    const endDate = endDateInput ? endDateInput.value : null;

    if (!startDate || !endDate) {
      showNotification("Please select date range", "error");
      return;
    }

    showLoader();

    try {
      const token = AuthService.getToken();
      const params = new URLSearchParams({
        type: reportType,
        startDate: startDate,
        endDate: endDate,
      });

      const response = await fetch(
        `http://localhost:8080/api/admin/reports?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const reportData = await response.json();
      displayReport(reportData, reportType);
    } catch (error) {
      console.error("Generate report error:", error);
      showNotification("Failed to generate report", "error");
    } finally {
      hideLoader();
    }
  }

  function displayReport(data, type) {
    if (!reportContainer) return;

    let html = `<div class="report">`;
    html += `<h3>${getReportTitle(type)}</h3>`;
    html += `<div class="report-summary">`;

    if (type === "revenue") {
      html += `
                <div class="summary-item">
                    <span class="label">Total Revenue:</span>
                    <span class="value">${formatCurrency(data.totalRevenue)}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Bookings:</span>
                    <span class="value">${data.totalBookings}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Average Booking Value:</span>
                    <span class="value">${formatCurrency(data.averageBookingValue)}</span>
                </div>
            `;
    } else if (type === "bookings") {
      html += `
                <div class="summary-item">
                    <span class="label">Total Bookings:</span>
                    <span class="value">${data.totalBookings}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Completed:</span>
                    <span class="value">${data.completedBookings}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Cancelled:</span>
                    <span class="value">${data.cancelledBookings}</span>
                </div>
            `;
    } else if (type === "users") {
      html += `
                <div class="summary-item">
                    <span class="label">New Users:</span>
                    <span class="value">${data.newUsers}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Active Users:</span>
                    <span class="value">${data.activeUsers}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Total Users:</span>
                    <span class="value">${data.totalUsers}</span>
                </div>
            `;
    }

    html += `</div></div>`;
    reportContainer.innerHTML = html;
  }

  function getReportTitle(type) {
    const titles = {
      revenue: "Revenue Report",
      bookings: "Bookings Report",
      users: "Users Report",
      cars: "Cars Report",
    };
    return titles[type] || "Report";
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function showLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "flex";
  }

  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "none";
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
});
