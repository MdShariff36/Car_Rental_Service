package com.autoprime.controller;

import com.autoprime.model.Car;
import com.autoprime.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {
    
    @Autowired
    private CarService carService;
    
    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Car>> getAvailableCars() {
        return ResponseEntity.ok(carService.getAvailableCars());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCarById(@PathVariable Long id) {
        try {
            Car car = carService.getCarById(id);
            return ResponseEntity.ok(car);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Car>> getCarsByType(@PathVariable String type) {
        return ResponseEntity.ok(carService.getCarsByType(type));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Car>> searchCars(@RequestParam String name) {
        return ResponseEntity.ok(carService.searchCars(name));
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<Car>> getCarsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        return ResponseEntity.ok(carService.getCarsByPriceRange(minPrice, maxPrice));
    }
    
    @GetMapping("/location/{location}")
    public ResponseEntity<List<Car>> getCarsByLocation(@PathVariable String location) {
        return ResponseEntity.ok(carService.getCarsByLocation(location));
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getCarsByOwner(@PathVariable Long ownerId) {
        try {
            List<Car> cars = carService.getCarsByOwner(ownerId);
            return ResponseEntity.ok(cars);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> addCar(@RequestBody Car car, @RequestParam Long ownerId) {
        try {
            Car savedCar = carService.addCar(car, ownerId);
            return ResponseEntity.ok(savedCar);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @RequestBody Car car) {
        try {
            Car updatedCar = carService.updateCar(id, car);
            return ResponseEntity.ok(updatedCar);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateCarStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Car car = carService.updateCarStatus(id, status);
            return ResponseEntity.ok(car);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        try {
            carService.deleteCar(id);
            return ResponseEntity.ok(Map.of("message", "Car deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}