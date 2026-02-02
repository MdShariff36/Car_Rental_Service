/**
 * Cars Listing Page (cars.html)
 * REQUIRES BACKEND: GET /api/cars
 * Displays all available cars from backend
 */

(() => {
  "use strict";

  let allCars = [];
  let filteredCars = [];

  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("Cars page loaded - fetching cars from backend...");

    // Load cars from backend
    await loadCars();

    // Initialize filters
    initializeFilters();
  });

  /**
   * Load cars from backend
   * BACKEND CALL: GET /api/cars
   */
  async function loadCars() {
    const container = document.getElementById("carsContainer");
    const loadingElement = document.getElementById("loadingSpinner");
    const errorElement = document.getElementById("errorMessage");

    // Show loading state
    if (loadingElement) loadingElement.style.display = "block";
    if (container) container.innerHTML = "";
    if (errorElement) errorElement.style.display = "none";

    try {
      // BACKEND REQUEST: Get all cars
      const result = await CarService.getAllCars();

      if (result.success) {
        allCars = result.data;
        filteredCars = [...allCars];

        console.log(`Loaded ${allCars.length} cars from backend`);

        // Render cars
        renderCars(filteredCars);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to load cars:", error);

      // Show error message
      if (errorElement) {
        errorElement.textContent =
          "Failed to load cars. Please try again later.";
        errorElement.style.display = "block";
      }

      // Show fallback UI or empty state
      if (container) {
        container.innerHTML = `
          <div class="error-state">
            <p>Unable to load cars at this time.</p>
            <button onclick="location.reload()" class="btn-retry">Retry</button>
          </div>
        `;
      }
    } finally {
      // Hide loading state
      if (loadingElement) loadingElement.style.display = "none";
    }
  }

  /**
   * Render cars to the DOM
   */
  function renderCars(cars) {
    const container = document.getElementById("carsContainer");
    if (!container) return;

    if (cars.length === 0) {
      container.innerHTML =
        '<div class="no-results"><p>No cars found matching your criteria.</p></div>';
      return;
    }

    container.innerHTML = cars
      .map(
        (car) => `
      <div class="car-card" data-car-id="${car.id}">
        <div class="car-image">
          <img src="${car.imageUrl || "assets/images/car-placeholder.jpg"}" alt="${car.name}">
          ${car.featured ? '<span class="badge-featured">Featured</span>' : ""}
        </div>
        <div class="car-details">
          <h3 class="car-name">${car.name}</h3>
          <p class="car-type">${car.type || "Sedan"}</p>
          <div class="car-specs">
            <span class="spec"><i class="icon-seats"></i> ${car.seats || 5} Seats</span>
            <span class="spec"><i class="icon-transmission"></i> ${car.transmission || "Automatic"}</span>
            <span class="spec"><i class="icon-fuel"></i> ${car.fuelType || "Petrol"}</span>
          </div>
          <div class="car-footer">
            <div class="car-price">
              <span class="price-amount">$${car.pricePerDay || 0}</span>
              <span class="price-unit">/day</span>
            </div>
            <a href="car-details.html?id=${car.id}" class="btn-view-details">View Details</a>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    // Update results count
    const countElement = document.getElementById("resultsCount");
    if (countElement) {
      countElement.textContent = `${cars.length} car${cars.length !== 1 ? "s" : ""} found`;
    }
  }

  /**
   * Initialize filter functionality
   */
  function initializeFilters() {
    const filterForm = document.getElementById("filterForm");
    if (!filterForm) return;

    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilters();
    });

    // Real-time filtering on input change
    const filterInputs = filterForm.querySelectorAll("input, select");
    filterInputs.forEach((input) => {
      input.addEventListener("change", applyFilters);
    });
  }

  /**
   * Apply filters to cars
   */
  function applyFilters() {
    const typeFilter = document.getElementById("filterType")?.value;
    const minPrice =
      parseFloat(document.getElementById("filterMinPrice")?.value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("filterMaxPrice")?.value) || Infinity;
    const transmission = document.getElementById("filterTransmission")?.value;

    filteredCars = allCars.filter((car) => {
      let matches = true;

      if (typeFilter && typeFilter !== "all") {
        matches = matches && car.type === typeFilter;
      }

      if (car.pricePerDay) {
        matches =
          matches && car.pricePerDay >= minPrice && car.pricePerDay <= maxPrice;
      }

      if (transmission && transmission !== "all") {
        matches = matches && car.transmission === transmission;
      }

      return matches;
    });

    renderCars(filteredCars);
  }

  // Make reload function available globally for retry button
  window.reloadCars = loadCars;
})();
