import { loadHeader } from "../components/header.js";
import { loadFooter } from "../components/footer.js";
import { getCarById } from "../services/car.service.js";
import { getUser } from "../base/storage.js";
import { api } from "../core/api.js";

let currentCar = null;
let bookingDetails = {
  days: 0,
  subtotal: 0,
  discount: 0,
  gst: 0,
  total: 0,
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeader();
  await loadFooter();

  // Check if user is logged in
  const user = getUser();
  if (!user) {
    alert("Please login to book a car");
    window.location.href = "login.html";
    return;
  }

  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  const carId = params.get("carId");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  if (!carId || !startDate || !endDate) {
    alert("Invalid booking details");
    window.location.href = "cars.html";
    return;
  }

  // Set date inputs
  document.getElementById("startDate").value = startDate;
  document.getElementById("endDate").value = endDate;

  // Load car details
  await loadCarDetails(carId, startDate, endDate);

  // Handle form submission
  document
    .getElementById("bookingForm")
    .addEventListener("submit", handleBooking);
});

async function loadCarDetails(carId, startDate, endDate) {
  try {
    currentCar = await getCarById(carId);

    // Display car info
    document.getElementById("carInfo").innerHTML = `
      <div style="display: flex; gap: 15px; align-items: center; padding: 15px; background: #f8fafc; border-radius: 8px;">
        <img src="${currentCar.images?.[0] || "assets/images/placeholder.jpg"}" 
             style="width: 100px; height: 70px; object-fit: cover; border-radius: 8px;" 
             alt="${currentCar.name}">
        <div>
          <h3 style="margin: 0;">${currentCar.name}</h3>
          <p style="margin: 5px 0; color: #64748b;">${currentCar.type} • ${currentCar.transmission}</p>
          <p style="margin: 0; color: #667eea; font-weight: 600;">₹${currentCar.pricePerDay}/day</p>
        </div>
      </div>
    `;

    // Calculate price
    calculatePrice(currentCar, startDate, endDate);
  } catch (error) {
    console.error("Error loading car:", error);
    alert("Failed to load car details");
    window.location.href = "cars.html";
  }
}

function calculatePrice(car, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const subtotal = car.pricePerDay * days;
  const discount = days >= 7 ? subtotal * 0.1 : 0;
  const afterDiscount = subtotal - discount;
  const gst = afterDiscount * 0.18;
  const total = afterDiscount + gst;

  bookingDetails = { days, subtotal, discount, gst, total };

  // Update UI
  document.getElementById("daysCount").textContent = days;
  document.getElementById("subtotalAmount").textContent =
    `₹${subtotal.toFixed(2)}`;
  document.getElementById("gstAmount").textContent = `₹${gst.toFixed(2)}`;
  document.getElementById("totalAmount").textContent = `₹${total.toFixed(2)}`;

  if (discount > 0) {
    document.getElementById("discountRow").style.display = "flex";
    document.getElementById("discountAmount").textContent =
      `-₹${discount.toFixed(2)}`;
  }
}

async function handleBooking(event) {
  event.preventDefault();

  const user = getUser();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const pickupLocation = document.getElementById("pickupLocation").value;
  const dropLocation = document.getElementById("dropLocation").value;

  const bookingData = {
    startDate,
    endDate,
    days: bookingDetails.days,
    subtotal: bookingDetails.subtotal,
    discount: bookingDetails.discount,
    gst: bookingDetails.gst,
    total: bookingDetails.total,
    pickupLocation,
    dropLocation,
  };

  const submitBtn = event.target.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  try {
    const response = await api(
      `/bookings?userId=${user.id}&carId=${currentCar.id}`,
      "POST",
      bookingData,
    );

    alert("Booking created successfully!");

    // Redirect to payment page or booking confirmation
    window.location.href = `booking-confirm.html?bookingId=${response.id}`;
  } catch (error) {
    console.error("Booking error:", error);
    alert(error.message || "Failed to create booking. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirm Booking";
  }
}
