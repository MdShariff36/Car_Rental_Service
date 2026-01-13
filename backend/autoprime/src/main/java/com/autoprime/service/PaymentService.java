package com.autoprime.service;

import com.autoprime.model.Booking;
import com.autoprime.model.Payment;
import com.autoprime.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public Payment createPayment(Booking booking, String upiId, BigDecimal amount) {
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setUpiId(upiId);
        payment.setAmount(amount);
        payment.setStatus("CREATED");
        payment.setTimestamp(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public void completePayment(Payment payment) {
        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);
    }
}
