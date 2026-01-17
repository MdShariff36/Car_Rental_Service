const cars = {
  creta: {
    name: "Hyundai Creta",
    type: "SUV • Automatic • 5 Seats",
    price: 3500,
    weekendExtra: 4000,
    rating: "4.6 ⭐ (320 trips)",
    images: [
      "assets/images/car-images/Hyundai Creta/Hyundai Creta.jfif",
      "assets/images/car-images/Hyundai Creta/Hyundai Creta.jpg",
      "assets/images/car-images/Audi q7/Audi Q7.jfif",
    ],
    specs: {
      Fuel: "Petrol",
      Mileage: "17 km/l",
      Engine: "1.5L",
      Transmission: "Automatic",
      Boot: "433 L",
      Airbags: "6",
      Drive: "FWD",
    },
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Reverse Camera",
      "Android Auto",
      "Fastag",
      "USB Charging",
    ],
    safety: ["ABS", "Airbags", "Child Safety Locks", "Seat Belts"],
    reviews: [
      { name: "Amit K", comment: "Great ride, very comfortable!", rating: 5 },
      { name: "Priya S", comment: "Smooth handling and clean car.", rating: 4 },
    ],
    host: {
      name: "Ramesh Rentals",
      trips: 120,
      responseTime: "1 hour",
    },
    policies: {
      fuel: "Return with full tank",
      kmLimit: "200 km/day, extra ₹10/km",
      rules: "No smoking, No pets",
      insurance: "Included",
    },
  },
  innova: {
    name: "Toyota Innova",
    type: "MPV • Manual • 7 Seats",
    price: 4200,
    weekendExtra: 4000,
    rating: "4.7 ⭐ (410 trips)",
    images: [
      "assets/images/car-images/Toyota innova/front.jpg",
      "assets/images/car-images/Toyota innova/back.jpg",
      "assets/images/car-images/Toyota innova/interior.jpg",
    ],
    specs: {
      Fuel: "Diesel",
      Mileage: "15 km/l",
      Engine: "2.4L",
      Transmission: "Manual",
      Boot: "300 L",
      Airbags: "3",
      Drive: "RWD",
    },
    features: [
      "Air Conditioning",
      "Rear AC Vents",
      "Bluetooth",
      "Fastag",
      "USB Charging",
    ],
    safety: ["ABS", "Airbags", "Parking Sensors"],
    reviews: [
      { name: "Suresh M", comment: "Perfect for family trips.", rating: 5 },
      { name: "Anita R", comment: "Spacious and comfortable.", rating: 4 },
    ],
    host: {
      name: "Toyota Rentals",
      trips: 150,
      responseTime: "2 hours",
    },
    policies: {
      fuel: "Return with full tank",
      kmLimit: "250 km/day, extra ₹15/km",
      rules: "No smoking, Pets allowed",
      insurance: "Included",
    },
  },
};

// ===== Load Car =====
const params = new URLSearchParams(window.location.search);
const carId = params.get("car");
const container = document.getElementById("carDetails");

if (!carId || !cars[carId]) {
  container.innerHTML = `<div class="card"><h2>Car not found</h2><p>Please select a car from the cars page.</p><a href="cars.html" class="btn">View Cars</a></div>`;
} else {
  const car = cars[carId];

  function calculatePriceDetails(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = Math.round(Math.abs((end - start) / oneDay)) + 1;
    if (days <= 0) return null;

    let breakdown = [],
      subtotal = 0;
    for (let i = 0; i < days; i++) {
      const dayDate = new Date(start.getTime() + i * oneDay);
      const day = dayDate.getDay();
      let price = car.price,
        type = "Weekday";
      if (day === 6 || day === 0) {
        price += car.weekendExtra;
        type = "Weekend";
      }
      breakdown.push({ date: dayDate.toLocaleDateString(), type, price });
      subtotal += price;
    }
    let discountRate = 0;
    if (days >= 30) discountRate = 0.1;
    else if (days >= 7) discountRate = 0.1;
    const discountAmount = subtotal * discountRate;
    const afterDiscount = subtotal - discountAmount;
    const gst = afterDiscount * 0.18;
    const total = afterDiscount + gst;
    return { breakdown, subtotal, discountAmount, gst, total };
  }

  // ===== Render Car Details =====
  container.innerHTML = `
    <div class="card">
      <div class="left">
        <img id="mainImg" src="${car.images[0]}" class="main-img">
        <div class="thumb-row" id="thumbRow">
          ${car.images.map((img) => `<img src="${img}" class="thumb">`).join("")}
        </div>
      </div>
      <div class="right">
        <h1>${car.name}</h1>
        <p class="type">${car.type}</p>
        <div class="price">₹${car.price}/day</div>
        <div class="badge">${car.rating}</div>
        <div class="section price-calculator">
          <h3>Booking Calculator</h3>
          <label>Start Date:</label><input type="date" id="startDate">
          <label>End Date:</label><input type="date" id="endDate">
          <div class="price-summary" id="priceSummary">Select dates to calculate price</div>
          <a href="#" class="btn" id="proceedBooking">Proceed to Booking</a>
        </div>
        <!-- Specs, Policies, Features, Safety, Host, Reviews, Similar Cars sections as before -->
      </div>
    </div>
  `;

  // ===== Thumbnail Switching =====
  const mainImg = document.getElementById("mainImg");
  document.querySelectorAll(".thumb").forEach((t) => {
    t.addEventListener("click", () => {
      mainImg.src = t.src;
    });
  });

  // ===== Calculator =====
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const summaryDiv = document.getElementById("priceSummary");
  const proceedBtn = document.getElementById("proceedBooking");
  const stickyBtn = document.getElementById("stickyBookBtn");

  function updatePrice() {
    const start = startInput.value,
      end = endInput.value;
    if (!start || !end) {
      summaryDiv.textContent = "Select dates to calculate price";
      return;
    }
    const d = calculatePriceDetails(start, end);
    if (!d) return;
    let html = `<ul>`;
    d.breakdown.forEach((x) => {
      html += `<li>${x.date} (${x.type}): ₹${x.price}</li>`;
    });
    html += `</ul><p>Subtotal: <strong>₹${d.subtotal}</strong></p>`;
    if (d.discountAmount > 0)
      html += `<p>Discount: -₹${Math.round(d.discountAmount)}</p>`;
    html += `<p>GST (18%): ₹${Math.round(d.gst)}</p>`;
    html += `<p><strong>Total: ₹${Math.round(d.total)}</strong></p>`;
    summaryDiv.innerHTML = html;
  }

  startInput.addEventListener("change", updatePrice);
  endInput.addEventListener("change", updatePrice);

  function proceedToBooking() {
    const start = startInput.value,
      end = endInput.value;
    if (!start || !end) {
      alert("Select start and end dates");
      return;
    }
    const days =
      Math.round((new Date(end) - new Date(start)) / (24 * 60 * 60 * 1000)) + 1;
    const details = calculatePriceDetails(start, end);
    window.location.href = `booking.html?car=${carId}&start=${start}&end=${end}&days=${days}&subtotal=${details.subtotal}&discount=${Math.round(details.discountAmount)}&gst=${Math.round(details.gst)}&total=${Math.round(details.total)}`;
  }

  proceedBtn.addEventListener("click", proceedToBooking);
  stickyBtn.addEventListener("click", proceedToBooking);
}
