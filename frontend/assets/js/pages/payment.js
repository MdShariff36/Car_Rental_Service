// FILE: assets/js/pages/payment.js

document.addEventListener("DOMContentLoaded", async function () {
  const paymentForm = document.getElementById("paymentForm");
  const submitBtn = paymentForm.querySelector(".submit-btn");

  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId");

  if (!bookingId) {
    showNotification("Invalid booking", "error");
    setTimeout(() => (window.location.href = "/user/my-bookings.html"), 2000);
    return;
  }

  await loadPaymentDetails();

  paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked',
    );

    if (!paymentMethod) {
      showNotification("Please select a payment method", "error");
      return;
    }

    setLoadingState(true);

    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: parseInt(bookingId),
          paymentMethod: paymentMethod.value,
          amount: parseFloat(
            document.getElementById("totalAmount").dataset.amount,
          ),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Payment failed");
      }

      const data = await response.json();

      showNotification("Payment processed successfully", "success");

      setTimeout(() => {
        window.location.href = `/booking-confirm.html?bookingId=${bookingId}`;
      }, 1500);
    } catch (error) {
      console.error("Payment error:", error);
      showNotification(error.message || "Payment failed", "error");
    } finally {
      setLoadingState(false);
    }
  });

  async function loadPaymentDetails() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load booking details");
      }

      const booking = await response.json();
      displayPaymentDetails(booking);
    } catch (error) {
      console.error("Load booking error:", error);
      showNotification("Failed to load payment details", "error");
    } finally {
      hideLoader();
    }
  }

  function displayPaymentDetails(booking) {
    const totalAmountElement = document.getElementById("totalAmount");
    if (totalAmountElement) {
      totalAmountElement.textContent = formatCurrency(booking.totalAmount);
      totalAmountElement.dataset.amount = booking.totalAmount;
    }

    const bookingDetailsElement = document.getElementById("bookingDetails");
    if (bookingDetailsElement) {
      bookingDetailsElement.innerHTML = `
                <div class="detail-row">
                    <span>Car:</span>
                    <span>${booking.carName}</span>
                </div>
                <div class="detail-row">
                    <span>Duration:</span>
                    <span>${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</span>
                </div>
                <div class="detail-row">
                    <span>Booking Number:</span>
                    <span>${booking.bookingNumber}</span>
                </div>
            `;
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

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Processing...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Pay Now</span>';
    }
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
