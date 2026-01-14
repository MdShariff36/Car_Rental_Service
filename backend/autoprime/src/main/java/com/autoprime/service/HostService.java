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
public class HostService {

    private final CarRepository carRepository;
    private final UserRepository userRepository; // Added

    // Fixed: Added method to match HostController
    public List<Car> getHostCars(Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host not found"));
        return carRepository.findByHost(host);
    }
}