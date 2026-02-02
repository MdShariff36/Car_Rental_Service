// FILE: assets/js/pages/booking-details.js

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("id");

  if (!bookingId) {
    showNotification("Invalid booking ID", "error");
    setTimeout(() => (window.location.href = "/user/my-bookings.html"), 2000);
    return;
  }

  await loadBookingDetails();

  async function loadBookingDetails() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load booking details");
      }

      const booking = await response.json();
      displayBookingDetails(booking);
    } catch (error) {
      console.error("Load booking error:", error);
      showNotification("Failed to load booking details", "error");
      setTimeout(() => (window.location.href = "/user/my-bookings.html"), 2000);
    } finally {
      hideLoader();
    }
  }

  function displayBookingDetails(booking) {
    const bookingNumberElement = document.getElementById("bookingNumber");
    if (bookingNumberElement)
      bookingNumberElement.textContent = booking.bookingNumber;

    const bookingStatusElement = document.getElementById("bookingStatus");
    if (bookingStatusElement) {
      bookingStatusElement.className = `badge badge-${booking.status.toLowerCase()}`;
      bookingStatusElement.textContent = booking.status;
    }

    const carNameElement = document.getElementById("carName");
    if (carNameElement) carNameElement.textContent = booking.carName;

    const carImageElement = document.getElementById("carImage");
    if (carImageElement) {
      carImageElement.src =
        booking.carImage || "/assets/images/car-placeholder.jpg";
      carImageElement.alt = booking.carName;
    }

    const bookingDatesElement = document.getElementById("bookingDates");
    if (bookingDatesElement) {
      bookingDatesElement.textContent = `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`;
    }

    const pickupLocationElement = document.getElementById("pickupLocation");
    if (pickupLocationElement)
      pickupLocationElement.textContent = booking.pickupLocation;

    const dropoffLocationElement = document.getElementById("dropoffLocation");
    if (dropoffLocationElement)
      dropoffLocationElement.textContent = booking.dropoffLocation;

    const totalAmountElement = document.getElementById("totalAmount");
    if (totalAmountElement)
      totalAmountElement.textContent = formatCurrency(booking.totalAmount);

    const paymentStatusElement = document.getElementById("paymentStatus");
    if (paymentStatusElement) {
      paymentStatusElement.className = `badge badge-${booking.paymentStatus.toLowerCase()}`;
      paymentStatusElement.textContent = booking.paymentStatus;
    }

    const bookingActionsElement = document.getElementById("bookingActions");
    if (bookingActionsElement) {
      bookingActionsElement.innerHTML = getActionButtons(booking);
      attachActionListeners(booking);
    }
  }

  function getActionButtons(booking) {
    let buttons = "";

    if (booking.status === "PENDING" || booking.status === "CONFIRMED") {
      buttons += `
                <button class="btn btn-danger cancel-booking-btn" data-id="${booking.id}">
                    Cancel Booking
                </button>
            `;
    }

    if (booking.status === "COMPLETED" && !booking.hasReview) {
      buttons += `
                <button class="btn btn-primary add-review-btn" data-id="${booking.id}">
                    Write Review
                </button>
            `;
    }

    if (booking.status === "PENDING" && !booking.isPaid) {
      buttons += `
                <button class="btn btn-success make-payment-btn" data-id="${booking.id}">
                    Make Payment
                </button>
            `;
    }

    return buttons;
  }

  function attachActionListeners(booking) {
    const cancelBtn = document.querySelector(".cancel-booking-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", async function () {
        if (confirm("Are you sure you want to cancel this booking?")) {
          await cancelBooking(booking.id);
        }
      });
    }

    const reviewBtn = document.querySelector(".add-review-btn");
    if (reviewBtn) {
      reviewBtn.addEventListener("click", function () {
        window.location.href = `/review.html?bookingId=${booking.id}`;
      });
    }

    const paymentBtn = document.querySelector(".make-payment-btn");
    if (paymentBtn) {
      paymentBtn.addEventListener("click", function () {
        window.location.href = `/payment.html?bookingId=${booking.id}`;
      });
    }
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
      setTimeout(() => location.reload(), 1500);
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
