// FILE: assets/js/pages/car-details.js

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");

  if (!carId) {
    showNotification("Invalid car ID", "error");
    setTimeout(() => (window.location.href = "/cars.html"), 2000);
    return;
  }

  await loadCarDetails();

  async function loadCarDetails() {
    showLoader();

    try {
      const response = await fetch(`http://localhost:8080/api/cars/${carId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load car details");
      }

      const car = await response.json();
      displayCarDetails(car);
      await loadCarReviews();
    } catch (error) {
      console.error("Load car details error:", error);
      showNotification("Failed to load car details", "error");
      setTimeout(() => (window.location.href = "/cars.html"), 2000);
    } finally {
      hideLoader();
    }
  }

  function displayCarDetails(car) {
    const carNameElement = document.getElementById("carName");
    if (carNameElement) carNameElement.textContent = car.name;

    const carCategoryElement = document.getElementById("carCategory");
    if (carCategoryElement) carCategoryElement.textContent = car.category;

    const carPriceElement = document.getElementById("carPrice");
    if (carPriceElement) carPriceElement.textContent = `₹${car.pricePerDay}`;

    const carDescriptionElement = document.getElementById("carDescription");
    if (carDescriptionElement)
      carDescriptionElement.textContent = car.description;

    const carImageElement = document.getElementById("carImage");
    if (carImageElement) {
      carImageElement.src =
        car.primaryImage || "/assets/images/car-placeholder.jpg";
      carImageElement.alt = car.name;
    }

    const carSpecsElement = document.getElementById("carSpecs");
    if (carSpecsElement) {
      carSpecsElement.innerHTML = `
                <div class="spec-item">
                    <span class="spec-label">Seats:</span>
                    <span class="spec-value">${car.seats}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Transmission:</span>
                    <span class="spec-value">${car.transmission}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Fuel Type:</span>
                    <span class="spec-value">${car.fuelType}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Luggage:</span>
                    <span class="spec-value">${car.luggage} Bags</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Year:</span>
                    <span class="spec-value">${car.year}</span>
                </div>
            `;
    }

    const carFeaturesElement = document.getElementById("carFeatures");
    if (carFeaturesElement && car.features) {
      carFeaturesElement.innerHTML = car.features
        .map(
          (feature) => `
                <li>${feature}</li>
            `,
        )
        .join("");
    }

    const bookNowBtn = document.getElementById("bookNowBtn");
    if (bookNowBtn) {
      bookNowBtn.addEventListener("click", function () {
        const token = AuthService.getToken();
        if (!token) {
          showNotification("Please login to book", "info");
          setTimeout(() => {
            window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.href)}`;
          }, 1500);
          return;
        }
        window.location.href = `/booking.html?carId=${carId}`;
      });
    }

    const addToWishlistBtn = document.getElementById("addToWishlistBtn");
    if (addToWishlistBtn) {
      if (car.inWishlist) {
        addToWishlistBtn.classList.add("active");
        addToWishlistBtn.innerHTML = "<span>❤️ In Wishlist</span>";
      }
      addToWishlistBtn.addEventListener("click", () =>
        toggleWishlist(car.inWishlist),
      );
    }
  }

  async function loadCarReviews() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/car/${carId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load reviews");
      }

      const reviews = await response.json();
      displayReviews(reviews);
    } catch (error) {
      console.error("Load reviews error:", error);
    }
  }

  function displayReviews(reviews) {
    const reviewsContainer = document.getElementById("reviewsContainer");
    if (!reviewsContainer) return;

    if (!reviews || reviews.length === 0) {
      reviewsContainer.innerHTML =
        '<p class="empty-message">No reviews yet</p>';
      return;
    }

    reviewsContainer.innerHTML = reviews
      .map(
        (review) => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-user">
                        <strong>${review.userName}</strong>
                        <div class="review-rating">${generateStars(review.rating)}</div>
                    </div>
                    <span class="review-date">${formatDate(review.createdAt)}</span>
                </div>
                <p class="review-comment">${review.comment}</p>
            </div>
        `,
      )
      .join("");
  }

  function generateStars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  async function toggleWishlist(isInWishlist) {
    const token = AuthService.getToken();
    if (!token) {
      showNotification("Please login to add to wishlist", "info");
      setTimeout(() => (window.location.href = "/login.html"), 1500);
      return;
    }

    try {
      const method = isInWishlist ? "DELETE" : "POST";
      const url = isInWishlist
        ? `http://localhost:8080/api/wishlist/${carId}`
        : "http://localhost:8080/api/wishlist";

      const options = {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (!isInWishlist) {
        options.body = JSON.stringify({ carId: parseInt(carId) });
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }

      const message = isInWishlist
        ? "Removed from wishlist"
        : "Added to wishlist";
      showNotification(message, "success");

      setTimeout(() => location.reload(), 1000);
    } catch (error) {
      console.error("Wishlist error:", error);
      showNotification("Failed to update wishlist", "error");
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function showLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "flex";
  }

  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "none";
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
});
