// ============================================================================
// FILE: assets/js/pages/booking.js
// ============================================================================

/**
 * Booking Page
 * Multi-step booking form
 */

import Helpers from "../base/helpers.js";
import Validators from "../base/validators.js";
import CarService from "../services/car.service.js";
import BookingService from "../services/booking.service.js";
import Loader from "../ui/loader.js";
import Notifications from "../ui/notifications.js";
import Storage from "../base/storage.js";
import AuthGuard from "../core/auth-guard.js";

const BookingPage = {
  carId: null,
  carData: null,
  currentStep: 1,
  totalSteps: 3,
  bookingData: {
    addOns: [],
    totalPrice: 0,
  },

  init() {
    // Require authentication
    if (!AuthGuard.requireAuth()) return;

    this.carId = Helpers.getUrlParam("carId");

    if (!this.carId) {
      Notifications.error("Invalid booking request");
      setTimeout(() => (window.location.href = "/cars.html"), 2000);
      return;
    }

    this.loadCarDetails();
    this.setupStepNavigation();
    this.setupDateSelection();
    this.setupAddOns();
    this.setupFormSubmission();
  },

  async loadCarDetails() {
    Loader.show("Loading...");

    try {
      const response = await CarService.getCarById(this.carId);

      Loader.hide();

      if (response.success && response.data) {
        this.carData = response.data;
        this.renderCarSummary();

        // Pre-fill dates from URL if available
        const pickupDate = Helpers.getUrlParam("pickupDate");
        const dropDate = Helpers.getUrlParam("dropDate");

        if (pickupDate)
          document.getElementById("pickupDate").value = pickupDate;
        if (dropDate) document.getElementById("dropDate").value = dropDate;

        this.calculatePrice();
      } else {
        Notifications.error("Failed to load car details");
        setTimeout(() => (window.location.href = "/cars.html"), 2000);
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error loading car");
    }
  },

  renderCarSummary() {
    const summaryContainer = document.getElementById("carSummary");

    if (!summaryContainer) return;

    const car = this.carData;

    summaryContainer.innerHTML = `
      <div class="booking-car-card">
        <img src="${car.image || "assets/images/cars/default.jpg"}" alt="${car.name}" class="booking-car-image">
        <div>
          <h4>${car.name}</h4>
          <p>${car.type} • ${car.transmission}</p>
          <p class="car-price">${Helpers.formatCurrency(car.pricePerDay)}/day</p>
        </div>
      </div>
    `;
  },

  setupStepNavigation() {
    const nextBtns = document.querySelectorAll(".btn-next-step");
    const prevBtns = document.querySelectorAll(".btn-prev-step");

    nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.validateCurrentStep()) {
          this.goToStep(this.currentStep + 1);
        }
      });
    });

    prevBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.goToStep(this.currentStep - 1);
      });
    });
  },

  goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;

    // Hide all steps
    document.querySelectorAll(".booking-step").forEach((stepEl) => {
      stepEl.classList.remove("active");
    });

    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
      currentStepEl.classList.add("active");
    }

    // Update step indicators
    document.querySelectorAll(".step-indicator").forEach((indicator, index) => {
      indicator.classList.remove("active", "completed");
      if (index + 1 < step) {
        indicator.classList.add("completed");
      } else if (index + 1 === step) {
        indicator.classList.add("active");
      }
    });

    this.currentStep = step;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  validateCurrentStep() {
    if (this.currentStep === 1) {
      const pickupDate = document.getElementById("pickupDate")?.value;
      const dropDate = document.getElementById("dropDate")?.value;
      const pickupTime = document.getElementById("pickupTime")?.value;
      const dropTime = document.getElementById("dropTime")?.value;

      if (!pickupDate || !dropDate || !pickupTime || !dropTime) {
        Notifications.warning("Please fill in all date and time fields");
        return false;
      }

      const validation = Validators.dateRange(pickupDate, dropDate);
      if (!validation.valid) {
        Notifications.error(validation.message);
        return false;
      }

      return true;
    }

    if (this.currentStep === 2) {
      // Step 2 is optional (add-ons)
      return true;
    }

    if (this.currentStep === 3) {
      const fullName = document.getElementById("fullName")?.value;
      const phone = document.getElementById("phone")?.value;
      const email = document.getElementById("email")?.value;

      if (!fullName || !phone || !email) {
        Notifications.warning("Please fill in all required fields");
        return false;
      }

      const phoneValidation = Validators.phone(phone);
      if (!phoneValidation.valid) {
        Notifications.error(phoneValidation.message);
        return false;
      }

      const emailValidation = Validators.email(email);
      if (!emailValidation.valid) {
        Notifications.error(emailValidation.message);
        return false;
      }

      return true;
    }

    return true;
  },

  setupDateSelection() {
    const pickupDate = document.getElementById("pickupDate");
    const dropDate = document.getElementById("dropDate");

    const today = Helpers.getTodayDate();

    if (pickupDate) {
      pickupDate.min = today;
      pickupDate.addEventListener("change", () => {
        if (dropDate) {
          dropDate.min = pickupDate.value;
        }
        this.calculatePrice();
      });
    }

    if (dropDate) {
      dropDate.min = today;
      dropDate.addEventListener("change", () => {
        this.calculatePrice();
      });
    }
  },

  setupAddOns() {
    const addOnCheckboxes = document.querySelectorAll(".addon-checkbox");

    addOnCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.updateAddOns();
        this.calculatePrice();
      });
    });
  },

  updateAddOns() {
    const addOnCheckboxes = document.querySelectorAll(
      ".addon-checkbox:checked",
    );

    this.bookingData.addOns = Array.from(addOnCheckboxes).map((checkbox) => ({
      id: checkbox.value,
      name: checkbox.getAttribute("data-name"),
      price: parseFloat(checkbox.getAttribute("data-price")),
    }));
  },

  async calculatePrice() {
    const pickupDate = document.getElementById("pickupDate")?.value;
    const dropDate = document.getElementById("dropDate")?.value;

    if (!pickupDate || !dropDate || !this.carData) return;

    const days = Helpers.calculateDaysBetween(pickupDate, dropDate);
    const basePrice = this.carData.pricePerDay * days;
    const addOnsPrice = this.bookingData.addOns.reduce(
      (sum, addon) => sum + addon.price,
      0,
    );
    const totalPrice = basePrice + addOnsPrice;

    this.bookingData.totalPrice = totalPrice;

    // Update price display
    const priceElement = document.getElementById("totalPrice");
    if (priceElement) {
      priceElement.textContent = Helpers.formatCurrency(totalPrice);
    }

    const daysElement = document.getElementById("bookingDays");
    if (daysElement) {
      daysElement.textContent = `${days} day${days > 1 ? "s" : ""}`;
    }
  },

  setupFormSubmission() {
    const bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) return;

    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!this.validateCurrentStep()) return;

      await this.submitBooking();
    });
  },

  async submitBooking() {
    Loader.show("Creating booking...");

    const bookingData = {
      carId: this.carId,
      pickupDate: document.getElementById("pickupDate")?.value,
      dropDate: document.getElementById("dropDate")?.value,
      pickupTime: document.getElementById("pickupTime")?.value,
      dropTime: document.getElementById("dropTime")?.value,
      fullName: document.getElementById("fullName")?.value,
      phone: document.getElementById("phone")?.value,
      email: document.getElementById("email")?.value,
      address: document.getElementById("address")?.value,
      addOns: this.bookingData.addOns,
      totalPrice: this.bookingData.totalPrice,
    };

    try {
      const response = await BookingService.createBooking(bookingData);

      Loader.hide();

      if (response.success) {
        Notifications.success("Booking created successfully!");

        // Redirect to confirmation page
        setTimeout(() => {
          window.location.href = `/booking-confirm.html?bookingId=${response.data.id}`;
        }, 1500);
      } else {
        Notifications.error(response.error || "Failed to create booking");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error creating booking");
      console.error("Booking error:", error);
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => BookingPage.init());
} else {
  BookingPage.init();
}

export default BookingPage;
