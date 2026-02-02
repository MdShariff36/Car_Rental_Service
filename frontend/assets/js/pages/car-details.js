/**
 * Car Details Page (car-details.html)
 * REQUIRES BACKEND: GET /api/cars/{id}
 * Displays detailed information for a specific car
 */

(() => {
  "use strict";

  let currentCar = null;

  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("Car details page loaded - fetching car data from backend...");

    // Get car ID from URL
    const carId = getCarIdFromURL();

    if (!carId) {
      showError("Invalid car ID");
      return;
    }

    // Load car details from backend
    await loadCarDetails(carId);
  });

  /**
   * Get car ID from URL parameters
   */
  function getCarIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  /**
   * Load car details from backend
   * BACKEND CALL: GET /api/cars/{id}
   */
  async function loadCarDetails(carId) {
    const container = document.getElementById("carDetailsContainer");
    const loadingElement = document.getElementById("loadingSpinner");
    const errorElement = document.getElementById("errorMessage");

    // Show loading state
    if (loadingElement) loadingElement.style.display = "block";
    if (errorElement) errorElement.style.display = "none";

    try {
      // BACKEND REQUEST: Get car by ID
      const result = await CarService.getCarById(carId);

      if (result.success) {
        currentCar = result.data;
        console.log("Loaded car details from backend:", currentCar);

        // Render car details
        renderCarDetails(currentCar);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to load car details:", error);
      showError(
        "Failed to load car details. The car may not exist or there was a connection error.",
      );
    } finally {
      // Hide loading state
      if (loadingElement) loadingElement.style.display = "none";
    }
  }

  /**
   * Render car details to the DOM
   */
  function renderCarDetails(car) {
    const container = document.getElementById("carDetailsContainer");
    if (!container) return;

    // Update page title
    document.title = `${car.name} - Car Rental`;

    // Render the car details
    container.innerHTML = `
      <div class="car-details-wrapper">
        <div class="car-gallery">
          <div class="main-image">
            <img src="${car.imageUrl || "assets/images/car-placeholder.jpg"}" alt="${car.name}">
          </div>
          ${car.gallery ? renderGallery(car.gallery) : ""}
        </div>
        
        <div class="car-info">
          <div class="car-header">
            <h1 class="car-title">${car.name}</h1>
            <div class="car-meta">
              <span class="car-type">${car.type || "Sedan"}</span>
              ${car.featured ? '<span class="badge-featured">Featured</span>' : ""}
            </div>
          </div>

          <div class="car-price-section">
            <div class="price">
              <span class="amount">$${car.pricePerDay || 0}</span>
              <span class="unit">/day</span>
            </div>
            ${car.rating ? `<div class="rating"><span class="stars">${"★".repeat(car.rating)}${"☆".repeat(5 - car.rating)}</span></div>` : ""}
          </div>

          <div class="car-specifications">
            <h3>Specifications</h3>
            <ul class="specs-list">
              <li><strong>Seats:</strong> ${car.seats || 5}</li>
              <li><strong>Transmission:</strong> ${car.transmission || "Automatic"}</li>
              <li><strong>Fuel Type:</strong> ${car.fuelType || "Petrol"}</li>
              ${car.engineSize ? `<li><strong>Engine:</strong> ${car.engineSize}</li>` : ""}
              ${car.mileage ? `<li><strong>Mileage:</strong> ${car.mileage} km/l</li>` : ""}
              ${car.year ? `<li><strong>Year:</strong> ${car.year}</li>` : ""}
            </ul>
          </div>

          ${
            car.description
              ? `
            <div class="car-description">
              <h3>Description</h3>
              <p>${car.description}</p>
            </div>
          `
              : ""
          }

          ${
            car.features && car.features.length > 0
              ? `
            <div class="car-features">
              <h3>Features</h3>
              <ul class="features-list">
                ${car.features.map((feature) => `<li><i class="icon-check"></i> ${feature}</li>`).join("")}
              </ul>
            </div>
          `
              : ""
          }

          <div class="action-buttons">
            <a href="booking.html?carId=${car.id}" class="btn btn-primary btn-book">Book Now</a>
            <a href="cars.html" class="btn btn-secondary">Back to Cars</a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render image gallery
   */
  function renderGallery(images) {
    if (!images || images.length === 0) return "";

    return `
      <div class="thumbnail-gallery">
        ${images
          .map(
            (img) => `
          <img src="${img}" alt="Car image" class="thumbnail">
        `,
          )
          .join("")}
      </div>
    `;
  }

  /**
   * Show error message
   */
  function showError(message) {
    const errorElement = document.getElementById("errorMessage");
    const container = document.getElementById("carDetailsContainer");

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }

    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <h2>Car Not Found</h2>
          <p>${message}</p>
          <a href="cars.html" class="btn btn-primary">View All Cars</a>
        </div>
      `;
    }
  }
})();
