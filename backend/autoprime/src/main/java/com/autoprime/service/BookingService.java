package com.autoprime.service;

import com.autoprime.dto.BookingRequest;
import com.autoprime.model.Booking;
import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.repository.BookingRepository;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository; // Added
    private final CarRepository carRepository;   // Added

    // Helper method (Logic)
    public Booking createBookingEntity(User user, Car car, LocalDateTime pickup, LocalDateTime drop) {
        long days = Duration.between(pickup, drop).toDays();
        if (days == 0) days = 1;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCar(car);
        booking.setPickupTime(pickup);
        booking.setDropTime(drop);
        booking.setTotalAmount(car.getPricePerDay().multiply(BigDecimal.valueOf(days)));
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    // Fixed: Added method to match BookingController
    public Booking createBooking(BookingRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        return createBookingEntity(user, car, request.getPickupTime(), request.getDropTime());
    }

    public List<Booking> getUserBookings(User user) {
        return bookingRepository.findByUser(user);
    }
}