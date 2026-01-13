package com.autoprime.service;

import com.autoprime.model.Booking;
import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.repository.BookingRepository;
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

    public Booking createBooking(User user, Car car, LocalDateTime pickup, LocalDateTime drop) {
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

    public List<Booking> getUserBookings(User user) {
        return bookingRepository.findByUser(user);
    }
}
