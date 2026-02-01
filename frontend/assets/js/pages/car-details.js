// FILE: assets/js/pages/car-details.js

import { carService } from "../services/car.service.js";
import {
  formatCurrency,
  getQueryParams,
  calculateDaysBetween,
} from "../base/helpers.js";
import { storage } from "../base/storage.js";
import { isAuthenticated } from "../core/auth-guard.js";
import { showLoader, hideLoader } from "../ui/loader.js";
import { showNotification } from "../ui/notifications.js";

export const initCarDetails = async () => {
  const params = getQueryParams();
  const carId = params.id;

  if (!carId) {
    showNotification("Invalid car ID", "error");
    window.location.href = "/cars";
    return;
  }

  await loadCarDetails(carId);
  setupBookingForm(carId);
  setupWishlistButton(carId);
  initImageGallery();
};

const loadCarDetails = async (carId) => {
  showLoader();

  try {
    const car = await carService.getCarById(carId);
    displayCarDetails(car);
  } catch (error) {
    showNotification("Failed to load car details", "error");
    window.location.href = "/cars";
  } finally {
    hideLoader();
  }
};

const displayCarDetails = (car) => {
  const nameEl = document.querySelector("#car-name");
  const imageEl = document.querySelector("#car-main-image");
  const priceEl = document.querySelector("#car-price");
  const ratingEl = document.querySelector("#car-rating");
  const specsEl = document.querySelector("#car-specs");
  const featuresEl = document.querySelector("#car-features");
  const descEl = document.querySelector("#car-description");

  if (nameEl) nameEl.textContent = car.name;
  if (imageEl) imageEl.src = car.image;
  if (priceEl)
    priceEl.innerHTML = `${formatCurrency(car.pricePerDay)} <span>/day</span>`;

  if (ratingEl) {
    ratingEl.innerHTML = `
      <span class="stars">${"★".repeat(Math.floor(car.rating))}${"☆".repeat(5 - Math.floor(car.rating))}</span>
      <span class="reviews">(${car.reviews} reviews)</span>
    `;
  }

  if (specsEl) {
    specsEl.innerHTML = `
      <div class="spec-item">
        <span class="label">Type:</span>
        <span class="value">${car.type}</span>
      </div>
      <div class="spec-item">
        <span class="label">Seats:</span>
        <span class="value">${car.seats}</span>
      </div>
      <div class="spec-item">
        <span class="label">Transmission:</span>
        <span class="value">${car.transmission}</span>
      </div>
      <div class="spec-item">
        <span class="label">Fuel:</span>
        <span class="value">${car.fuel}</span>
      </div>
      <div class="spec-item">
        <span class="label">Year:</span>
        <span class="value">${car.year}</span>
      </div>
    `;
  }

  if (featuresEl && car.features) {
    featuresEl.innerHTML = car.features
      .map(
        (f) => `
      <span class="feature-badge">${f}</span>
    `,
      )
      .join("");
  }

  if (descEl) descEl.textContent = car.description;
};

const setupBookingForm = (carId) => {
  const form = document.querySelector("#booking-form");
  if (!form) return;

  const startDateInput = form.querySelector("#startDate");
  const endDateInput = form.querySelector("#endDate");
  const totalDaysEl = document.querySelector("#total-days");
  const totalAmountEl = document.querySelector("#total-amount");

  const today = new Date().toISOString().split("T")[0];
  if (startDateInput) startDateInput.min = today;
  if (endDateInput) endDateInput.min = today;

  const updateTotal = async () => {
    const startDate = startDateInput?.value;
    const endDate = endDateInput?.value;

    if (!startDate || !endDate) return;

    try {
      const car = await carService.getCarById(carId);
      const days = calculateDaysBetween(startDate, endDate);
      const total = days * car.pricePerDay;

      if (totalDaysEl) totalDaysEl.textContent = days;
      if (totalAmountEl) totalAmountEl.textContent = formatCurrency(total);
    } catch (error) {
      console.error("Failed to calculate total:", error);
    }
  };

  startDateInput?.addEventListener("change", () => {
    if (endDateInput) endDateInput.min = startDateInput.value;
    updateTotal();
  });

  endDateInput?.addEventListener("change", updateTotal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      showNotification("Please login to book a car", "warning");
      window.location.href = "/login";
      return;
    }

    const formData = new FormData(form);
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    if (!startDate || !endDate) {
      showNotification("Please select booking dates", "error");
      return;
    }

    try {
      const car = await carService.getCarById(carId);
      const days = calculateDaysBetween(startDate, endDate);
      const total = days * car.pricePerDay;

      const bookingData = {
        carId,
        car,
        startDate,
        endDate,
        totalDays: days,
        pricePerDay: car.pricePerDay,
        totalAmount: total,
        pickupLocation: formData.get("pickupLocation"),
        dropoffLocation: formData.get("dropoffLocation"),
      };

      storage.set("pending_booking", bookingData);
      window.location.href = "/booking";
    } catch (error) {
      showNotification("Failed to process booking", "error");
    }
  });
};

const setupWishlistButton = (carId) => {
  const btn = document.querySelector("#wishlist-btn");
  if (!btn) return;

  const wishlist = storage.getWishlist();
  if (wishlist.includes(carId)) {
    btn.classList.add("active");
    btn.innerHTML = '<i class="icon-heart-filled"></i> Remove from Wishlist';
  }

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      storage.removeFromWishlist(carId);
      btn.classList.remove("active");
      btn.innerHTML = '<i class="icon-heart"></i> Add to Wishlist';
      showNotification("Removed from wishlist", "success");
    } else {
      storage.addToWishlist(carId);
      btn.classList.add("active");
      btn.innerHTML = '<i class="icon-heart-filled"></i> Remove from Wishlist';
      showNotification("Added to wishlist", "success");
    }
  });
};

const initImageGallery = () => {
  const thumbnails = document.querySelectorAll(".gallery-thumbnail");
  const mainImage = document.querySelector("#car-main-image");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const src = thumb.getAttribute("data-image");
      if (mainImage && src) {
        mainImage.src = src;
      }

      thumbnails.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
};
