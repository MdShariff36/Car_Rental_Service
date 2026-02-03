package com.autoprime.rental.controller;

import com.autoprime.rental.dto.ApiResponse;
import com.autoprime.rental.entity.Booking;
import com.autoprime.rental.entity.Car;
import com.autoprime.rental.entity.User;
import com.autoprime.rental.service.BookingService;
import com.autoprime.rental.service.CarService;
import com.autoprime.rental.service.PaymentService;
import com.autoprime.rental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/host")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
public class HostController {

    @Autowired
    private UserService userService;

    @Autowired
    private CarService carService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<?>> getHostDashboard(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            
            List<Car> cars = carService.getCarsByHost(user.getId());
            Long totalBookings = bookingService.countHostBookings(user.getId());
            BigDecimal earnings = paymentService.getHostEarnings(user.getId());
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalCars", cars.size());
            stats.put("totalBookings", totalBookings);
            stats.put("totalEarnings", earnings);
            stats.put("cars", cars);
            
            return ResponseEntity.ok(ApiResponse.success("Host dashboard data retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/cars")
    public ResponseEntity<ApiResponse<?>> getHostCars(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            List<Car> cars = carService.getCarsByHost(user.getId());
            return ResponseEntity.ok(ApiResponse.success("Host cars retrieved", cars));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<?>> getHostBookings(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            List<Booking> bookings = bookingService.getHostBookings(user.getId());
            return ResponseEntity.ok(ApiResponse.success("Host bookings retrieved", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/earnings")
    public ResponseEntity<ApiResponse<?>> getHostEarnings(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            BigDecimal earnings = paymentService.getHostEarnings(user.getId());
            
            Map<String, Object> data = new HashMap<>();
            data.put("totalEarnings", earnings);
            
            return ResponseEntity.ok(ApiResponse.success("Earnings retrieved", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}