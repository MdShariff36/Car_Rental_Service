// FILE: assets/js/pages/wishlist.js

document.addEventListener("DOMContentLoaded", async function () {
  const wishlistContainer = document.getElementById("wishlistContainer");

  await loadWishlist();

  async function loadWishlist() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/wishlist", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load wishlist");
      }

      const wishlist = await response.json();
      displayWishlist(wishlist);
    } catch (error) {
      console.error("Load wishlist error:", error);
      showNotification("Failed to load wishlist", "error");
    } finally {
      hideLoader();
    }
  }

  function displayWishlist(items) {
    if (!wishlistContainer) return;

    if (!items || items.length === 0) {
      wishlistContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❤️</div>
                    <h3>Your wishlist is empty</h3>
                    <p>Start adding cars you love!</p>
                    <a href="/cars.html" class="btn btn-primary">Browse Cars</a>
                </div>
            `;
      return;
    }

    wishlistContainer.innerHTML = items
      .map(
        (item) => `
            <div class="car-card" data-car-id="${item.carId}">
                <div class="car-image">
                    <img src="${item.carImage || "/assets/images/car-placeholder.jpg"}" alt="${item.carName}">
                    <button class="btn-wishlist active" data-car-id="${item.carId}">
                        ❤️
                    </button>
                </div>
                <div class="car-details">
                    <h3>${item.carName}</h3>
                    <p class="car-category">${item.category}</p>
                    <div class="car-specs">
                        <span>${item.seats} Seats</span>
                        <span>${item.transmission}</span>
                        <span>${item.fuelType}</span>
                    </div>
                    <div class="car-price">
                        <span class="price-amount">₹${item.pricePerDay}</span>
                        <span class="price-period">/day</span>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-outline btn-sm view-car" data-id="${item.carId}">
                            View Details
                        </button>
                        <button class="btn btn-primary btn-sm book-car" data-id="${item.carId}">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");

    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll(".btn-wishlist").forEach((btn) => {
      btn.addEventListener("click", async function (e) {
        e.stopPropagation();
        const carId = this.dataset.carId;
        await removeFromWishlist(carId);
      });
    });

    document.querySelectorAll(".view-car").forEach((btn) => {
      btn.addEventListener("click", function () {
        const carId = this.dataset.id;
        window.location.href = `/car-details.html?id=${carId}`;
      });
    });

    document.querySelectorAll(".book-car").forEach((btn) => {
      btn.addEventListener("click", function () {
        const carId = this.dataset.id;
        window.location.href = `/booking.html?carId=${carId}`;
      });
    });
  }

  async function removeFromWishlist(carId) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `http://localhost:8080/api/wishlist/${carId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      showNotification("Removed from wishlist", "success");
      await loadWishlist();
    } catch (error) {
      console.error("Remove wishlist error:", error);
      showNotification("Failed to remove from wishlist", "error");
    }
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
