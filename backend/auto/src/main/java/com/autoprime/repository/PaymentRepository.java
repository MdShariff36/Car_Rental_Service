package com.autoprime.repository;

import com.autoprime.model.Payment;
import com.autoprime.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByBooking(Booking booking);
    
    List<Payment> findByStatus(String status);
    
    Optional<Payment> findByTransactionId(String transactionId);
}