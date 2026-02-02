// Fixed home.js with improved search functionality

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all home page features
  initSearchButton();
  initDateValidation();
  initCounters();
  initTestimonialSlider();
  initNewsletterForm();
  loadPopularCars();
});

/**
 * Initialize the search cars button functionality
 * NOW WORKS WITHOUT REQUIRING ALL FIELDS
 */
function initSearchButton() {
  const searchBtn = document.getElementById("searchCarsBtn");

  if (!searchBtn) {
    console.warn("Search button not found");
    return;
  }

  searchBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Get search parameters from the form (all optional now)
    const pickupCity =
      document.getElementById("pickupCity")?.value?.trim() || "";
    const dropCity = document.getElementById("dropCity")?.value?.trim() || "";
    const pickupDate = document.getElementById("pickupDate")?.value || "";
    const pickupTime = document.getElementById("pickupTime")?.value || "";
    const dropDate = document.getElementById("dropDate")?.value || "";
    const dropTime = document.getElementById("dropTime")?.value || "";

    // Validation: Only check if dates are provided, they should be valid
    if (pickupDate && dropDate && pickupDate > dropDate) {
      showNotification("Drop-off date must be after pickup date", "error");
      return;
    }

    // Build query string with parameters (only add if they have values)
    const params = new URLSearchParams();

    if (pickupCity) params.append("pickupCity", pickupCity);
    if (dropCity) params.append("dropCity", dropCity);
    if (pickupDate) params.append("pickupDate", pickupDate);
    if (pickupTime) params.append("pickupTime", pickupTime);
    if (dropDate) params.append("dropDate", dropDate);
    if (dropTime) params.append("dropTime", dropTime);

    // Navigate to cars page with search parameters
    // THIS WILL WORK EVEN IF NO PARAMETERS ARE PROVIDED
    const queryString = params.toString();
    const url = queryString ? `cars.html?${queryString}` : "cars.html";

    console.log("Navigating to:", url); // Debug log
    window.location.href = url;
  });
}

/**
 * Initialize date validation
 */
function initDateValidation() {
  const pickupDateInput = document.getElementById("pickupDate");
  const dropDateInput = document.getElementById("dropDate");

  if (!pickupDateInput || !dropDateInput) return;

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  pickupDateInput.setAttribute("min", today);
  dropDateInput.setAttribute("min", today);

  // Update drop date minimum when pickup date changes
  pickupDateInput.addEventListener("change", function () {
    dropDateInput.setAttribute("min", this.value);

    // If drop date is before pickup date, reset it
    if (dropDateInput.value && dropDateInput.value < this.value) {
      dropDateInput.value = this.value;
    }
  });
}

/**
 * Initialize counter animations
 */
function initCounters() {
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = counter.getAttribute("data-target");
    const isRating = target.includes("/");

    if (isRating) {
      counter.textContent = target;
      return;
    }

    const targetNum = parseInt(target);
    const duration = 2000;
    const increment = targetNum / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < targetNum) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = targetNum.toLocaleString();
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(counter);
  });
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  const testimonials = document.querySelectorAll(".testimonial-card");

  if (!testimonials || testimonials.length === 0) return;

  let currentIndex = 0;
  const totalTestimonials = testimonials.length;

  function updateSlider() {
    testimonials.forEach((card, index) => {
      card.classList.remove("active");
      if (index === currentIndex) {
        card.classList.add("active");
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
      updateSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % totalTestimonials;
      updateSlider();
    });
  }

  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalTestimonials;
    updateSlider();
  }, 5000);

  updateSlider();
}

/**
 * Newsletter form
 */
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("newsletterEmail");
    const email = emailInput?.value;

    if (!email || !isValidEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    showNotification("Thank you for subscribing!", "success");
    form.reset();
  });
}

/**
 * Load popular cars
 */
async function loadPopularCars() {
  const grid = document.getElementById("popularCarsGrid");
  const loader = document.getElementById("carsSkeletonLoader");

  if (!grid) return;

  if (loader) loader.style.display = "grid";
  if (grid) grid.style.display = "none";

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const popularCars = [
      {
        id: 1,
        name: "Hyundai Creta",
        type: "SUV",
        image: "assets/images/car-images/Hyundai Creta/Hyundai Creta.jfif",
        pricePerDay: 2500,
        transmission: "Automatic",
        fuel: "Diesel",
        seats: 5,
      },
      {
        id: 2,
        name: "Maruti Swift",
        type: "Hatchback",
        image: "assets/images/cars/swift.jpg",
        pricePerDay: 1200,
        transmission: "Manual",
        fuel: "Petrol",
        seats: 5,
      },
      {
        id: 3,
        name: "Honda City",
        type: "Sedan",
        image: "assets/images/cars/city.jpg",
        pricePerDay: 1800,
        transmission: "Automatic",
        fuel: "Petrol",
        seats: 5,
      },
    ];

    grid.innerHTML = popularCars
      .map(
        (car) => `
            <div class="car-card">
                <div class="car-card-image">
                    <img src="${car.image}" alt="${car.name}" onerror="this.src='assets/images/car-placeholder.jpg'">
                </div>
                <div class="car-card-content">
                    <div class="car-card-header">
                        <h3>${car.name}</h3>
                        <span class="car-type">${car.type}</span>
                    </div>
                    <div class="car-specs">
                        <span>⚙️ ${car.transmission}</span>
                        <span>⛽ ${car.fuel}</span>
                        <span>👥 ${car.seats} Seats</span>
                    </div>
                    <div class="car-card-footer">
                        <div class="price">
                            <span class="amount">₹${car.pricePerDay.toLocaleString()}</span>
                            <span class="period">/day</span>
                        </div>
                        <a href="car-details.html?id=${car.id}" class="btn btn-primary btn-sm">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");

    if (loader) loader.style.display = "none";
    if (grid) grid.style.display = "grid";
  } catch (error) {
    console.error("Failed to load cars:", error);
    if (grid) {
      grid.innerHTML = '<p class="error-message">Failed to load cars.</p>';
      grid.style.display = "block";
    }
    if (loader) loader.style.display = "none";
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = "info") {
  const container =
    document.getElementById("notification-container") ||
    createNotificationContainer();

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

  container.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function createNotificationContainer() {
  const container = document.createElement("div");
  container.id = "notification-container";
  container.className = "notification-container";
  document.body.appendChild(container);
  return container;
}
