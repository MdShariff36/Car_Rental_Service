package com.autoprime.service;

import com.autoprime.model.Booking;
import com.autoprime.model.Payment;
import com.autoprime.repository.BookingRepository;
import com.autoprime.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository; // Added

    // Fixed: Added method to match PaymentController
    public Payment createPayment(Long bookingId, String upiId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // You might want to get the actual amount from the booking
        BigDecimal amount = booking.getTotalAmount();

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setUpiId(upiId);
        payment.setAmount(amount);
        payment.setStatus("CREATED");
        payment.setTimestamp(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }
}