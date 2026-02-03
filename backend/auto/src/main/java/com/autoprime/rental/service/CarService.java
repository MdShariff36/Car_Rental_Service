package com.autoprime.rental.service;

import com.autoprime.rental.entity.Car;
import com.autoprime.rental.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Car Service - Business logic for car operations
 */
@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    /**
     * Get all cars with pagination
     */
    public Page<Car> getAllCars(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return carRepository.findAll(pageable);
    }

    /**
     * Get car by ID
     */
    public Car getCarById(Long id) {
        return carRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
    }

    /**
     * Get popular cars
     */
    public List<Car> getPopularCars(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return carRepository.findPopularCars(pageable);
    }

    /**
     * Search cars by keyword
     */
    public Page<Car> searchCars(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carRepository.searchCars(keyword, pageable);
    }

    /**
     * Get cars by host
     */
    public List<Car> getCarsByHost(Long hostId) {
        return carRepository.findByHostId(hostId);
    }

    /**
     * Filter cars by type, transmission, fuel type
     */
    public Page<Car> filterCars(Car.CarType carType, Car.Transmission transmission, 
                                Car.FuelType fuelType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        if (carType != null) {
            return carRepository.findByCarType(carType, pageable);
        } else if (transmission != null) {
            return carRepository.findByTransmission(transmission, pageable);
        } else if (fuelType != null) {
            return carRepository.findByFuelType(fuelType, pageable);
        }
        
        return carRepository.findAll(pageable);
    }

    /**
     * Add new car (HOST only)
     */
    @Transactional
    public Car addCar(Car car) {
        if (carRepository.existsByRegistrationNumber(car.getRegistrationNumber())) {
            throw new RuntimeException("Car with this registration number already exists");
        }
        return carRepository.save(car);
    }

    /**
     * Update car details
     */
    @Transactional
    public Car updateCar(Long carId, Car updatedCar) {
        Car car = getCarById(carId);
        
        car.setBrand(updatedCar.getBrand());
        car.setModel(updatedCar.getModel());
        car.setYear(updatedCar.getYear());
        car.setCarType(updatedCar.getCarType());
        car.setTransmission(updatedCar.getTransmission());
        car.setFuelType(updatedCar.getFuelType());
        car.setSeatingCapacity(updatedCar.getSeatingCapacity());
        car.setPricePerDay(updatedCar.getPricePerDay());
        car.setSecurityDeposit(updatedCar.getSecurityDeposit());
        car.setMileage(updatedCar.getMileage());
        car.setColor(updatedCar.getColor());
        car.setDescription(updatedCar.getDescription());
        car.setFeatures(updatedCar.getFeatures());
        car.setImages(updatedCar.getImages());
        car.setLocation(updatedCar.getLocation());
        car.setAvailability(updatedCar.getAvailability());
        
        return carRepository.save(car);
    }

    /**
     * Delete car
     */
    @Transactional
    public void deleteCar(Long carId) {
        Car car = getCarById(carId);
        carRepository.delete(car);
    }

    /**
     * Update car rating
     */
    @Transactional
    public void updateCarRating(Long carId, Double newRating) {
        Car car = getCarById(carId);
        car.setRating(java.math.BigDecimal.valueOf(newRating));
        carRepository.save(car);
    }

    /**
     * Increment trip count
     */
    @Transactional
    public void incrementTripCount(Long carId) {
        Car car = getCarById(carId);
        car.setTotalTrips(car.getTotalTrips() + 1);
        carRepository.save(car);
    }
}