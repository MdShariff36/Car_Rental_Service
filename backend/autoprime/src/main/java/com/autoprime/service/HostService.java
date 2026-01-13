package com.autoprime.service;

import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HostService {

    private final CarRepository carRepository;

    public List<Car> getHostCars(User host) {
        return carRepository.findByHost(host);
    }
}
