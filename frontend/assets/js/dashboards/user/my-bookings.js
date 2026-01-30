// ============================================================================
// FILE: assets/js/dashboards/user/my-bookings.js
// ============================================================================

/**
 * My Bookings Page
 * User's booking history and management
 */

import BookingService from "../../services/booking.service.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import Helpers from "../../base/helpers.js";
import SidebarUser from "../../components/sidebar-user.js";

const MyBookingsPage = {
  currentFilter: "all",

  init() {
    if (!AuthGuard.requireRole("USER")) return;

    SidebarUser.init();

    this.setupFilterTabs();
    this.loadBookings();
    this.setupCancelHandlers();
  },

  setupFilterTabs() {
    const filterButtons = document.querySelectorAll(".filter-tab");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        this.currentFilter = button.getAttribute("data-filter");
        this.loadBookings();
      });
    });
  },

  async loadBookings() {
    const container = document.getElementById("bookingsContainer");

    if (!container) return;

    Loader.show("Loading bookings...");

    try {
      const status =
        this.currentFilter === "all" ? null : this.currentFilter.toUpperCase();
      const response = await BookingService.getUserBookings(status);

      Loader.hide();

      if (response.success && response.data) {
        if (response.data.length === 0) {
          container.innerHTML =
            '<p class="text-center text-muted">No bookings found</p>';
        } else {
          container.innerHTML = response.data
            .map((booking) => this.createBookingRow(booking))
            .join("");
        }
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Failed to load bookings");
      console.error("Error:", error);
    }
  },

  createBookingRow(booking) {
    const statusClass =
      {
        PENDING: "badge-warning",
        CONFIRMED: "badge-success",
        COMPLETED: "badge-info",
        CANCELLED: "badge-danger",
      }[booking.status] || "badge-secondary";

    return `
      <tr>
        <td>#${booking.id}</td>
        <td>
          <div class="d-flex align-center gap-2">
            <img src="${booking.car.image}" alt="${booking.car.name}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;">
            <div>
              <strong>${booking.car.name}</strong>
              <p class="text-muted">${booking.car.type}</p>
            </div>
          </div>
        </td>
        <td>${Helpers.formatDate(booking.pickupDate)}</td>
        <td>${Helpers.formatDate(booking.dropDate)}</td>
        <td>${Helpers.formatCurrency(booking.totalPrice)}</td>
        <td><span class="badge ${statusClass}">${booking.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="window.MyBookingsPage.viewBooking('${booking.id}')">View</button>
          ${
            booking.status === "CONFIRMED"
              ? `
            <button class="btn btn-sm btn-danger" onclick="window.MyBookingsPage.cancelBooking('${booking.id}')">Cancel</button>
          `
              : ""
          }
        </td>
      </tr>
    `;
  },

  viewBooking(bookingId) {
    window.location.href = `booking-details.html?id=${bookingId}`;
  },

  async cancelBooking(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    const reason = prompt(
      "Please provide a reason for cancellation (optional):",
    );

    Loader.show("Cancelling booking...");

    try {
      const response = await BookingService.cancelBooking(bookingId, reason);

      Loader.hide();

      if (response.success) {
        Notifications.success("Booking cancelled successfully");
        this.loadBookings();
      } else {
        Notifications.error(response.error || "Failed to cancel booking");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error cancelling booking");
      console.error("Error:", error);
    }
  },

  setupCancelHandlers() {
    // Make methods available globally for onclick handlers
    window.MyBookingsPage = this;
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => MyBookingsPage.init());
} else {
  MyBookingsPage.init();
}

export default MyBookingsPage;
