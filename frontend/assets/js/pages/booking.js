/**
 * Booking Page (booking.html)
 * REQUIRES BACKEND: POST /api/bookings
 * Handles car rental booking submissions
 */

(() => {
  "use strict";

  let selectedCar = null;

  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("Booking page loaded");

    // Check authentication
    if (!AuthService.isAuthenticated()) {
      redirectToLogin();
      return;
    }

    // Get car ID from URL if provided
    const carId = getCarIdFromURL();
    if (carId) {
      await loadCarForBooking(carId);
    }

    // Initialize booking form
    initializeBookingForm();
  });

  /**
   * Redirect to login page
   */
  function redirectToLogin() {
    const currentURL = encodeURIComponent(window.location.href);
    window.location.href = `login.html?redirect=${currentURL}`;
  }

  /**
   * Get car ID from URL parameters
   */
  function getCarIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("carId");
  }

  /**
   * Load car details for booking
   * BACKEND CALL: GET /api/cars/{id}
   */
  async function loadCarForBooking(carId) {
    try {
      const result = await CarService.getCarById(carId);

      if (result.success) {
        selectedCar = result.data;
        displayCarInBooking(selectedCar);
      } else {
        console.error("Failed to load car:", result.error);
      }
    } catch (error) {
      console.error("Error loading car for booking:", error);
    }
  }

  /**
   * Display selected car in booking form
   */
  function displayCarInBooking(car) {
    const carInfoElement = document.getElementById("selectedCarInfo");
    if (!carInfoElement) return;

    carInfoElement.innerHTML = `
      <div class="selected-car">
        <img src="${car.imageUrl || "assets/images/car-placeholder.jpg"}" alt="${car.name}">
        <div class="car-details">
          <h3>${car.name}</h3>
          <p class="car-type">${car.type || "Sedan"}</p>
          <p class="car-price">$${car.pricePerDay}/day</p>
        </div>
      </div>
    `;

    // Set hidden input
    const carIdInput = document.getElementById("carId");
    if (carIdInput) {
      carIdInput.value = car.id;
    }
  }

  /**
   * Initialize booking form
   */
  function initializeBookingForm() {
    const bookingForm = document.getElementById("bookingForm");
    if (!bookingForm) return;

    // Set minimum dates
    setMinimumDates();

    // Handle form submission
    bookingForm.addEventListener("submit", handleBookingSubmit);

    // Calculate total on date change
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    if (startDateInput && endDateInput) {
      startDateInput.addEventListener("change", calculateTotal);
      endDateInput.addEventListener("change", calculateTotal);
    }
  }

  /**
   * Set minimum dates for date inputs
   */
  function setMinimumDates() {
    const today = new Date().toISOString().split("T")[0];

    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    if (startDateInput) {
      startDateInput.min = today;
    }

    if (endDateInput) {
      endDateInput.min = today;
    }
  }

  /**
   * Calculate total booking cost
   */
  function calculateTotal() {
    const startDate = document.getElementById("startDate")?.value;
    const endDate = document.getElementById("endDate")?.value;
    const totalElement = document.getElementById("totalCost");

    if (!startDate || !endDate || !selectedCar) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days > 0) {
      const total = days * (selectedCar.pricePerDay || 0);
      if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
      }
    }
  }

  /**
   * Handle booking form submission
   * BACKEND CALL: POST /api/bookings
   */
  async function handleBookingSubmit(e) {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // Get form data
    const formData = new FormData(e.target);
    const bookingData = {
      carId: formData.get("carId"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      pickupLocation: formData.get("pickupLocation"),
      dropoffLocation: formData.get("dropoffLocation"),
      additionalNotes: formData.get("additionalNotes"),
    };

    // Validate dates
    if (new Date(bookingData.startDate) >= new Date(bookingData.endDate)) {
      showNotification("End date must be after start date", "error");
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Processing...';

    try {
      // BACKEND REQUEST: Create booking
      const result = await BookingService.createBooking(bookingData);

      if (result.success) {
        console.log("Booking created successfully:", result.data);

        // Show success message
        showNotification("Booking created successfully!", "success");

        // Redirect to confirmation page or bookings page
        setTimeout(() => {
          window.location.href = `booking-confirmation.html?bookingId=${result.data.id}`;
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      showNotification(
        error.message || "Failed to create booking. Please try again.",
        "error",
      );

      // Restore button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  /**
   * Show notification message
   */
  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add("show"), 100);

    // Hide and remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
})();
