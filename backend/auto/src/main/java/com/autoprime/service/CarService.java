package com.autoprime.service;

import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }
    
    public List<Car> getAvailableCars() {
        return carRepository.findByStatus("AVAILABLE");
    }
    
    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
    }
    
    public List<Car> getCarsByType(String type) {
        return carRepository.findByType(type);
    }
    
    public List<Car> searchCars(String name) {
        return carRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<Car> getCarsByPriceRange(Double minPrice, Double maxPrice) {
        return carRepository.findByPricePerDayBetween(minPrice, maxPrice);
    }
    
    public List<Car> getCarsByLocation(String location) {
        return carRepository.findByLocation(location);
    }
    
    public List<Car> getCarsByOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return carRepository.findByOwner(owner);
    }
    
    public Car addCar(Car car, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        car.setOwner(owner);
        car.setStatus("AVAILABLE");
        return carRepository.save(car);
    }
    
    public Car updateCar(Long id, Car carDetails) {
        Car car = getCarById(id);
        
        car.setName(carDetails.getName());
        car.setType(carDetails.getType());
        car.setTransmission(carDetails.getTransmission());
        car.setSeats(carDetails.getSeats());
        car.setPricePerDay(carDetails.getPricePerDay());
        car.setWeekendExtra(carDetails.getWeekendExtra());
        car.setFuel(carDetails.getFuel());
        car.setMileage(carDetails.getMileage());
        car.setEngine(carDetails.getEngine());
        car.setBoot(carDetails.getBoot());
        car.setAirbags(carDetails.getAirbags());
        car.setDrive(carDetails.getDrive());
        car.setLocation(carDetails.getLocation());
        car.setKmLimit(carDetails.getKmLimit());
        car.setExtraKmCharge(carDetails.getExtraKmCharge());
        
        if (carDetails.getImages() != null) {
            car.setImages(carDetails.getImages());
        }
        if (carDetails.getFeatures() != null) {
            car.setFeatures(carDetails.getFeatures());
        }
        if (carDetails.getSafetyFeatures() != null) {
            car.setSafetyFeatures(carDetails.getSafetyFeatures());
        }
        
        return carRepository.save(car);
    }
    
    public void deleteCar(Long id) {
        Car car = getCarById(id);
        carRepository.delete(car);
    }
    
    public Car updateCarStatus(Long id, String status) {
        Car car = getCarById(id);
        car.setStatus(status);
        return carRepository.save(car);
    }
}