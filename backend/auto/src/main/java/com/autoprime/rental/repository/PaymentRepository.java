package com.autoprime.rental.repository;

import com.autoprime.rental.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Payment Repository - Database operations for Payment entity
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByBookingId(Long bookingId);
    
    List<Payment> findByUserId(Long userId);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByPaymentStatus(Payment.PaymentStatus paymentStatus);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.userId IN " +
           "(SELECT b.hostId FROM Booking b WHERE b.id = p.bookingId) AND p.paymentStatus = 'SUCCESS'")
    BigDecimal getHostEarnings(@Param("hostId") Long hostId);
}