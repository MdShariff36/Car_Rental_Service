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
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private CarService carService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<?>> getAdminDashboard() {
        try {
            List<User> users = userService.getAllUsers();
            List<Booking> bookings = bookingService.getAllBookings();
            BigDecimal revenue = paymentService.getTotalRevenue();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", users.size());
            stats.put("totalBookings", bookings.size());
            stats.put("totalRevenue", revenue);
            
            return ResponseEntity.ok(ApiResponse.success("Admin dashboard data retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/cars")
    public ResponseEntity<ApiResponse<?>> getAllCars() {
        try {
            List<Car> cars = carService.getAllCars(0, Integer.MAX_VALUE).getContent();
            return ResponseEntity.ok(ApiResponse.success("Cars retrieved", cars));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<?>> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<?>> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updated = userService.updateProfile(id, user);
            return ResponseEntity.ok(ApiResponse.success("User updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}