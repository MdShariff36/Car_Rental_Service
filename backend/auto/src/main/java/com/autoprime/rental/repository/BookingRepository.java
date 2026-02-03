package com.autoprime.rental.repository;

import com.autoprime.rental.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Booking Repository - Database operations for Booking entity
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByCarId(Long carId);
    
    List<Booking> findByHostId(Long hostId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.carId = :carId AND b.status NOT IN ('CANCELLED', 'COMPLETED') " +
           "AND ((b.pickupDate <= :endDate AND b.dropDate >= :startDate))")
    List<Booking> findConflictingBookings(
        @Param("carId") Long carId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") Booking.BookingStatus status);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.hostId = :hostId")
    Long countByHostId(@Param("hostId") Long hostId);
}