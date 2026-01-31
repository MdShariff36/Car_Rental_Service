/**
 * Car Service
 * Handles all car-related API calls
 *
 * NO DOM ACCESS - Pure API logic only
 *
 * Endpoints:
 * - GET /api/cars - Get all cars with filters
 * - GET /api/cars/:id - Get single car details
 * - GET /api/cars/search - Search cars
 * - GET /api/cars/featured - Get featured cars
 * - GET /api/cars/popular - Get popular cars
 * - POST /api/cars - Create new car (host/admin)
 * - PUT /api/cars/:id - Update car (host/admin)
 * - DELETE /api/cars/:id - Delete car (host/admin)
 * - GET /api/cars/:id/availability - Check car availability
 * - POST /api/cars/:id/reviews - Add review
 * - GET /api/cars/:id/reviews - Get car reviews
 */

class CarService {
  constructor() {
    this.baseURL = "/api/cars";
    this.useMockAPI = false; // Set to true for development without backend
  }

  /**
   * Get authorization headers
   * @returns {Object} Headers with auth token if available
   */
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get all cars with optional filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Cars list with pagination
   */
  async getCars(filters = {}) {
    if (this.useMockAPI) {
      return this.mockGetCars(filters);
    }

    try {
      const queryParams = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== undefined &&
          filters[key] !== null &&
          filters[key] !== ""
        ) {
          if (Array.isArray(filters[key])) {
            filters[key].forEach((val) => queryParams.append(key, val));
          } else {
            queryParams.append(key, filters[key]);
          }
        }
      });

      const url = queryParams.toString()
        ? `${this.baseURL}?${queryParams}`
        : this.baseURL;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cars");
      }

      return data;
    } catch (error) {
      console.error("Get cars error:", error);
      throw error;
    }
  }

  /**
   * Get single car by ID
   * @param {number} carId - Car ID
   * @returns {Promise<Object>} Car details
   */
  async getCarById(carId) {
    if (this.useMockAPI) {
      return this.mockGetCarById(carId);
    }

    try {
      const response = await fetch(`${this.baseURL}/${carId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch car details");
      }

      return data;
    } catch (error) {
      console.error("Get car by ID error:", error);
      throw error;
    }
  }

  /**
   * Search cars
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search results
   */
  async searchCars(query, filters = {}) {
    if (this.useMockAPI) {
      return this.mockSearchCars(query, filters);
    }

    try {
      const queryParams = new URLSearchParams({ q: query, ...filters });
      const response = await fetch(`${this.baseURL}/search?${queryParams}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Search failed");
      }

      return data;
    } catch (error) {
      console.error("Search cars error:", error);
      throw error;
    }
  }

  /**
   * Get featured cars
   * @param {number} limit - Number of cars to fetch
   * @returns {Promise<Object>} Featured cars
   */
  async getFeaturedCars(limit = 6) {
    if (this.useMockAPI) {
      return this.mockGetFeaturedCars(limit);
    }

    try {
      const response = await fetch(`${this.baseURL}/featured?limit=${limit}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch featured cars");
      }

      return data;
    } catch (error) {
      console.error("Get featured cars error:", error);
      throw error;
    }
  }

  /**
   * Get popular cars
   * @param {number} limit - Number of cars to fetch
   * @returns {Promise<Object>} Popular cars
   */
  async getPopularCars(limit = 6) {
    if (this.useMockAPI) {
      return this.mockGetPopularCars(limit);
    }

    try {
      const response = await fetch(`${this.baseURL}/popular?limit=${limit}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch popular cars");
      }

      return data;
    } catch (error) {
      console.error("Get popular cars error:", error);
      throw error;
    }
  }

  /**
   * Create new car (host/admin only)
   * @param {Object} carData - Car details
   * @returns {Promise<Object>} Created car
   */
  async createCar(carData) {
    if (this.useMockAPI) {
      return this.mockCreateCar(carData);
    }

    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(carData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create car");
      }

      return data;
    } catch (error) {
      console.error("Create car error:", error);
      throw error;
    }
  }

  /**
   * Update car (host/admin only)
   * @param {number} carId - Car ID
   * @param {Object} carData - Updated car details
   * @returns {Promise<Object>} Updated car
   */
  async updateCar(carId, carData) {
    if (this.useMockAPI) {
      return this.mockUpdateCar(carId, carData);
    }

    try {
      const response = await fetch(`${this.baseURL}/${carId}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(carData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update car");
      }

      return data;
    } catch (error) {
      console.error("Update car error:", error);
      throw error;
    }
  }

  /**
   * Delete car (host/admin only)
   * @param {number} carId - Car ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteCar(carId) {
    if (this.useMockAPI) {
      return this.mockDeleteCar(carId);
    }

    try {
      const response = await fetch(`${this.baseURL}/${carId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete car");
      }

      return data;
    } catch (error) {
      console.error("Delete car error:", error);
      throw error;
    }
  }

  /**
   * Check car availability for dates
   * @param {number} carId - Car ID
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise<Object>} Availability status
   */
  async checkAvailability(carId, startDate, endDate) {
    if (this.useMockAPI) {
      return this.mockCheckAvailability(carId, startDate, endDate);
    }

    try {
      const queryParams = new URLSearchParams({ startDate, endDate });
      const response = await fetch(
        `${this.baseURL}/${carId}/availability?${queryParams}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check availability");
      }

      return data;
    } catch (error) {
      console.error("Check availability error:", error);
      throw error;
    }
  }

  /**
   * Add review to car
   * @param {number} carId - Car ID
   * @param {Object} reviewData - Review details (rating, comment)
   * @returns {Promise<Object>} Created review
   */
  async addReview(carId, reviewData) {
    if (this.useMockAPI) {
      return this.mockAddReview(carId, reviewData);
    }

    try {
      const response = await fetch(`${this.baseURL}/${carId}/reviews`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add review");
      }

      return data;
    } catch (error) {
      console.error("Add review error:", error);
      throw error;
    }
  }

  /**
   * Get car reviews
   * @param {number} carId - Car ID
   * @param {number} page - Page number
   * @param {number} limit - Reviews per page
   * @returns {Promise<Object>} Reviews list
   */
  async getReviews(carId, page = 1, limit = 10) {
    if (this.useMockAPI) {
      return this.mockGetReviews(carId, page, limit);
    }

    try {
      const queryParams = new URLSearchParams({ page, limit });
      const response = await fetch(
        `${this.baseURL}/${carId}/reviews?${queryParams}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      return data;
    } catch (error) {
      console.error("Get reviews error:", error);
      throw error;
    }
  }

  // ==================== Mock API Methods ====================

  mockGetCars(filters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCars = this.generateMockCars(12);

        // Apply simple filters
        let filteredCars = mockCars;
        if (filters.type) {
          filteredCars = filteredCars.filter(
            (car) => car.type === filters.type,
          );
        }
        if (filters.minPrice) {
          filteredCars = filteredCars.filter(
            (car) => car.pricePerDay >= filters.minPrice,
          );
        }
        if (filters.maxPrice) {
          filteredCars = filteredCars.filter(
            (car) => car.pricePerDay <= filters.maxPrice,
          );
        }

        resolve({
          success: true,
          cars: filteredCars,
          total: filteredCars.length,
          page: filters.page || 1,
          totalPages: Math.ceil(filteredCars.length / (filters.limit || 12)),
        });
      }, 800);
    });
  }

  mockGetCarById(carId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          car: {
            id: carId,
            name: "Hyundai Creta",
            brand: "Hyundai",
            model: "Creta",
            year: 2024,
            type: "suv",
            transmission: "automatic",
            fuelType: "diesel",
            seats: 5,
            pricePerDay: 2500,
            rating: 4.8,
            reviewCount: 127,
            images: ["image1.jpg", "image2.jpg"],
            features: ["AC", "Bluetooth", "GPS"],
            description: "Premium SUV perfect for family trips",
            available: true,
          },
        });
      }, 600);
    });
  }

  mockSearchCars(query, filters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCars = this.generateMockCars(5).map((car) => ({
          ...car,
          name: `${query} ${car.name}`,
        }));

        resolve({
          success: true,
          results: mockCars,
          query,
          total: mockCars.length,
        });
      }, 800);
    });
  }

  mockGetFeaturedCars(limit) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          cars: this.generateMockCars(limit),
        });
      }, 600);
    });
  }

  mockGetPopularCars(limit) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          cars: this.generateMockCars(limit),
        });
      }, 600);
    });
  }

  mockCreateCar(carData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Car created successfully",
          car: {
            id: Math.floor(Math.random() * 10000),
            ...carData,
            createdAt: new Date().toISOString(),
          },
        });
      }, 1000);
    });
  }

  mockUpdateCar(carId, carData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Car updated successfully",
          car: {
            id: carId,
            ...carData,
            updatedAt: new Date().toISOString(),
          },
        });
      }, 1000);
    });
  }

  mockDeleteCar(carId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Car deleted successfully",
          carId,
        });
      }, 800);
    });
  }

  mockCheckAvailability(carId, startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          available: Math.random() > 0.3, // 70% available
          carId,
          startDate,
          endDate,
        });
      }, 600);
    });
  }

  mockAddReview(carId, reviewData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Review added successfully",
          review: {
            id: Math.floor(Math.random() * 10000),
            carId,
            ...reviewData,
            userName: "John Doe",
            createdAt: new Date().toISOString(),
          },
        });
      }, 800);
    });
  }

  mockGetReviews(carId, page, limit) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockReviews = Array.from({ length: limit }, (_, i) => ({
          id: i + 1,
          carId,
          rating: 4 + Math.random(),
          comment: "Great car! Highly recommended.",
          userName: `User ${i + 1}`,
          createdAt: new Date().toISOString(),
        }));

        resolve({
          success: true,
          reviews: mockReviews,
          page,
          totalPages: 3,
          total: 30,
        });
      }, 800);
    });
  }

  generateMockCars(count) {
    const types = ["hatchback", "sedan", "suv", "mpv", "luxury"];
    const brands = ["Hyundai", "Maruti", "Toyota", "Honda", "Mahindra"];
    const models = ["Creta", "Swift", "Fortuner", "City", "Scorpio"];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `${brands[i % 5]} ${models[i % 5]}`,
      brand: brands[i % 5],
      model: models[i % 5],
      type: types[i % 5],
      year: 2022 + (i % 3),
      transmission: i % 2 === 0 ? "automatic" : "manual",
      fuelType: i % 3 === 0 ? "diesel" : "petrol",
      seats: 5,
      pricePerDay: 1500 + i * 200,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 200),
      images: ["image.jpg"],
      available: true,
    }));
  }
}

// Create singleton instance
const carService = new CarService();

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = carService;
}

// Global access
if (typeof window !== "undefined") {
  window.carService = carService;
}
