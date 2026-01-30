// ============================================================================
// FILE: assets/js/pages/cars.js
// ============================================================================

/**
 * Cars Listing Page
 * Handles car search, filter, and sorting
 */

import Helpers from "../base/helpers.js";
import CarService from "../services/car.service.js";
import Loader from "../ui/loader.js";
import Notifications from "../ui/notifications.js";
import Storage from "../base/storage.js";

const CarsPage = {
  currentFilters: {},
  currentSort: "popular",
  currentPage: 1,
  carsPerPage: 9,

  init() {
    this.loadUrlParams();
    this.setupFilters();
    this.setupSort();
    this.setupPriceRange();
    this.setupWishlistButtons();
    this.loadCars();
  },

  loadUrlParams() {
    const params = new URLSearchParams(window.location.search);

    this.currentFilters = {
      pickupCity: params.get("pickupCity") || "",
      dropCity: params.get("dropCity") || "",
      pickupDate: params.get("pickupDate") || "",
      dropDate: params.get("dropDate") || "",
      pickupTime: params.get("pickupTime") || "",
      dropTime: params.get("dropTime") || "",
      type: params.get("type") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      transmission: params.get("transmission") || "",
      fuelType: params.get("fuelType") || "",
      seats: params.get("seats") || "",
    };

    this.populateFilterInputs();
  },

  populateFilterInputs() {
    Object.keys(this.currentFilters).forEach((key) => {
      const input = document.getElementById(key);
      if (input && this.currentFilters[key]) {
        input.value = this.currentFilters[key];
      }
    });
  },

  setupFilters() {
    const filterForm = document.getElementById("filterForm");

    if (!filterForm) return;

    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.applyFilters();
    });

    const filterInputs = filterForm.querySelectorAll("input, select");
    filterInputs.forEach((input) => {
      input.addEventListener(
        "change",
        Helpers.debounce(() => {
          this.applyFilters();
        }, 500),
      );
    });

    const clearBtn = document.getElementById("clearFilters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearFilters());
    }
  },

  setupSort() {
    const sortSelect = document.getElementById("sortSelect");

    if (!sortSelect) return;

    sortSelect.addEventListener("change", () => {
      this.currentSort = sortSelect.value;
      this.loadCars();
    });
  },

  setupPriceRange() {
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const minPriceDisplay = document.getElementById("minPriceDisplay");
    const maxPriceDisplay = document.getElementById("maxPriceDisplay");

    if (minPriceInput && minPriceDisplay) {
      minPriceInput.addEventListener("input", () => {
        minPriceDisplay.textContent = Helpers.formatCurrency(
          minPriceInput.value,
        );
      });
    }

    if (maxPriceInput && maxPriceDisplay) {
      maxPriceInput.addEventListener("input", () => {
        maxPriceDisplay.textContent = Helpers.formatCurrency(
          maxPriceInput.value,
        );
      });
    }
  },

  setupWishlistButtons() {
    document.addEventListener("click", async (e) => {
      if (e.target.closest(".wishlist-btn")) {
        const btn = e.target.closest(".wishlist-btn");
        const carId = btn.getAttribute("data-car-id");

        if (!Storage.isAuthenticated()) {
          Notifications.info("Please login to add to wishlist");
          return;
        }

        await this.toggleWishlist(carId, btn);
      }
    });
  },

  async toggleWishlist(carId, btn) {
    const heartIcon = btn.querySelector(".heart-icon");
    const isWishlisted = heartIcon.textContent === "❤️";

    try {
      if (isWishlisted) {
        await CarService.removeFromWishlist(carId);
        heartIcon.textContent = "🤍";
        Notifications.success("Removed from wishlist");
      } else {
        await CarService.addToWishlist(carId);
        heartIcon.textContent = "❤️";
        Notifications.success("Added to wishlist");
      }
    } catch (error) {
      Notifications.error("Failed to update wishlist");
    }
  },

  applyFilters() {
    const filterForm = document.getElementById("filterForm");
    if (!filterForm) return;

    const formData = new FormData(filterForm);
    this.currentFilters = {};

    for (let [key, value] of formData.entries()) {
      if (value) this.currentFilters[key] = value;
    }

    this.currentPage = 1;

    const params = new URLSearchParams(this.currentFilters);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );

    this.loadCars();
  },

  clearFilters() {
    this.currentFilters = {};
    this.currentPage = 1;

    const filterForm = document.getElementById("filterForm");
    if (filterForm) filterForm.reset();

    window.history.replaceState({}, "", window.location.pathname);
    this.loadCars();
  },

  async loadCars() {
    const container = document.getElementById("carsGrid");
    const resultCount = document.getElementById("resultCount");

    if (!container) return;

    Loader.show("Loading cars...");

    try {
      const params = {
        ...this.currentFilters,
        sort: this.currentSort,
        page: this.currentPage,
        limit: this.carsPerPage,
      };

      const response = await CarService.getCars(params);

      Loader.hide();

      if (response.success && response.data) {
        const { cars, total } = response.data;

        if (cars.length === 0) {
          container.innerHTML = `
            <div class="no-results">
              <p>No cars found matching your criteria</p>
              <button class="btn btn-primary" onclick="window.CarsPage.clearFilters()">Clear Filters</button>
            </div>
          `;
        } else {
          container.innerHTML = cars
            .map((car) => this.createCarCard(car))
            .join("");
        }

        if (resultCount) {
          resultCount.textContent = `${total} cars found`;
        }

        this.setupPagination(total);
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Failed to load cars");
      console.error("Error loading cars:", error);
    }
  },

  createCarCard(car) {
    return `
      <div class="car-card" data-car-id="${car.id}">
        <div class="car-image">
          <img src="${car.image || "assets/images/cars/default.jpg"}" alt="${car.name}" loading="lazy">
          ${car.featured ? '<span class="badge-featured">Featured</span>' : ""}
          <button class="wishlist-btn" data-car-id="${car.id}">
            <span class="heart-icon">${car.isWishlisted ? "❤️" : "🤍"}</span>
          </button>
        </div>
        <div class="car-info">
          <h3 class="car-name">${car.name}</h3>
          <p class="car-type">${car.type} • ${car.fuelType}</p>
          <div class="car-rating">
            ⭐ ${car.rating || 4.5} (${car.reviews || 0} reviews)
          </div>
          <div class="car-specs">
            <span>👤 ${car.seats} Seats</span>
            <span>⚙️ ${car.transmission}</span>
            ${car.unlimitedKm ? "<span>♾️ Unlimited KM</span>" : `<span>📏 ${car.kmLimit} KM</span>`}
          </div>
          <div class="car-footer">
            <div class="price">
              <span class="price-amount">${Helpers.formatCurrency(car.pricePerDay)}</span>
              <span class="price-period">/day</span>
            </div>
            <a href="car-details.html?id=${car.id}" class="btn btn-primary btn-sm">View Details</a>
          </div>
        </div>
      </div>
    `;
  },

  setupPagination(totalItems) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / this.carsPerPage);

    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let html = '<div class="pagination-controls">';

    html += `
      <button class="btn-page" ${this.currentPage === 1 ? "disabled" : ""} onclick="window.CarsPage.goToPage(${this.currentPage - 1})">
        ← Previous
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= this.currentPage - 1 && i <= this.currentPage + 1)
      ) {
        html += `
          <button class="btn-page ${i === this.currentPage ? "active" : ""}" onclick="window.CarsPage.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += '<span class="pagination-dots">...</span>';
      }
    }

    html += `
      <button class="btn-page" ${this.currentPage === totalPages ? "disabled" : ""} onclick="window.CarsPage.goToPage(${this.currentPage + 1})">
        Next →
      </button>
    `;

    html += "</div>";
    paginationContainer.innerHTML = html;
  },

  goToPage(page) {
    this.currentPage = page;
    this.loadCars();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
};

window.CarsPage = CarsPage;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => CarsPage.init());
} else {
  CarsPage.init();
}

export default CarsPage;
