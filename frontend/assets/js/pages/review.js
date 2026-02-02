// FILE: assets/js/pages/review.js

document.addEventListener("DOMContentLoaded", async function () {
  const reviewForm = document.getElementById("reviewForm");
  const ratingInputs = document.querySelectorAll('input[name="rating"]');
  const commentInput = document.getElementById("comment");
  const submitBtn = reviewForm.querySelector(".submit-btn");

  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId");
  const carId = urlParams.get("carId");

  if (!bookingId && !carId) {
    showNotification("Invalid review request", "error");
    setTimeout(() => (window.location.href = "/user/my-bookings.html"), 2000);
    return;
  }

  await loadBookingDetails();

  reviewForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const selectedRating = document.querySelector(
      'input[name="rating"]:checked',
    );
    const comment = commentInput.value.trim();

    if (!selectedRating) {
      showNotification("Please select a rating", "error");
      return;
    }

    if (!comment) {
      showNotification("Please write a comment", "error");
      return;
    }

    setLoadingState(true);

    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: bookingId ? parseInt(bookingId) : null,
          carId: carId ? parseInt(carId) : null,
          rating: parseInt(selectedRating.value),
          comment: comment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit review");
      }

      showNotification("Review submitted successfully", "success");

      setTimeout(() => {
        window.location.href = "/user/my-bookings.html";
      }, 1500);
    } catch (error) {
      console.error("Submit review error:", error);
      showNotification(error.message || "Failed to submit review", "error");
    } finally {
      setLoadingState(false);
    }
  });

  async function loadBookingDetails() {
    if (!bookingId) return;

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
      displayBookingInfo(booking);
    } catch (error) {
      console.error("Load booking error:", error);
    } finally {
      hideLoader();
    }
  }

  function displayBookingInfo(booking) {
    const bookingInfoElement = document.getElementById("bookingInfo");
    if (bookingInfoElement) {
      bookingInfoElement.innerHTML = `
                <div class="booking-summary">
                    <h3>${booking.carName}</h3>
                    <p>Booking #${booking.bookingNumber}</p>
                    <p>${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</p>
                </div>
            `;
    }
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
      submitBtn.innerHTML = '<span class="btn-text">Submitting...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Submit Review</span>';
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
