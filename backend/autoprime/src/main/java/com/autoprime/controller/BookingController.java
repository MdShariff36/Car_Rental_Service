package com.autoprime.controller;

import com.autoprime.dto.BookingRequest;
import com.autoprime.model.Booking;
import com.autoprime.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request,
                                                 @RequestParam Long userId) {
        return ResponseEntity.ok(bookingService.createBooking(request, userId));
    }
}
