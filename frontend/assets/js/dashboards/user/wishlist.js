// ============================================================================
// FILE: assets/js/dashboards/user/wishlist.js
// ============================================================================

/**
 * Wishlist Page
 * User's saved cars
 */

import CarService from "../../services/car.service.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import Helpers from "../../base/helpers.js";
import SidebarUser from "../../components/sidebar-user.js";

const WishlistPage = {
  init() {
    if (!AuthGuard.requireRole("USER")) return;

    SidebarUser.init();

    this.loadWishlist();
  },

  async loadWishlist() {
    const container = document.getElementById("wishlistContainer");

    if (!container) return;

    Loader.show("Loading wishlist...");

    try {
      const response = await CarService.getWishlist();

      Loader.hide();

      if (response.success && response.data) {
        if (response.data.length === 0) {
          container.innerHTML = `
            <div class="empty-state">
              <p>Your wishlist is empty</p>
              <a href="/cars.html" class="btn btn-primary">Browse Cars</a>
            </div>
          `;
        } else {
          container.innerHTML = response.data
            .map((car) => this.createWishlistCard(car))
            .join("");
        }
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Failed to load wishlist");
      console.error("Error:", error);
    }
  },

  createWishlistCard(car) {
    return `
      <div class="car-card">
        <div class="car-image">
          <img src="${car.image}" alt="${car.name}">
          <button class="wishlist-remove" data-car-id="${car.id}" onclick="window.WishlistPage.removeFromWishlist('${car.id}')">
            ❌
          </button>
        </div>
        <div class="car-info">
          <h3>${car.name}</h3>
          <p>${car.type} • ${car.transmission}</p>
          <div class="car-specs">
            <span>👤 ${car.seats}</span>
            <span>⚙️ ${car.transmission}</span>
          </div>
          <div class="car-footer">
            <div class="price">
              <span class="price-amount">${Helpers.formatCurrency(car.pricePerDay)}</span>
              <span class="price-period">/day</span>
            </div>
            <a href="/car-details.html?id=${car.id}" class="btn btn-primary btn-sm">Book Now</a>
          </div>
        </div>
      </div>
    `;
  },

  async removeFromWishlist(carId) {
    if (!confirm("Remove this car from wishlist?")) return;

    try {
      const response = await CarService.removeFromWishlist(carId);

      if (response.success) {
        Notifications.success("Removed from wishlist");
        this.loadWishlist();
      } else {
        Notifications.error("Failed to remove from wishlist");
      }
    } catch (error) {
      Notifications.error("Error removing from wishlist");
    }
  },
};

// Make available globally
window.WishlistPage = WishlistPage;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => WishlistPage.init());
} else {
  WishlistPage.init();
}

export default WishlistPage;
