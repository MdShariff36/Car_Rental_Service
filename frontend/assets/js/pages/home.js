// ============================================================================
// AUTO PRIME RENTAL - PAGES LAYER (PART 1)
// Public pages JavaScript
// ============================================================================

// ============================================================================
// FILE: assets/js/pages/home.js
// ============================================================================

/**
 * Home Page
 * Handles home page functionality
 */

import Helpers from "../base/helpers.js";
import CarService from "../services/car.service.js";
import Loader from "../ui/loader.js";
import Notifications from "../ui/notifications.js";

const HomePage = {
  /**
   * Initialize home page
   */
  init() {
    this.setupSearchForm();
    this.setupDateInputs();
    this.loadPopularCars();
    this.setupCounters();
    this.setupCategoryCards();
  },

  /**
   * Setup search form
   */
  setupSearchForm() {
    const searchBtn = document.getElementById("searchCarsBtn");

    if (!searchBtn) return;

    searchBtn.addEventListener("click", () => {
      const pickupCity = document.getElementById("pickupCity")?.value;
      const dropCity = document.getElementById("dropCity")?.value;
      const pickupDate = document.getElementById("pickupDate")?.value;
      const dropDate = document.getElementById("dropDate")?.value;
      const pickupTime = document.getElementById("pickupTime")?.value;
      const dropTime = document.getElementById("dropTime")?.value;

      // Validate inputs
      if (!pickupCity || !pickupDate || !pickupTime) {
        Notifications.warning("Please fill in pickup details");
        return;
      }

      if (!dropCity || !dropDate || !dropTime) {
        Notifications.warning("Please fill in drop-off details");
        return;
      }

      // Build search URL
      const params = new URLSearchParams({
        pickupCity,
        dropCity,
        pickupDate,
        dropDate,
        pickupTime,
        dropTime,
      });

      window.location.href = `/cars.html?${params.toString()}`;
    });
  },

  /**
   * Setup date inputs
   */
  setupDateInputs() {
    const pickupDate = document.getElementById("pickupDate");
    const dropDate = document.getElementById("dropDate");

    const today = Helpers.getTodayDate();

    if (pickupDate) {
      pickupDate.min = today;
      pickupDate.value = today;
    }

    if (dropDate) {
      dropDate.min = today;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dropDate.value = tomorrow.toISOString().split("T")[0];
    }

    if (pickupDate && dropDate) {
      pickupDate.addEventListener("change", () => {
        dropDate.min = pickupDate.value;
        if (dropDate.value < pickupDate.value) {
          const nextDay = new Date(pickupDate.value);
          nextDay.setDate(nextDay.getDate() + 1);
          dropDate.value = nextDay.toISOString().split("T")[0];
        }
      });
    }
  },

  /**
   * Load popular cars
   */
  async loadPopularCars() {
    const container = document.getElementById("popularCarsGrid");
    const skeleton = document.getElementById("carsSkeletonLoader");

    if (!container) return;

    try {
      const response = await CarService.getPopularCars(6);

      if (skeleton) skeleton.style.display = "none";

      if (response.success && response.data) {
        container.innerHTML = response.data
          .map((car) => this.createCarCard(car))
          .join("");
      } else {
        container.innerHTML =
          '<p class="text-center">No cars available at the moment</p>';
      }
    } catch (error) {
      console.error("Error loading cars:", error);
      if (skeleton) skeleton.style.display = "none";
      container.innerHTML = '<p class="text-center">Failed to load cars</p>';
    }
  },

  /**
   * Create car card HTML
   */
  createCarCard(car) {
    return `
      <div class="car-card">
        <div class="car-image">
          <img src="${car.image || "assets/images/cars/default.jpg"}" alt="${car.name}">
          ${car.featured ? '<span class="badge-featured">Featured</span>' : ""}
        </div>
        <div class="car-info">
          <h3 class="car-name">${car.name}</h3>
          <p class="car-type">${car.type} • ${car.fuelType}</p>
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
            <a href="car-details.html?id=${car.id}" class="btn btn-primary btn-sm">Book Now</a>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Setup animated counters
   */
  setupCounters() {
    const counters = document.querySelectorAll(".counter");

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      if (!target) return;

      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => observer.observe(counter));
  },

  /**
   * Setup category cards
   */
  setupCategoryCards() {
    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        console.log("Category clicked:", card.querySelector("h3")?.textContent);
      });
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => HomePage.init());
} else {
  HomePage.init();
}

export default HomePage;
