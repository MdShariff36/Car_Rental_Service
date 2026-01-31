/**
 * Cars Page Script
 * Handles car listing, filtering, sorting, comparison, and pagination
 *
 * Required Elements:
 * Containers: #header, #footer, #filtersSidebar, #carsGrid, #carsSkeletonLoader,
 *             #noResults, #pagination, #comparePanel, #activeFilters
 * Buttons: #quickSearchBtn, #clearFilters, #mobileFilterToggle, #applyFiltersBtn,
 *          #resetFiltersBtn, #compareBtn, #closeComparePanel, #clearCompare,
 *          #goToCompare, #prevPage, #nextPage, .view-btn
 * Inputs: #quickSearch, #minPrice, #maxPrice, #sortSelect, input[name="carType"],
 *         input[name="transmission"], input[name="seats"], input[name="fuel"],
 *         input[name="features"], input[name="availability"]
 * Display: #resultsCount, #minPriceDisplay, #maxPriceDisplay, #compareCount,
 *          #comparePanelCount, #filterTags, #compareItems, #paginationNumbers
 */

class CarsPage {
  constructor() {
    this.currentPage = 1;
    this.totalPages = 1;
    this.carsPerPage = 12;
    this.allCars = [];
    this.filteredCars = [];
    this.comparedCars = [];
    this.maxCompare = 3;
    this.currentView = "grid";

    this.filters = {
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      carType: [],
      transmission: "all",
      seats: [],
      fuel: [],
      features: [],
      availability: [],
      sort: "relevance",
    };
  }

