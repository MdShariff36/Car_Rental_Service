package com.autoprime.service;

import com.autoprime.model.Payment;
import com.autoprime.model.Booking;
import com.autoprime.repository.PaymentRepository;
import com.autoprime.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }
    
    public Payment getPaymentByBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return paymentRepository.findByBooking(booking)
                .orElseThrow(() -> new RuntimeException("Payment not found for this booking"));
    }
    
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status);
    }
    
    @Transactional
    public Payment createPayment(Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Check if payment already exists
        if (paymentRepository.findByBooking(booking).isPresent()) {
            throw new RuntimeException("Payment already exists for this booking");
        }
        
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotal());
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId(generateTransactionId());
        payment.setStatus("PENDING");
        
        return paymentRepository.save(payment);
    }
    
    @Transactional
    public Payment processPayment(Long paymentId) {
        Payment payment = getPaymentById(paymentId);
        
        // Simulate payment processing
        // In real application, integrate with payment gateway
        payment.setStatus("SUCCESS");
        
        // Update booking status
        Booking booking = payment.getBooking();
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);
        
        return paymentRepository.save(payment);
    }
    
    @Transactional
    public Payment updatePaymentStatus(Long paymentId, String status) {
        Payment payment = getPaymentById(paymentId);
        payment.setStatus(status);
        
        // Update booking status based on payment status
        Booking booking = payment.getBooking();
        if ("SUCCESS".equals(status)) {
            booking.setStatus("CONFIRMED");
        } else if ("FAILED".equals(status)) {
            booking.setStatus("CANCELLED");
        }
        bookingRepository.save(booking);
        
        return paymentRepository.save(payment);
    }
    
    private String generateTransactionId() {
        return "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}