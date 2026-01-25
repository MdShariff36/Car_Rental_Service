
// AdminService.java
package com.autoprime.service;

import com.autoprime.model.User;
import com.autoprime.model.Car;
import com.autoprime.model.Booking;
import com.autoprime.model.Payment;
import com.autoprime.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        long totalHosts = userRepository.findByRole(com.autoprime.model.Role.HOST).size();
        
        // Car statistics
        long totalCars = carRepository.count();
        long availableCars = carRepository.findByStatus("AVAILABLE").size();
        
        // Booking statistics
        long totalBookings = bookingRepository.count();
        long activeBookings = bookingRepository.findByStatus("CONFIRMED").size();
        long completedBookings = bookingRepository.findByStatus("COMPLETED").size();
        
        // Revenue statistics
        double totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()) || "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(Booking::getTotal)
                .sum();
        
        double todayRevenue = bookingRepository.findAll().stream()
                .filter(b -> b.getCreatedAt().toLocalDate().equals(LocalDate.now()))
                .filter(b -> "COMPLETED".equals(b.getStatus()) || "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(Booking::getTotal)
                .sum();
        
        dashboard.put("totalUsers", totalUsers);
        dashboard.put("totalHosts", totalHosts);
        dashboard.put("totalCars", totalCars);
        dashboard.put("availableCars", availableCars);
        dashboard.put("totalBookings", totalBookings);
        dashboard.put("activeBookings", activeBookings);
        dashboard.put("completedBookings", completedBookings);
        dashboard.put("totalRevenue", totalRevenue);
        dashboard.put("todayRevenue", todayRevenue);
        
        return dashboard;
    }
    
    public Map<String, Object> getReports(String reportType) {
        Map<String, Object> report = new HashMap<>();
        
        switch (reportType.toUpperCase()) {
            case "USERS":
                report.put("users", userRepository.findAll());
                report.put("totalUsers", userRepository.count());
                break;
                
            case "BOOKINGS":
                List<Booking> bookings = bookingRepository.findAll();
                report.put("bookings", bookings);
                report.put("totalBookings", bookings.size());
                report.put("revenue", bookings.stream()
                        .filter(b -> "COMPLETED".equals(b.getStatus()))
                        .mapToDouble(Booking::getTotal)
                        .sum());
                break;
                
            case "REVENUE":
                double revenue = bookingRepository.findAll().stream()
                        .filter(b -> "COMPLETED".equals(b.getStatus()) || "CONFIRMED".equals(b.getStatus()))
                        .mapToDouble(Booking::getTotal)
                        .sum();
                report.put("totalRevenue", revenue);
                report.put("payments", paymentRepository.findAll());
                break;
                
            default:
                throw new RuntimeException("Invalid report type");
        }
        
        return report;
    }
}