// FILE: assets/js/dashboards/admin/bookings.js

import { requireAdmin } from "../../../core/auth-guard.js";
import { initAdminSidebar } from "../../../components/sidebar-admin.js";
import { bookingService } from "../../../services/booking.service.js";
import { formatCurrency, formatDate } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";

export const initAdminBookings = async () => {
  if (!requireAdmin()) return;

  initAdminSidebar();
  await loadBookings();
  setupFilters();
};

let allBookings = [];

const loadBookings = async () => {
  showLoader();

  try {
    allBookings = await bookingService.getAllBookings();
    displayBookings(allBookings);
  } catch (error) {
    console.error("Failed to load bookings:", error);
  } finally {
    hideLoader();
  }
};

const displayBookings = (bookings) => {
  const container = document.querySelector("#bookings-table");
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = '<p class="text-center">No bookings found.</p>';
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Car</th>
          <th>Dates</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${bookings
          .map(
            (booking) => `
          <tr>
            <td>${booking.id}</td>
            <td>${booking.user?.name || "N/A"}</td>
            <td>${booking.car?.name || "N/A"}</td>
            <td>${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</td>
            <td>${formatCurrency(booking.totalAmount)}</td>
            <td><span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span></td>
            <td>
              <select class="form-select form-select-sm" data-booking-id="${booking.id}">
                <option value="">Change Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  setupStatusChanges();
};

const setupStatusChanges = () => {
  document.querySelectorAll("select[data-booking-id]").forEach((select) => {
    select.addEventListener("change", async (e) => {
      const bookingId = select.getAttribute("data-booking-id");
      const newStatus = e.target.value;

      if (!newStatus) return;

      showLoader();

      try {
        await bookingService.updateBookingStatus(bookingId, newStatus);
        showNotification("Booking status updated", "success");
        await loadBookings();
      } catch (error) {
        showNotification("Failed to update status", "error");
      } finally {
        hideLoader();
      }
    });
  });
};

const setupFilters = () => {
  const filterSelect = document.querySelector("#booking-filter");

  filterSelect?.addEventListener("change", (e) => {
    const status = e.target.value;

    if (status === "all") {
      displayBookings(allBookings);
    } else {
      const filtered = allBookings.filter((b) => b.status === status);
      displayBookings(filtered);
    }
  });
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
