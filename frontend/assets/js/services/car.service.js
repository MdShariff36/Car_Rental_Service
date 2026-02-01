// FILE: assets/js/services/car.service.js

import { storage } from "../base/storage.js";
import { generateId } from "../base/helpers.js";
import { api } from "../core/api.js";

class CarService {
  constructor() {
    this.initializeMockData();
  }

  initializeMockData() {
    if (!storage.has("cars")) {
      const mockCars = [
        {
          id: "car-1",
          name: "Toyota Fortuner",
          brand: "Toyota",
          type: "SUV",
          year: 2023,
          seats: 7,
          transmission: "Automatic",
          fuel: "Diesel",
          pricePerDay: 3500,
          image: "/assets/images/cars/fortuner.jpg",
          rating: 4.5,
          reviews: 45,
          available: true,
          features: ["AC", "GPS", "Bluetooth", "Sunroof"],
          description: "Luxurious SUV perfect for family trips",
          location: "Mumbai",
          hostId: "host-1",
        },
        {
          id: "car-2",
          name: "Honda City",
          brand: "Honda",
          type: "Sedan",
          year: 2023,
          seats: 5,
          transmission: "Manual",
          fuel: "Petrol",
          pricePerDay: 1800,
          image: "/assets/images/cars/city.jpg",
          rating: 4.3,
          reviews: 38,
          available: true,
          features: ["AC", "Bluetooth", "USB Charging"],
          description: "Comfortable sedan for city drives",
          location: "Delhi",
          hostId: "host-2",
        },
        {
          id: "car-3",
          name: "Hyundai Creta",
          brand: "Hyundai",
          type: "SUV",
          year: 2022,
          seats: 5,
          transmission: "Automatic",
          fuel: "Petrol",
          pricePerDay: 2500,
          image: "/assets/images/cars/creta.jpg",
          rating: 4.6,
          reviews: 52,
          available: true,
          features: ["AC", "GPS", "Parking Sensors", "Sunroof"],
          description: "Stylish compact SUV",
          location: "Bangalore",
          hostId: "host-1",
        },
      ];
      storage.set("cars", mockCars);
    }
  }

  async getAllCars(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let cars = storage.get("cars", []);

    if (filters.type) {
      cars = cars.filter((car) => car.type === filters.type);
    }

    if (filters.transmission) {
      cars = cars.filter((car) => car.transmission === filters.transmission);
    }

    if (filters.fuel) {
      cars = cars.filter((car) => car.fuel === filters.fuel);
    }

    if (filters.minPrice) {
      cars = cars.filter((car) => car.pricePerDay >= filters.minPrice);
    }

    if (filters.maxPrice) {
      cars = cars.filter((car) => car.pricePerDay <= filters.maxPrice);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      cars = cars.filter(
        (car) =>
          car.name.toLowerCase().includes(search) ||
          car.brand.toLowerCase().includes(search),
      );
    }

    if (filters.available !== undefined) {
      cars = cars.filter((car) => car.available === filters.available);
    }

    return cars;
  }

  async getCarById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const cars = storage.get("cars", []);
    const car = cars.find((c) => c.id === id);

    if (!car) {
      throw new Error("Car not found");
    }

    return car;
  }

  async createCar(carData) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cars = storage.get("cars", []);
    const user = storage.getUser();

    const newCar = {
      id: generateId(),
      ...carData,
      hostId: user?.id,
      available: true,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
    };

    cars.push(newCar);
    storage.set("cars", cars);

    return newCar;
  }

  async updateCar(id, carData) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cars = storage.get("cars", []);
    const carIndex = cars.findIndex((c) => c.id === id);

    if (carIndex === -1) {
      throw new Error("Car not found");
    }

    cars[carIndex] = { ...cars[carIndex], ...carData };
    storage.set("cars", cars);

    return cars[carIndex];
  }

  async deleteCar(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cars = storage.get("cars", []);
    const filteredCars = cars.filter((c) => c.id !== id);

    storage.set("cars", filteredCars);
    return true;
  }

  async getHostCars(hostId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cars = storage.get("cars", []);
    return cars.filter((car) => car.hostId === hostId);
  }

  async getFeaturedCars(limit = 6) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const cars = storage.get("cars", []);
    return cars
      .filter((car) => car.available)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  async searchCars(searchTerm) {
    return this.getAllCars({ search: searchTerm });
  }
}

export const carService = new CarService();
