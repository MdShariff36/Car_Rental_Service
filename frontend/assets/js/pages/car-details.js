import { getCarById } from "../services/car.service.js";
import { getUser } from "../base/storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadCarDetails();
});

async function loadCarDetails() {
  // Get car ID from URL
  const params = new URLSearchParams(window.location.search);
  const carId = params.get("id");

  const container = document.getElementById("carDetails");

  if (!carId) {
    container.innerHTML = `
      <div class="card">
        <h2>Car not found</h2>
        <p>Please select a car from the cars page.</p>
        <a href="cars.html" class="btn">View Cars</a>
      </div>
    `;
    return;
  }

  try {
    // Show loading
    container.innerHTML =
      '<div class="card"><p>Loading car details...</p></div>';

    // Fetch car from backend
    const car = await getCarById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    // Render car details
    renderCarDetails(car, container);
  } catch (error) {
    console.error("Error loading car:", error);
    container.innerHTML = `
      <div class="card">
        <h2>Error loading car</h2>
        <p>${error.message}</p>
        <a href="cars.html" class="btn">Back to Cars</a>
      </div>
    `;
  }
}

function renderCarDetails(car, container) {
  const images =
    car.images && car.images.length > 0
      ? car.images
      : ["assets/images/placeholder.jpg"];

  container.innerHTML = `
    <div class="card">
      <div class="left">
        <img id="mainImg" src="${images[0]}" class="main-img" alt="${car.name}">
        <div class="thumb-row" id="thumbRow">
          ${images.map((img) => `<img src="${img}" class="thumb" alt="${car.name}">`).join("")}
        </div>
      </div>
      
      <div class="right">
        <h1>${car.name}</h1>
        <p class="type">${car.type} • ${car.transmission} • ${car.seats} Seats</p>
        <div class="price">₹${car.pricePerDay}/day</div>
        ${car.weekendExtra ? `<p class="muted">Weekend Extra: +₹${car.weekendExtra}/day</p>` : ""}
        <div class="badge">⭐ ${car.rating || "4.5"} (${car.totalTrips || 0} trips)</div>

        <!-- Booking Calculator -->
        <div class="section price-calculator">
          <h3>Booking Calculator</h3>
          <label>Start Date:</label>
          <input type="date" id="startDate" min="${new Date().toISOString().split("T")[0]}">
          
          <label>End Date:</label>
          <input type="date" id="endDate" min="${new Date().toISOString().split("T")[0]}">
          
          <div class="price-summary" id="priceSummary">Select dates to calculate price</div>
          
          <button class="btn" id="proceedBooking" style="width: 100%; margin-top: 15px;">
            Proceed to Booking
          </button>
        </div>

        <!-- Specifications -->
        <div class="section">
          <h3>Specifications</h3>
          <div class="specs">
            ${car.fuel ? `<div class="spec"><strong>Fuel:</strong> ${car.fuel}</div>` : ""}
            ${car.mileage ? `<div class="spec"><strong>Mileage:</strong> ${car.mileage}</div>` : ""}
            ${car.engine ? `<div class="spec"><strong>Engine:</strong> ${car.engine}</div>` : ""}
            ${car.transmission ? `<div class="spec"><strong>Transmission:</strong> ${car.transmission}</div>` : ""}
            ${car.boot ? `<div class="spec"><strong>Boot:</strong> ${car.boot}</div>` : ""}
            ${car.airbags ? `<div class="spec"><strong>Airbags:</strong> ${car.airbags}</div>` : ""}
          </div>
        </div>

        <!-- Features -->
        ${
          car.features && car.features.length > 0
            ? `
          <div class="section">
            <h3>Features</h3>
            <ul>
              ${car.features.map((f) => `<li>${f}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }

        <!-- Safety Features -->
        ${
          car.safetyFeatures && car.safetyFeatures.length > 0
            ? `
          <div class="section">
            <h3>Safety Features</h3>
            <ul>
              ${car.safetyFeatures.map((s) => `<li>${s}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;

  // Initialize thumbnail switching
  initThumbnails();

  // Initialize price calculator
  initPriceCalculator(car);

  // Initialize booking button
  initBookingButton(car);
}

function initThumbnails() {
  const mainImg = document.getElementById("mainImg");
  const thumbs = document.querySelectorAll(".thumb");

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImg.src = thumb.src;
    });
  });
}

function initPriceCalculator(car) {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const summaryDiv = document.getElementById("priceSummary");

  function updatePrice() {
    const start = startInput.value;
    const end = endInput.value;

    if (!start || !end) {
      summaryDiv.textContent = "Select dates to calculate price";
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < startDate) {
      summaryDiv.textContent = "End date must be after start date";
      return;
    }

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const subtotal = car.pricePerDay * days;
    const discount = days >= 7 ? subtotal * 0.1 : 0;
    const afterDiscount = subtotal - discount;
    const gst = afterDiscount * 0.18;
    const total = afterDiscount + gst;

    summaryDiv.innerHTML = `
      <p><strong>Days:</strong> ${days}</p>
      <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
      ${discount > 0 ? `<p><strong>Discount (10%):</strong> -₹${discount.toFixed(2)}</p>` : ""}
      <p><strong>GST (18%):</strong> ₹${gst.toFixed(2)}</p>
      <p style="font-size: 1.2rem; margin-top: 10px;"><strong>Total:</strong> ₹${total.toFixed(2)}</p>
    `;
  }

  startInput.addEventListener("change", updatePrice);
  endInput.addEventListener("change", updatePrice);
}

function initBookingButton(car) {
  const proceedBtn = document.getElementById("proceedBooking");

  proceedBtn.addEventListener("click", () => {
    const user = getUser();

    if (!user) {
      alert("Please login to book this car");
      window.location.href = "login.html";
      return;
    }

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    // Redirect to booking page with car and date details
    window.location.href = `booking.html?carId=${car.id}&startDate=${startDate}&endDate=${endDate}`;
  });
}
