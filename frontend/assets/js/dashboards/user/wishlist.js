// FILE: assets/js/dashboards/user/wishlist.js

import { requireUser } from "../../../core/auth-guard.js";
import { initUserSidebar } from "../../../components/sidebar-user.js";
import { carService } from "../../../services/car.service.js";
import { storage } from "../../../base/storage.js";
import { formatCurrency } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";

export const initWishlist = async () => {
  if (!requireUser()) return;

  initUserSidebar();
  await loadWishlist();
};

const loadWishlist = async () => {
  showLoader();

  try {
    const wishlistIds = storage.getWishlist();

    if (wishlistIds.length === 0) {
      displayEmptyWishlist();
      return;
    }

    const allCars = await carService.getAllCars();
    const wishlistCars = allCars.filter((car) => wishlistIds.includes(car.id));

    displayWishlist(wishlistCars);
  } catch (error) {
    console.error("Failed to load wishlist:", error);
  } finally {
    hideLoader();
  }
};

const displayEmptyWishlist = () => {
  const container = document.querySelector("#wishlist-container");
  if (!container) return;

  container.innerHTML = `
    <div class="text-center py-5">
      <i class="icon-heart-outline" style="font-size: 4rem; color: #ccc;"></i>
      <h3 class="mt-3">Your wishlist is empty</h3>
      <p>Start adding cars you love!</p>
      <a href="/cars" class="btn btn-primary">Browse Cars</a>
    </div>
  `;
};

const displayWishlist = (cars) => {
  const container = document.querySelector("#wishlist-container");
  if (!container) return;

  container.innerHTML = cars
    .map(
      (car) => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="car-card">
        <div class="car-image">
          <img src="${car.image}" alt="${car.name}" onerror="this.src='/assets/images/car-placeholder.jpg'">
          <button class="btn-remove-wishlist" data-car-id="${car.id}">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="car-details">
          <h3 class="car-name">${car.name}</h3>
          <div class="car-specs">
            <span><i class="icon-seats"></i> ${car.seats} Seats</span>
            <span><i class="icon-transmission"></i> ${car.transmission}</span>
            <span><i class="icon-fuel"></i> ${car.fuel}</span>
          </div>
          <div class="car-rating">
            <span class="stars">${"★".repeat(Math.floor(car.rating))}${"☆".repeat(5 - Math.floor(car.rating))}</span>
            <span class="reviews">(${car.reviews} reviews)</span>
          </div>
          <div class="car-footer">
            <div class="price">
              <span class="amount">${formatCurrency(car.pricePerDay)}</span>
              <span class="period">/day</span>
            </div>
            <a href="/car-details?id=${car.id}" class="btn btn-primary">View Details</a>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  setupRemoveButtons();
};

const setupRemoveButtons = () => {
  document.querySelectorAll(".btn-remove-wishlist").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const carId = btn.getAttribute("data-car-id");

      storage.removeFromWishlist(carId);
      showNotification("Removed from wishlist", "success");

      await loadWishlist();
    });
  });
};
