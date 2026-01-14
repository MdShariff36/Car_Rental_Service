package com.autoprime.service;

import com.autoprime.dto.CarRequest;
import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository; // Added

    public List<Car> getCarsByCity(String city) {
        if (city == null || city.isEmpty()) {
            return carRepository.findAll();
        }
        return carRepository.findByCity(city);
    }

    // Fixed: Added method to match CarController
    public Car addCar(CarRequest request, Long hostId, String filename) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host not found"));

        Car car = new Car();
        car.setBrand(request.getBrand());
        car.setName(request.getName());
        car.setType(request.getType());
        car.setTransmission(request.getTransmission());
        car.setFuel(request.getFuel());
        car.setCity(request.getCity());
        car.setPricePerDay(request.getPricePerDay());
        car.setMainImage(filename);
        car.setHost(host);

        return carRepository.save(car);
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
    }
}