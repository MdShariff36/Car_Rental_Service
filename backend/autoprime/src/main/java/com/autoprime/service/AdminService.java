package com.autoprime.service;

import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CarRepository carRepository; // Added dependency

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Fixed: Added method to match AdminController
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }
}