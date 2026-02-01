// FILE: assets/js/pages/home.js

import { carService } from "../services/car.service.js";
import { formatCurrency } from "../base/helpers.js";
import { storage } from "../base/storage.js";
import { showLoader, hideLoader } from "../ui/loader.js";

export const initHome = async () => {
  await loadFeaturedCars();
  setupSearchForm();
  setupNewsletterForm();
  initTestimonialSlider();
};

const loadFeaturedCars = async () => {
  const container = document.querySelector("#featured-cars");
  if (!container) return;

  showLoader();

  try {
    const cars = await carService.getFeaturedCars(6);

    if (cars.length === 0) {
      container.innerHTML =
        '<p class="text-center">No cars available at the moment.</p>';
      return;
    }

    container.innerHTML = cars
      .map(
        (car) => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="car-card">
          <div class="car-image">
            <img src="${car.image}" alt="${car.name}" onerror="this.src='/assets/images/car-placeholder.jpg'">
            <span class="badge bg-primary">${car.type}</span>
          </div>
          <div class="car-details">
            <h3 class="car-name">${car.name}</h3>
            <div class="car-specs">
              <span><i class="icon-seats"></i> ${car.seats} Seats</span>
              <span><i class="icon-transmission"></i> ${car.transmission}</span>
              <span><i class="icon-fuel"></i> ${car.fuel}</span>
            </div>
            <div class="car-rating">
              <span class="stars">${"★".repeat(Math.floor(car.rating))}${"☆".repeat(5 - Math.floor(car.rating))}</span>
              <span class="reviews">(${car.reviews} reviews)</span>
            </div>
            <div class="car-footer">
              <div class="price">
                <span class="amount">${formatCurrency(car.pricePerDay)}</span>
                <span class="period">/day</span>
              </div>
              <a href="/car-details?id=${car.id}" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    container.innerHTML =
      '<p class="text-center text-danger">Failed to load cars. Please try again.</p>';
  } finally {
    hideLoader();
  }
};

const setupSearchForm = () => {
  const form = document.querySelector("#home-search-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const searchParams = new URLSearchParams();

    if (formData.get("location"))
      searchParams.set("location", formData.get("location"));
    if (formData.get("pickupDate"))
      searchParams.set("pickupDate", formData.get("pickupDate"));
    if (formData.get("returnDate"))
      searchParams.set("returnDate", formData.get("returnDate"));
    if (formData.get("carType"))
      searchParams.set("type", formData.get("carType"));

    window.location.href = `/cars?${searchParams.toString()}`;
  });
};

const setupNewsletterForm = () => {
  const form = document.querySelector("#newsletter-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const email = emailInput?.value;

    if (!email) return;

    const originalText = button?.textContent;
    if (button) button.textContent = "Subscribing...";

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const subscribers = storage.get("newsletter_subscribers", []);
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        storage.set("newsletter_subscribers", subscribers);
      }

      alert("Thank you for subscribing to our newsletter!");
      form.reset();
    } catch (error) {
      alert("Failed to subscribe. Please try again.");
    } finally {
      if (button && originalText) {
        button.textContent = originalText;
      }
    }
  });
};

const initTestimonialSlider = () => {
  const slider = document.querySelector(".testimonial-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".testimonial-slide");
  const prevBtn = document.querySelector("[data-testimonial-prev]");
  const nextBtn = document.querySelector("[data-testimonial-next]");

  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  };

  prevBtn?.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });

  nextBtn?.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  if (slides.length > 0) {
    showSlide(0);
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }
};
