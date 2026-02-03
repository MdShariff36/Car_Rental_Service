package com.autoprime.rental.service;

import com.autoprime.rental.entity.Payment;
import com.autoprime.rental.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingService bookingService;

    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new RuntimeException("Payment not found for booking: " + bookingId));
    }

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Transactional
    public Payment processPayment(Long bookingId, Long userId, BigDecimal amount, 
                                 Payment.PaymentMethod paymentMethod) {
        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setUserId(userId);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus(Payment.PaymentStatus.SUCCESS); // Simulated success
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update booking payment status
        bookingService.updatePaymentStatus(bookingId, 
            com.autoprime.rental.entity.Booking.PaymentStatus.PAID);
        bookingService.confirmBooking(bookingId);
        
        return savedPayment;
    }

    @Transactional
    public Payment refundPayment(Long paymentId, BigDecimal refundAmount) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
        payment.setRefundAmount(refundAmount);
        payment.setRefundDate(LocalDateTime.now());
        
        paymentRepository.save(payment);
        
        // Update booking payment status
        bookingService.updatePaymentStatus(payment.getBookingId(), 
            com.autoprime.rental.entity.Booking.PaymentStatus.REFUNDED);
        
        return payment;
    }

    public BigDecimal getTotalRevenue() {
        BigDecimal revenue = paymentRepository.getTotalRevenue();
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    public BigDecimal getHostEarnings(Long hostId) {
        BigDecimal earnings = paymentRepository.getHostEarnings(hostId);
        return earnings != null ? earnings : BigDecimal.ZERO;
    }
}