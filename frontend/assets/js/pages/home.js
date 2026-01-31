/**
 * Home Page Script
 * Handles homepage functionality including search, popular cars, testimonials, and newsletter
 *
 * Required Elements:
 * Search: #pickupCity, #pickupDate, #pickupTime, #dropCity, #dropDate,
 *         #dropTime, #searchCarsBtn
 * Stats: .counter (with data-target attribute)
 * Cars: #popularCarsGrid, #carsSkeletonLoader
 * Testimonials: #testimonialsSlider, #prevTestimonial, #nextTestimonial
 * Newsletter: #newsletterForm, #newsletterEmail
 */

class HomePage {
  constructor() {
    this.currentTestimonial = 0;
    this.testimonialInterval = null;
  }

  /**
   * Initialize the page
   */
  async init() {
    this.setupSearchForm();
    this.setupCounters();
    await this.loadPopularCars();
    this.setupTestimonials();
    this.setupNewsletter();
    this.setMinDates();
  }

  /**
   * Setup search form
   */
  setupSearchForm() {
    const searchBtn = document.getElementById("searchCarsBtn");

    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.handleSearch());
    }

    // Auto-fill drop city with pickup city
    const pickupCity = document.getElementById("pickupCity");
    const dropCity = document.getElementById("dropCity");

    if (pickupCity && dropCity) {
      pickupCity.addEventListener("change", (e) => {
        if (!dropCity.value) {
          dropCity.value = e.target.value;
        }
      });
    }

    // Auto-calculate drop date (minimum 1 day rental)
    const pickupDate = document.getElementById("pickupDate");
    const dropDate = document.getElementById("dropDate");

    if (pickupDate && dropDate) {
      pickupDate.addEventListener("change", (e) => {
        const pickup = new Date(e.target.value);
        const minDrop = new Date(pickup);
        minDrop.setDate(minDrop.getDate() + 1);

        const minDropStr = minDrop.toISOString().split("T")[0];
        dropDate.min = minDropStr;

        if (!dropDate.value || new Date(dropDate.value) <= pickup) {
          dropDate.value = minDropStr;
        }
      });
    }
  }

  /**
   * Set minimum dates for date inputs
   */
  setMinDates() {
    const today = new Date().toISOString().split("T")[0];

    const pickupDate = document.getElementById("pickupDate");
    if (pickupDate) {
      pickupDate.min = today;
      if (!pickupDate.value) {
        pickupDate.value = today;
      }
    }

    const dropDate = document.getElementById("dropDate");
    if (dropDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      dropDate.min = tomorrowStr;
      if (!dropDate.value) {
        dropDate.value = tomorrowStr;
      }
    }
  }

  /**
   * Handle search button click
   */
  handleSearch() {
    const pickupCity = document.getElementById("pickupCity")?.value;
    const pickupDate = document.getElementById("pickupDate")?.value;
    const pickupTime = document.getElementById("pickupTime")?.value;
    const dropCity = document.getElementById("dropCity")?.value;
    const dropDate = document.getElementById("dropDate")?.value;
    const dropTime = document.getElementById("dropTime")?.value;

    // Validation
    if (!pickupCity) {
      notifications.warning("Please select a pickup city");
      return;
    }

    if (!pickupDate) {
      notifications.warning("Please select a pickup date");
      return;
    }

    if (!dropDate) {
      notifications.warning("Please select a drop-off date");
      return;
    }

    // Validate dates
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const drop = new Date(`${dropDate}T${dropTime}`);

    if (drop <= pickup) {
      notifications.error("Drop-off must be after pickup");
      return;
    }

    // Build search query
    const params = new URLSearchParams({
      pickupCity,
      pickupDate,
      pickupTime,
      dropCity: dropCity || pickupCity,
      dropDate,
      dropTime,
    });

    // Navigate to cars page with search params
    window.location.href = `cars.html?${params.toString()}`;
  }

  /**
   * Setup animated counters
   */
  setupCounters() {
    const counters = document.querySelectorAll(".counter");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  }

  /**
   * Animate a counter element
   */
  animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"));

    if (isNaN(target)) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, stepDuration);
  }

  /**
   * Load popular cars
   */
  async loadPopularCars() {
    const grid = document.getElementById("popularCarsGrid");
    const skeleton = document.getElementById("carsSkeletonLoader");

    if (!grid) return;

    try {
      // Show skeleton
      if (skeleton) skeleton.style.display = "grid";
      if (grid) grid.style.display = "none";

      const response = await carService.getPopularCars(6);
      const cars = response.cars || [];

      // Hide skeleton
      if (skeleton) skeleton.style.display = "none";
      if (grid) grid.style.display = "grid";

      grid.innerHTML = "";

      cars.forEach((car) => {
        const card = this.createCarCard(car);
        grid.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading popular cars:", error);
      if (skeleton) skeleton.style.display = "none";
      if (grid) {
        grid.style.display = "block";
        grid.innerHTML =
          '<p class="error-message">Failed to load cars. Please try again later.</p>';
      }
    }
  }

  /**
   * Create car card element
   */
  createCarCard(car) {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <div class="car-image">
        <img src="${car.images?.[0] || "assets/images/placeholder-car.jpg"}" alt="${car.name}">
        <span class="car-badge">${car.type || "Car"}</span>
      </div>
      <div class="car-info">
        <h3>${car.name}</h3>
        <div class="car-specs">
          <span>⚙️ ${car.transmission}</span>
          <span>⛽ ${car.fuelType}</span>
          <span>👥 ${car.seats}</span>
        </div>
        <div class="car-footer">
          <div class="car-price">
            <span class="price">₹${car.pricePerDay}</span>
            <span class="period">/day</span>
          </div>
          <a href="car-details.html?id=${car.id}" class="btn btn-primary btn-sm">Book Now</a>
        </div>
      </div>
    `;
    return card;
  }

  /**
   * Setup testimonials slider
   */
  setupTestimonials() {
    const slider = document.getElementById("testimonialsSlider");
    if (!slider) return;

    const prevBtn = document.getElementById("prevTestimonial");
    const nextBtn = document.getElementById("nextTestimonial");
    const testimonials = slider.querySelectorAll(".testimonial-card");

    if (testimonials.length === 0) return;

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.changeTestimonial(-1, testimonials);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.changeTestimonial(1, testimonials);
      });
    }

    // Auto-play
    this.startTestimonialAutoPlay(testimonials);

    // Pause on hover
    slider.addEventListener("mouseenter", () => {
      this.stopTestimonialAutoPlay();
    });

    slider.addEventListener("mouseleave", () => {
      this.startTestimonialAutoPlay(testimonials);
    });
  }

  /**
   * Change testimonial
   */
  changeTestimonial(direction, testimonials) {
    testimonials[this.currentTestimonial].classList.remove("active");

    this.currentTestimonial += direction;

    if (this.currentTestimonial >= testimonials.length) {
      this.currentTestimonial = 0;
    } else if (this.currentTestimonial < 0) {
      this.currentTestimonial = testimonials.length - 1;
    }

    testimonials[this.currentTestimonial].classList.add("active");
  }

  /**
   * Start testimonial auto-play
   */
  startTestimonialAutoPlay(testimonials) {
    this.stopTestimonialAutoPlay();
    this.testimonialInterval = setInterval(() => {
      this.changeTestimonial(1, testimonials);
    }, 5000); // Change every 5 seconds
  }

  /**
   * Stop testimonial auto-play
   */
  stopTestimonialAutoPlay() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.testimonialInterval = null;
    }
  }

  /**
   * Setup newsletter form
   */
  setupNewsletter() {
    const form = document.getElementById("newsletterForm");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleNewsletterSubmit();
      });
    }
  }

  /**
   * Handle newsletter submission
   */
  async handleNewsletterSubmit() {
    const emailInput = document.getElementById("newsletterEmail");

    if (!emailInput) return;

    const email = emailInput.value.trim();

    if (!email) {
      notifications.warning("Please enter your email address");
      return;
    }

    if (!this.validateEmail(email)) {
      notifications.error("Please enter a valid email address");
      return;
    }

    try {
      // TODO: Implement newsletter API call
      // await newsletterService.subscribe(email);

      // Mock success for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notifications.success("Successfully subscribed to our newsletter!");
      emailInput.value = "";
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      notifications.error("Failed to subscribe. Please try again.");
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const homePage = new HomePage();
  homePage.init();
});
