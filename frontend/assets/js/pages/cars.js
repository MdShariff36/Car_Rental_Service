// FILE: frontend/assets/js/pages/cars.js
import { getAvailableCars } from "../services/car.service.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadCars();
});

async function loadCars() {
  const carGrid = document.querySelector(".car-grid");

  if (!carGrid) return;

  try {
    // Show loading state
    carGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <p>Loading cars...</p>
      </div>
    `;

    // Fetch cars from backend
    const cars = await getAvailableCars();

    if (cars.length === 0) {
      carGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
          <p>No cars available at the moment.</p>
        </div>
      `;
      return;
    }

    // Render cars
    carGrid.innerHTML = cars
      .map(
        (car) => `
      <div class="car-card">
        <img 
          src="${car.images && car.images.length > 0 ? car.images[0] : "assets/images/car-placeholder.jpg"}" 
          alt="${car.name}"
          onerror="this.src='assets/images/car-placeholder.jpg'"
        />
        <div class="car-info">
          <h3>${car.name}</h3>
          <div class="car-tags">
            <span>${car.type}</span>
            <span>${car.transmission}</span>
            <span>${car.seats} Seats</span>
          </div>
          <div class="car-price">₹${car.pricePerDay} <small>/ day</small></div>
          <a href="car-details.html?id=${car.id}" class="btn">Book Now</a>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading cars:", error);
    carGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <p style="color: red;">Failed to load cars. Please try again later.</p>
        <p style="font-size: 0.9rem; color: #666;">Error: ${error.message}</p>
      </div>
    `;
  }
}

export const init = loadCars;
