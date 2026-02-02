// FILE: assets/js/pages/my-bookings.js

document.addEventListener("DOMContentLoaded", async function () {
  const bookingsContainer = document.getElementById("bookingsContainer");
  const statusFilter = document.getElementById("statusFilter");
  const sortBySelect = document.getElementById("sortBy");

  await loadBookings();

  if (statusFilter) {
    statusFilter.addEventListener("change", () => loadBookings());
  }

  if (sortBySelect) {
    sortBySelect.addEventListener("change", () => loadBookings());
  }

  async function loadBookings() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const params = new URLSearchParams();

      if (statusFilter && statusFilter.value) {
        params.append("status", statusFilter.value);
      }
      if (sortBySelect && sortBySelect.value) {
        params.append("sortBy", sortBySelect.value);
      }

      const url = `http://localhost:8080/api/bookings/my-bookings?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const bookings = await response.json();
      displayBookings(bookings);
    } catch (error) {
      console.error("Load bookings error:", error);
      showNotification("Failed to load bookings", "error");
    } finally {
      hideLoader();
    }
  }

  function displayBookings(bookings) {
    if (!bookingsContainer) return;

    if (!bookings || bookings.length === 0) {
      bookingsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No bookings found</p>
                    <a href="/cars.html" class="btn btn-primary">Browse Cars</a>
                </div>
            `;
      return;
    }

    bookingsContainer.innerHTML = bookings
      .map(
        (booking) => `
            <div class="booking-card" data-booking-id="${booking.id}">
                <div class="booking-image">
                    <img src="${booking.carImage || "/assets/images/car-placeholder.jpg"}" alt="${booking.carName}">
                </div>
                <div class="booking-details">
                    <h3>${booking.carName}</h3>
                    <p class="booking-number">Booking #${booking.bookingNumber}</p>
                    <div class="booking-info">
                        <div class="info-item">
                            <span class="icon">📅</span>
                            <span>${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</span>
                        </div>
                        <div class="info-item">
                            <span class="icon">📍</span>
                            <span>${booking.pickupLocation}</span>
                        </div>
                        <div class="info-item">
                            <span class="icon">💰</span>
                            <span>${formatCurrency(booking.totalAmount)}</span>
                        </div>
                    </div>
                </div>
                <div class="booking-status">
                    <span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-sm btn-outline view-details" data-id="${booking.id}">
                        View Details
                    </button>
                    ${getActionButtons(booking)}
                </div>
            </div>
        `,
      )
      .join("");

    attachEventListeners();
  }

  function getActionButtons(booking) {
    let buttons = "";

    if (booking.status === "PENDING" || booking.status === "CONFIRMED") {
      buttons += `
                <button class="btn btn-sm btn-danger cancel-booking" data-id="${booking.id}">
                    Cancel
                </button>
            `;
    }

    if (booking.status === "COMPLETED" && !booking.hasReview) {
      buttons += `
                <button class="btn btn-sm btn-primary add-review" data-id="${booking.id}">
                    Add Review
                </button>
            `;
    }

    if (booking.status === "CANCELLED" && booking.isPaid) {
      buttons += `
                <button class="btn btn-sm btn-outline request-refund" data-id="${booking.id}">
                    Request Refund
                </button>
            `;
    }

    return buttons;
  }

  function attachEventListeners() {
    document.querySelectorAll(".view-details").forEach((btn) => {
      btn.addEventListener("click", function () {
        const bookingId = this.dataset.id;
        window.location.href = `/booking-details.html?id=${bookingId}`;
      });
    });

    document.querySelectorAll(".cancel-booking").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const bookingId = this.dataset.id;
        if (confirm("Are you sure you want to cancel this booking?")) {
          await cancelBooking(bookingId);
        }
      });
    });

    document.querySelectorAll(".add-review").forEach((btn) => {
      btn.addEventListener("click", function () {
        const bookingId = this.dataset.id;
        window.location.href = `/review.html?bookingId=${bookingId}`;
      });
    });

    document.querySelectorAll(".request-refund").forEach((btn) => {
      btn.addEventListener("click", function () {
        const bookingId = this.dataset.id;
        window.location.href = `/refund.html?bookingId=${bookingId}`;
      });
    });
  }

  async function cancelBooking(bookingId) {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel booking");
      }

      showNotification("Booking cancelled successfully", "success");
      await loadBookings();
    } catch (error) {
      console.error("Cancel booking error:", error);
      showNotification(error.message || "Failed to cancel booking", "error");
    } finally {
      hideLoader();
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
