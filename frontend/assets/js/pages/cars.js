// FILE: assets/js/pages/cars.js

import { carService } from "../services/car.service.js";
import {
  formatCurrency,
  getQueryParams,
  setQueryParams,
} from "../base/helpers.js";
import { storage } from "../base/storage.js";
import { showLoader, hideLoader } from "../ui/loader.js";

export const initCars = async () => {
  await loadCars();
  setupFilters();
  setupSearch();
  setupSort();
};

let allCars = [];

/* ===================== LOAD CARS ===================== */
const loadCars = async () => {
  const container = document.querySelector("#cars-container");
  if (!container) return;

  showLoader();

  try {
    const params = getQueryParams();
    allCars = await carService.getAllCars(params);

    displayCars(allCars);
    updateFiltersFromURL();
  } catch (error) {
    container.innerHTML =
      '<p class="text-center text-danger">Failed to load cars. Please try again.</p>';
  } finally {
    hideLoader();
  }
};

/* ===================== DISPLAY CARS ===================== */
const displayCars = (cars) => {
  const container = document.querySelector("#cars-container");
  if (!container) return;

  if (!cars || cars.length === 0) {
    container.innerHTML =
      '<p class="text-center">No cars found matching your criteria.</p>';
    return;
  }

  const wishlist = storage.getWishlist();

  container.innerHTML = cars
    .map(
      (car) => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="car-card">
          <div class="car-image">
            <img src="${car.image}" alt="${car.name}"
              onerror="this.src='/assets/images/car-placeholder.jpg'">
            <span class="badge bg-primary">${car.type}</span>
            <button class="btn-wishlist ${
              wishlist.includes(car.id) ? "active" : ""
            }" data-car-id="${car.id}">
              <i class="icon-heart"></i>
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
              <span class="stars">
                ${"★".repeat(Math.floor(car.rating))}
                ${"☆".repeat(5 - Math.floor(car.rating))}
              </span>
              <span class="reviews">(${car.reviews} reviews)</span>
            </div>

            <div class="car-footer">
              <div class="price">
                <span class="amount">${formatCurrency(car.pricePerDay)}</span>
                <span class="period">/day</span>
              </div>
              <a href="/car-details?id=${car.id}" class="btn btn-primary">
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>
    `,
    )
    .join("");

  setupWishlistButtons();
};

/* ===================== WISHLIST ===================== */
const setupWishlistButtons = () => {
  document.querySelectorAll(".btn-wishlist").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const carId = btn.dataset.carId;

      if (btn.classList.contains("active")) {
        storage.removeFromWishlist(carId);
        btn.classList.remove("active");
      } else {
        storage.addToWishlist(carId);
        btn.classList.add("active");
      }
    });
  });
};

/* ===================== FILTERS ===================== */
const setupFilters = () => {
  const filterForm = document.querySelector("#filter-form");
  if (!filterForm) return;

  filterForm.addEventListener("change", async () => {
    const formData = new FormData(filterForm);
    const filters = {};

    if (formData.get("type")) filters.type = formData.get("type");
    if (formData.get("transmission"))
      filters.transmission = formData.get("transmission");
    if (formData.get("fuel")) filters.fuel = formData.get("fuel");
    if (formData.get("minPrice"))
      filters.minPrice = Number(formData.get("minPrice"));
    if (formData.get("maxPrice"))
      filters.maxPrice = Number(formData.get("maxPrice"));

    setQueryParams(filters);

    showLoader();
    const cars = await carService.getAllCars(filters);
    displayCars(cars);
    hideLoader();
  });

  document.querySelector("#clear-filters")?.addEventListener("click", () => {
    filterForm.reset();
    setQueryParams({});
    window.location.reload();
  });
};

/* ===================== SEARCH ===================== */
const setupSearch = () => {
  const searchInput = document.querySelector("#car-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    const filtered = allCars.filter(
      (car) =>
        car.name.toLowerCase().includes(term) ||
        car.brand.toLowerCase().includes(term) ||
        car.type.toLowerCase().includes(term),
    );

    displayCars(filtered);
  });
};

/* ===================== SORT ===================== */
const setupSort = () => {
  const sortSelect = document.querySelector("#sort-cars");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", (e) => {
    const sorted = [...allCars];
    const value = e.target.value;

    if (value === "price-low")
      sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (value === "price-high")
      sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (value === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (value === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));

    displayCars(sorted);
  });
};

/* ===================== URL → FILTER SYNC ===================== */
const updateFiltersFromURL = () => {
  const params = getQueryParams();
  const filterForm = document.querySelector("#filter-form");
  if (!filterForm) return;

  if (params.type) {
    filterForm
      .querySelector(`input[name="type"][value="${params.type}"]`)
      ?.click();
  }
  if (params.transmission) {
    filterForm
      .querySelector(
        `input[name="transmission"][value="${params.transmission}"]`,
      )
      ?.click();
  }
  if (params.fuel) {
    filterForm
      .querySelector(`input[name="fuel"][value="${params.fuel}"]`)
      ?.click();
  }
};
