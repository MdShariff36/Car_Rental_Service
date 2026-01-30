// ============================================================================
// AUTO PRIME RENTAL - PAGES LAYER (PART 2)
// More public pages
// ============================================================================

// ============================================================================
// FILE: assets/js/pages/car-details.js
// ============================================================================

/**
 * Car Details Page
 * Display single car with full details and booking option
 */

import Helpers from "../base/helpers.js";
import CarService from "../services/car.service.js";
import Loader from "../ui/loader.js";
import Notifications from "../ui/notifications.js";
import Storage from "../base/storage.js";

const CarDetailsPage = {
  carId: null,
  carData: null,

  init() {
    this.carId = Helpers.getUrlParam("id");

    if (!this.carId) {
      Notifications.error("Car not found");
      setTimeout(() => (window.location.href = "/cars.html"), 2000);
      return;
    }

    this.loadCarDetails();
    this.setupImageGallery();
    this.setupBookingButton();
    this.setupWishlistButton();
    this.loadReviews();
  },

  async loadCarDetails() {
    Loader.show("Loading car details...");

    try {
      const response = await CarService.getCarById(this.carId);

      Loader.hide();

      if (response.success && response.data) {
        this.carData = response.data;
        this.renderCarDetails();
      } else {
        Notifications.error("Failed to load car details");
        setTimeout(() => (window.location.href = "/cars.html"), 2000);
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error loading car");
      console.error("Error:", error);
    }
  },

  renderCarDetails() {
    const car = this.carData;

    // Update page title
    document.title = `${car.name} - Auto Prime Rental`;

    // Car name
    const nameElement = document.getElementById("carName");
    if (nameElement) nameElement.textContent = car.name;

    // Car type
    const typeElement = document.getElementById("carType");
    if (typeElement) typeElement.textContent = `${car.type} • ${car.fuelType}`;

    // Rating
    const ratingElement = document.getElementById("carRating");
    if (ratingElement)
      ratingElement.textContent = `⭐ ${car.rating || 4.5} (${car.reviewCount || 0} reviews)`;

    // Price
    const priceElement = document.getElementById("carPrice");
    if (priceElement)
      priceElement.textContent = Helpers.formatCurrency(car.pricePerDay);

    // Specifications
    this.renderSpecifications(car);

    // Features
    this.renderFeatures(car);

    // Description
    const descElement = document.getElementById("carDescription");
    if (descElement)
      descElement.textContent = car.description || "No description available";
  },

  renderSpecifications(car) {
    const specsContainer = document.getElementById("carSpecs");
    if (!specsContainer) return;

    specsContainer.innerHTML = `
      <div class="spec-item">
        <span class="spec-label">Seats</span>
        <span class="spec-value">👤 ${car.seats}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Transmission</span>
        <span class="spec-value">⚙️ ${car.transmission}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Fuel Type</span>
        <span class="spec-value">⛽ ${car.fuelType}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">KM Limit</span>
        <span class="spec-value">${car.unlimitedKm ? "♾️ Unlimited" : `📏 ${car.kmLimit} KM`}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Year</span>
        <span class="spec-value">📅 ${car.year || "N/A"}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Location</span>
        <span class="spec-value">📍 ${car.location || "Multiple Cities"}</span>
      </div>
    `;
  },

  renderFeatures(car) {
    const featuresContainer = document.getElementById("carFeatures");
    if (!featuresContainer) return;

    const features = car.features || [
      "Air Conditioning",
      "Bluetooth",
      "USB Charging",
      "Power Windows",
      "ABS",
      "Airbags",
    ];

    featuresContainer.innerHTML = features
      .map((feature) => `<span class="feature-badge">✓ ${feature}</span>`)
      .join("");
  },

  setupImageGallery() {
    const mainImage = document.getElementById("mainCarImage");
    const thumbnails = document.querySelectorAll(".thumbnail-image");

    if (!mainImage) return;

    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainImage.src = thumb.src;

        thumbnails.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });
  },

  setupBookingButton() {
    const bookBtn = document.getElementById("bookNowBtn");

    if (!bookBtn) return;

    bookBtn.addEventListener("click", () => {
      if (!this.carData) return;

      // Get search params if available
      const pickupDate = Helpers.getUrlParam("pickupDate");
      const dropDate = Helpers.getUrlParam("dropDate");

      let bookingUrl = `/booking.html?carId=${this.carId}`;

      if (pickupDate) bookingUrl += `&pickupDate=${pickupDate}`;
      if (dropDate) bookingUrl += `&dropDate=${dropDate}`;

      window.location.href = bookingUrl;
    });
  },

  setupWishlistButton() {
    const wishlistBtn = document.getElementById("wishlistBtn");

    if (!wishlistBtn) return;

    wishlistBtn.addEventListener("click", async () => {
      if (!Storage.isAuthenticated()) {
        Notifications.info("Please login to add to wishlist");
        setTimeout(() => (window.location.href = "/login.html"), 1500);
        return;
      }

      try {
        const isWishlisted = wishlistBtn.classList.contains("active");

        if (isWishlisted) {
          await CarService.removeFromWishlist(this.carId);
          wishlistBtn.classList.remove("active");
          wishlistBtn.innerHTML = "🤍 Add to Wishlist";
          Notifications.success("Removed from wishlist");
        } else {
          await CarService.addToWishlist(this.carId);
          wishlistBtn.classList.add("active");
          wishlistBtn.innerHTML = "❤️ In Wishlist";
          Notifications.success("Added to wishlist");
        }
      } catch (error) {
        Notifications.error("Failed to update wishlist");
      }
    });
  },

  async loadReviews() {
    const reviewsContainer = document.getElementById("reviewsContainer");

    if (!reviewsContainer) return;

    try {
      const response = await CarService.getReviews(this.carId);

      if (response.success && response.data) {
        this.renderReviews(response.data);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  },

  renderReviews(reviews) {
    const reviewsContainer = document.getElementById("reviewsContainer");

    if (!reviewsContainer) return;

    if (reviews.length === 0) {
      reviewsContainer.innerHTML =
        '<p class="text-muted">No reviews yet. Be the first to review!</p>';
      return;
    }

    reviewsContainer.innerHTML = reviews
      .map(
        (review) => `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-info">
            <img src="${review.userAvatar || "assets/images/default-avatar.png"}" alt="${review.userName}" class="reviewer-avatar">
            <div>
              <strong>${review.userName}</strong>
              <p class="review-date">${Helpers.formatDate(review.createdAt)}</p>
            </div>
          </div>
          <div class="review-rating">⭐ ${review.rating}/5</div>
        </div>
        <p class="review-text">${review.comment}</p>
      </div>
    `,
      )
      .join("");
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => CarDetailsPage.init());
} else {
  CarDetailsPage.init();
}

export default CarDetailsPage;