  /**
   * Initialize the page
   */
  async init() {
    this.setupEventListeners();
    this.loadURLParameters();
    await this.loadCars();
    this.updatePriceDisplays();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Quick search
    const quickSearchBtn = document.getElementById("quickSearchBtn");
    const quickSearch = document.getElementById("quickSearch");

    if (quickSearchBtn) {
      quickSearchBtn.addEventListener("click", () => this.handleQuickSearch());
    }

    if (quickSearch) {
      quickSearch.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.handleQuickSearch();
      });
    }

    // Price range sliders
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");

    if (minPrice) {
      minPrice.addEventListener("input", (e) => {
        this.filters.minPrice = parseInt(e.target.value);
        this.updatePriceDisplays();
        this.applyFilters();
      });
    }

    if (maxPrice) {
      maxPrice.addEventListener("input", (e) => {
        this.filters.maxPrice = parseInt(e.target.value);
        this.updatePriceDisplays();
        this.applyFilters();
      });
    }

    // Car type checkboxes
    const carTypeInputs = document.querySelectorAll('input[name="carType"]');
    carTypeInputs.forEach((input) => {
      input.addEventListener("change", () => this.handleFilterChange());
    });

    // Transmission radio buttons
    const transmissionInputs = document.querySelectorAll(
      'input[name="transmission"]',
    );
    transmissionInputs.forEach((input) => {
      input.addEventListener("change", () => this.handleFilterChange());
    });

    // Other filter checkboxes
    ["seats", "fuel", "features", "availability"].forEach((filterName) => {
      const inputs = document.querySelectorAll(`input[name="${filterName}"]`);
      inputs.forEach((input) => {
        input.addEventListener("change", () => this.handleFilterChange());
      });
    });

    // Sort dropdown
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.filters.sort = e.target.value;
        this.applySorting();
      });
    }

    // View toggle buttons
    const viewButtons = document.querySelectorAll(".view-btn");
    viewButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const view = e.currentTarget.getAttribute("data-view");
        this.changeView(view);
      });
    });

    // Filter controls
    const clearFilters = document.getElementById("clearFilters");
    if (clearFilters) {
      clearFilters.addEventListener("click", () => this.clearAllFilters());
    }

    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => this.clearAllFilters());
    }

    // Mobile filter toggle
    const mobileFilterToggle = document.getElementById("mobileFilterToggle");
    const filtersSidebar = document.getElementById("filtersSidebar");

    if (mobileFilterToggle && filtersSidebar) {
      mobileFilterToggle.addEventListener("click", () => {
        filtersSidebar.classList.toggle("active");
      });
    }

    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    if (applyFiltersBtn && filtersSidebar) {
      applyFiltersBtn.addEventListener("click", () => {
        filtersSidebar.classList.remove("active");
      });
    }

    // Compare functionality
    const compareBtn = document.getElementById("compareBtn");
    if (compareBtn) {
      compareBtn.addEventListener("click", () => this.toggleComparePanel());
    }

    const closeComparePanel = document.getElementById("closeComparePanel");
    if (closeComparePanel) {
      closeComparePanel.addEventListener("click", () =>
        this.hideComparePanel(),
      );
    }

    const clearCompare = document.getElementById("clearCompare");
    if (clearCompare) {
      clearCompare.addEventListener("click", () => this.clearComparison());
    }

    const goToCompare = document.getElementById("goToCompare");
    if (goToCompare) {
      goToCompare.addEventListener("click", () => this.goToComparePage());
    }

    // Pagination
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");

    if (prevPage) {
      prevPage.addEventListener("click", () =>
        this.changePage(this.currentPage - 1),
      );
    }

    if (nextPage) {
      nextPage.addEventListener("click", () =>
        this.changePage(this.currentPage + 1),
      );
    }
  }

  /**
   * Load URL parameters (for deep linking)
   */
  loadURLParameters() {
    const params = new URLSearchParams(window.location.search);

    if (params.has("type")) {
      const type = params.get("type");
      const checkbox = document.querySelector(
        `input[name="carType"][value="${type}"]`,
      );
      if (checkbox) checkbox.checked = true;
    }

    if (params.has("search")) {
      const search = params.get("search");
      const quickSearch = document.getElementById("quickSearch");
      if (quickSearch) quickSearch.value = search;
      this.filters.search = search;
    }
  }

  /**
   * Load cars from API
   */
  async loadCars() {
    try {
      this.showSkeleton();

      const response = await carService.getCars({
        page: this.currentPage,
        limit: this.carsPerPage,
      });

      this.allCars = response.cars || [];
      this.totalPages = response.totalPages || 1;

      this.applyFilters();
    } catch (error) {
      console.error("Error loading cars:", error);
      notifications.error("Failed to load cars. Please try again.");
      this.showNoResults();
    }
  }

  /**
   * Handle quick search
   */
  handleQuickSearch() {
    const quickSearch = document.getElementById("quickSearch");
    if (quickSearch) {
      this.filters.search = quickSearch.value.trim();
      this.applyFilters();
    }
  }

  /**
   * Handle filter changes
   */
  handleFilterChange() {
    // Collect all filter values
    this.filters.carType = Array.from(
      document.querySelectorAll('input[name="carType"]:checked'),
    ).map((input) => input.value);

    const transmissionChecked = document.querySelector(
      'input[name="transmission"]:checked',
    );
    this.filters.transmission = transmissionChecked
      ? transmissionChecked.value
      : "all";

    this.filters.seats = Array.from(
      document.querySelectorAll('input[name="seats"]:checked'),
    ).map((input) => input.value);

    this.filters.fuel = Array.from(
      document.querySelectorAll('input[name="fuel"]:checked'),
    ).map((input) => input.value);

    this.filters.features = Array.from(
      document.querySelectorAll('input[name="features"]:checked'),
    ).map((input) => input.value);

    this.filters.availability = Array.from(
      document.querySelectorAll('input[name="availability"]:checked'),
    ).map((input) => input.value);

    this.applyFilters();
  }

  /**
   * Apply all filters to cars
   */
  applyFilters() {
    let filtered = [...this.allCars];

    // Search filter
    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(search) ||
          car.brand.toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search),
      );
    }

    // Price filter
    filtered = filtered.filter(
      (car) =>
        car.pricePerDay >= this.filters.minPrice &&
        car.pricePerDay <= this.filters.maxPrice,
    );

    // Car type filter
    if (this.filters.carType.length > 0) {
      filtered = filtered.filter((car) =>
        this.filters.carType.includes(car.type),
      );
    }

    // Transmission filter
    if (this.filters.transmission !== "all") {
      filtered = filtered.filter(
        (car) => car.transmission === this.filters.transmission,
      );
    }

    // Seats filter
    if (this.filters.seats.length > 0) {
      filtered = filtered.filter((car) =>
        this.filters.seats.includes(car.seats.toString()),
      );
    }

    // Fuel filter
    if (this.filters.fuel.length > 0) {
      filtered = filtered.filter((car) =>
        this.filters.fuel.includes(car.fuelType),
      );
    }

    this.filteredCars = filtered;
    this.applySorting();
  }

  /**
   * Apply sorting
   */
  applySorting() {
    const sorted = [...this.filteredCars];

    switch (this.filters.sort) {
      case "price-low":
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-high":
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "newest":
        sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      default:
        // relevance - keep as is
        break;
    }

    this.filteredCars = sorted;
    this.renderCars();
  }

  /**
   * Render cars to the grid
   */
  renderCars() {
    const carsGrid = document.getElementById("carsGrid");
    const noResults = document.getElementById("noResults");
    const resultsCount = document.getElementById("resultsCount");

    if (!carsGrid) return;

    this.hideSkeleton();

    if (this.filteredCars.length === 0) {
      this.showNoResults();
      if (resultsCount) resultsCount.textContent = "No cars found";
      return;
    }

    this.hideNoResults();
    carsGrid.style.display = this.currentView === "grid" ? "grid" : "block";
    carsGrid.innerHTML = "";

    // Update results count
    if (resultsCount) {
      resultsCount.textContent = `Showing ${this.filteredCars.length} cars`;
    }

    // Render each car
    this.filteredCars.forEach((car) => {
      const carCard = this.createCarCard(car);
      carsGrid.appendChild(carCard);
    });

    // Update active filters display
    this.updateActiveFilters();

    // Update pagination
    this.updatePagination();
  }

  /**
   * Create car card HTML
   */
  createCarCard(car) {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <div class="car-image">
        <img src="${car.images?.[0] || "assets/images/placeholder-car.jpg"}" alt="${car.name}">
        <button class="wishlist-btn" data-car-id="${car.id}" aria-label="Add to wishlist">
          <span>❤️</span>
        </button>
        <div class="car-badge">${car.type || "Car"}</div>
      </div>
      <div class="car-info">
        <h3 class="car-name">${car.name}</h3>
        <div class="car-rating">
          <span class="stars">${this.renderStars(car.rating || 0)}</span>
          <span class="rating-count">(${car.reviewCount || 0})</span>
        </div>
        <div class="car-specs">
          <span><span class="icon">⚙️</span> ${car.transmission}</span>
          <span><span class="icon">⛽</span> ${car.fuelType}</span>
          <span><span class="icon">👥</span> ${car.seats} Seats</span>
        </div>
        <div class="car-footer">
          <div class="car-price">
            <span class="price">₹${car.pricePerDay}</span>
            <span class="period">/day</span>
          </div>
          <div class="car-actions">
            <label class="compare-checkbox">
              <input type="checkbox" class="compare-car" data-car-id="${car.id}">
              <span>Compare</span>
            </label>
            <a href="car-details.html?id=${car.id}" class="btn btn-primary btn-sm">View Details</a>
          </div>
        </div>
      </div>
    `;

    // Add compare functionality
    const compareCheckbox = card.querySelector(".compare-car");
    if (compareCheckbox) {
      compareCheckbox.addEventListener("change", (e) => {
        this.handleCompareToggle(car, e.target.checked);
      });
    }

    // Add wishlist functionality
    const wishlistBtn = card.querySelector(".wishlist-btn");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => this.toggleWishlist(car.id));
    }

    return card;
  }

  /**
   * Render star rating
   */
  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = "";

    for (let i = 0; i < fullStars; i++) {
      stars += "⭐";
    }
    if (halfStar) {
      stars += "⭐";
    }

    return stars || "☆☆☆☆☆";
  }

  /**
   * Handle compare toggle
   */
  handleCompareToggle(car, isChecked) {
    if (isChecked) {
      if (this.comparedCars.length >= this.maxCompare) {
        notifications.warning(
          `You can only compare up to ${this.maxCompare} cars`,
        );
        const checkbox = document.querySelector(
          `.compare-car[data-car-id="${car.id}"]`,
        );
        if (checkbox) checkbox.checked = false;
        return;
      }
      this.comparedCars.push(car);
    } else {
      this.comparedCars = this.comparedCars.filter((c) => c.id !== car.id);
    }

    this.updateComparePanel();
  }

  /**
   * Update compare panel
   */
  updateComparePanel() {
    const compareCount = document.getElementById("compareCount");
    const comparePanelCount = document.getElementById("comparePanelCount");
    const compareItems = document.getElementById("compareItems");
    const goToCompare = document.getElementById("goToCompare");

    if (compareCount) {
      compareCount.textContent = this.comparedCars.length;
    }

    if (comparePanelCount) {
      comparePanelCount.textContent = this.comparedCars.length;
    }

    if (compareItems) {
      compareItems.innerHTML = this.comparedCars
        .map(
          (car) => `
        <div class="compare-item">
          <img src="${car.images?.[0] || "assets/images/placeholder-car.jpg"}" alt="${car.name}">
          <span>${car.name}</span>
          <button class="remove-compare" data-car-id="${car.id}">&times;</button>
        </div>
      `,
        )
        .join("");

      // Add remove listeners
      compareItems.querySelectorAll(".remove-compare").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const carId = parseInt(e.target.getAttribute("data-car-id"));
          this.removeFromCompare(carId);
        });
      });
    }

    if (goToCompare) {
      goToCompare.disabled = this.comparedCars.length < 2;
    }

    // Show/hide compare panel
    if (this.comparedCars.length > 0) {
      this.showComparePanel();
    } else {
      this.hideComparePanel();
    }
  }

  /**
   * Remove car from comparison
   */
  removeFromCompare(carId) {
    this.comparedCars = this.comparedCars.filter((c) => c.id !== carId);
    const checkbox = document.querySelector(
      `.compare-car[data-car-id="${carId}"]`,
    );
    if (checkbox) checkbox.checked = false;
    this.updateComparePanel();
  }

  /**
   * Clear all comparisons
   */
  clearComparison() {
    this.comparedCars = [];
    document
      .querySelectorAll(".compare-car")
      .forEach((cb) => (cb.checked = false));
    this.updateComparePanel();
  }

  /**
   * Go to compare page
   */
  goToComparePage() {
    const ids = this.comparedCars.map((c) => c.id).join(",");
    window.location.href = `compare.html?ids=${ids}`;
  }

  /**
   * Toggle compare panel visibility
   */
  toggleComparePanel() {
    const comparePanel = document.getElementById("comparePanel");
    if (comparePanel) {
      comparePanel.style.display =
        comparePanel.style.display === "none" ? "block" : "none";
    }
  }

  /**
   * Show compare panel
   */
  showComparePanel() {
    const comparePanel = document.getElementById("comparePanel");
    if (comparePanel) {
      comparePanel.style.display = "block";
    }
  }

  /**
   * Hide compare panel
   */
  hideComparePanel() {
    const comparePanel = document.getElementById("comparePanel");
    if (comparePanel) {
      comparePanel.style.display = "none";
    }
  }

  /**
   * Toggle wishlist
   */
  toggleWishlist(carId) {
    // TODO: Implement wishlist functionality with backend
    notifications.info("Wishlist feature coming soon!");
  }

  /**
   * Update price range displays
   */
  updatePriceDisplays() {
    const minPriceDisplay = document.getElementById("minPriceDisplay");
    const maxPriceDisplay = document.getElementById("maxPriceDisplay");

    if (minPriceDisplay) {
      minPriceDisplay.textContent = this.filters.minPrice;
    }

    if (maxPriceDisplay) {
      maxPriceDisplay.textContent = this.filters.maxPrice;
    }
  }

  /**
   * Update active filters display
   */
  updateActiveFilters() {
    const activeFilters = document.getElementById("activeFilters");
    const filterTags = document.getElementById("filterTags");

    if (!activeFilters || !filterTags) return;

    const tags = [];

    if (this.filters.search) {
      tags.push({ label: `Search: ${this.filters.search}`, key: "search" });
    }

    this.filters.carType.forEach((type) => {
      tags.push({ label: type, key: `carType-${type}` });
    });

    if (this.filters.transmission !== "all") {
      tags.push({ label: this.filters.transmission, key: "transmission" });
    }

    if (tags.length > 0) {
      activeFilters.style.display = "flex";
      filterTags.innerHTML = tags
        .map(
          (tag) => `
        <span class="filter-tag">
          ${tag.label}
          <button class="remove-filter" data-key="${tag.key}">&times;</button>
        </span>
      `,
        )
        .join("");

      // Add remove listeners
      filterTags.querySelectorAll(".remove-filter").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const key = e.target.getAttribute("data-key");
          this.removeFilter(key);
        });
      });
    } else {
      activeFilters.style.display = "none";
    }
  }

  /**
   * Remove individual filter
   */
  removeFilter(key) {
    if (key === "search") {
      this.filters.search = "";
      const quickSearch = document.getElementById("quickSearch");
      if (quickSearch) quickSearch.value = "";
    } else if (key.startsWith("carType-")) {
      const value = key.replace("carType-", "");
      const checkbox = document.querySelector(
        `input[name="carType"][value="${value}"]`,
      );
      if (checkbox) checkbox.checked = false;
      this.filters.carType = this.filters.carType.filter((t) => t !== value);
    } else if (key === "transmission") {
      const allRadio = document.querySelector(
        'input[name="transmission"][value="all"]',
      );
      if (allRadio) allRadio.checked = true;
      this.filters.transmission = "all";
    }

    this.applyFilters();
  }

  /**
   * Clear all filters
   */
  clearAllFilters() {
    // Reset filter values
    this.filters = {
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      carType: [],
      transmission: "all",
      seats: [],
      fuel: [],
      features: [],
      availability: [],
      sort: "relevance",
    };

    // Reset UI elements
    const quickSearch = document.getElementById("quickSearch");
    if (quickSearch) quickSearch.value = "";

    const minPrice = document.getElementById("minPrice");
    if (minPrice) minPrice.value = 0;

    const maxPrice = document.getElementById("maxPrice");
    if (maxPrice) maxPrice.value = 10000;

    // Uncheck all checkboxes
    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));

    // Reset transmission to all
    const allRadio = document.querySelector(
      'input[name="transmission"][value="all"]',
    );
    if (allRadio) allRadio.checked = true;

    // Reset sort
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) sortSelect.value = "relevance";

    this.updatePriceDisplays();
    this.applyFilters();
  }

  /**
   * Change view (grid/list)
   */
  changeView(view) {
    this.currentView = view;

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    const activeBtn = document.querySelector(`.view-btn[data-view="${view}"]`);
    if (activeBtn) {
      activeBtn.classList.add("active");
    }

    const carsGrid = document.getElementById("carsGrid");
    if (carsGrid) {
      carsGrid.className = view === "grid" ? "car-grid" : "car-list";
    }
  }

  /**
   * Change page
   */
  changePage(page) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.loadCars();
  }

  /**
   * Update pagination UI
   */
  updatePagination() {
    const pagination = document.getElementById("pagination");
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    const paginationNumbers = document.getElementById("paginationNumbers");

    if (!pagination) return;

    if (this.totalPages <= 1) {
      pagination.style.display = "none";
      return;
    }

    pagination.style.display = "flex";

    if (prevPage) {
      prevPage.disabled = this.currentPage === 1;
    }

    if (nextPage) {
      nextPage.disabled = this.currentPage === this.totalPages;
    }

    if (paginationNumbers) {
      let numbers = "";
      for (let i = 1; i <= this.totalPages; i++) {
        if (
          i === 1 ||
          i === this.totalPages ||
          (i >= this.currentPage - 1 && i <= this.currentPage + 1)
        ) {
          numbers += `<button class="pagination-number ${i === this.currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
        } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
          numbers += '<span class="pagination-dots">...</span>';
        }
      }
      paginationNumbers.innerHTML = numbers;

      // Add click listeners
      paginationNumbers
        .querySelectorAll(".pagination-number")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const page = parseInt(e.target.getAttribute("data-page"));
            this.changePage(page);
          });
        });
    }
  }

  /**
   * Show skeleton loader
   */
  showSkeleton() {
    const skeleton = document.getElementById("carsSkeletonLoader");
    const carsGrid = document.getElementById("carsGrid");

    if (skeleton) skeleton.style.display = "grid";
    if (carsGrid) carsGrid.style.display = "none";
  }

  /**
   * Hide skeleton loader
   */
  hideSkeleton() {
    const skeleton = document.getElementById("carsSkeletonLoader");
    if (skeleton) skeleton.style.display = "none";
  }

  /**
   * Show no results
   */
  showNoResults() {
    const noResults = document.getElementById("noResults");
    const carsGrid = document.getElementById("carsGrid");
    const pagination = document.getElementById("pagination");

    if (noResults) noResults.style.display = "block";
    if (carsGrid) carsGrid.style.display = "none";
    if (pagination) pagination.style.display = "none";
  }

  /**
   * Hide no results
   */
  hideNoResults() {
    const noResults = document.getElementById("noResults");
    if (noResults) noResults.style.display = "none";
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const carsPage = new CarsPage();
  carsPage.init();
});
