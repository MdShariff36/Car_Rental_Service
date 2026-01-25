// HostService.java
package com.autoprime.service;

import com.autoprime.model.User;
import com.autoprime.model.Car;
import com.autoprime.model.Booking;
import com.autoprime.model.Role;
import com.autoprime.repository.UserRepository;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class HostService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    public Map<String, Object> getHostDashboard(Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host not found"));
        
        if (!Role.HOST.equals(host.getRole())) {
            throw new RuntimeException("User is not a host");
        }
        
        List<Car> cars = carRepository.findByOwner(host);
        
        // Calculate statistics
        int totalCars = cars.size();
        int activeCars = (int) cars.stream()
                .filter(car -> "AVAILABLE".equals(car.getStatus()))
                .count();
        
        double totalEarnings = 0.0;
        int totalBookings = 0;
        
        for (Car car : cars) {
            List<Booking> carBookings = bookingRepository.findByCar(car);
            totalBookings += carBookings.size();
            totalEarnings += carBookings.stream()
                    .filter(b -> "COMPLETED".equals(b.getStatus()) || "CONFIRMED".equals(b.getStatus()))
                    .mapToDouble(Booking::getTotal)
                    .sum();
        }
        
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalCars", totalCars);
        dashboard.put("activeCars", activeCars);
        dashboard.put("totalBookings", totalBookings);
        dashboard.put("totalEarnings", totalEarnings);
        dashboard.put("cars", cars);
        
        return dashboard;
    }
    
    public List<Car> getHostCars(Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host not found"));
        return carRepository.findByOwner(host);
    }
    
    public List<Booking> getHostBookings(Long hostId) {
        List<Car> hostCars = getHostCars(hostId);
        return hostCars.stream()
                .flatMap(car -> bookingRepository.findByCar(car).stream())
                .toList();
    }
}
