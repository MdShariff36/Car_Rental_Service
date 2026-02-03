package com.autoprime.rental.controller;

import com.autoprime.rental.dto.ApiResponse;
import com.autoprime.rental.entity.Car;
import com.autoprime.rental.entity.User;
import com.autoprime.rental.service.CarService;
import com.autoprime.rental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    @Autowired
    private CarService carService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllCars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String carType,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) String fuelType) {
        try {
            Page<Car> cars;
            
            if (carType != null || transmission != null || fuelType != null) {
                cars = carService.filterCars(
                    carType != null ? Car.CarType.valueOf(carType.toUpperCase()) : null,
                    transmission != null ? Car.Transmission.valueOf(transmission.toUpperCase()) : null,
                    fuelType != null ? Car.FuelType.valueOf(fuelType.toUpperCase()) : null,
                    page, size
                );
            } else {
                cars = carService.getAllCars(page, size);
            }
            
            return ResponseEntity.ok(ApiResponse.success("Cars retrieved", cars));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getCarById(@PathVariable Long id) {
        try {
            Car car = carService.getCarById(id);
            return ResponseEntity.ok(ApiResponse.success("Car retrieved", car));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<?>> getPopularCars(@RequestParam(defaultValue = "6") int limit) {
        try {
            List<Car> cars = carService.getPopularCars(limit);
            return ResponseEntity.ok(ApiResponse.success("Popular cars retrieved", cars));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchCars(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            Page<Car> cars = carService.searchCars(keyword, page, size);
            return ResponseEntity.ok(ApiResponse.success("Search results", cars));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> addCar(Authentication authentication, @RequestBody Car car) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            car.setHostId(user.getId());
            Car savedCar = carService.addCar(car);
            return ResponseEntity.ok(ApiResponse.success("Car added successfully", savedCar));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateCar(@PathVariable Long id, @RequestBody Car car) {
        try {
            Car updated = carService.updateCar(id, car);
            return ResponseEntity.ok(ApiResponse.success("Car updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteCar(@PathVariable Long id) {
        try {
            carService.deleteCar(id);
            return ResponseEntity.ok(ApiResponse.success("Car deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}