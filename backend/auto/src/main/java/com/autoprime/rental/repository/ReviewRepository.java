package com.autoprime.rental.repository;

import com.autoprime.rental.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Review Repository - Database operations for Review entity
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByCarId(Long carId);
    
    List<Review> findByUserId(Long userId);
    
    Boolean existsByBookingId(Long bookingId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.carId = :carId")
    Double getAverageRatingByCarId(@Param("carId") Long carId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.carId = :carId")
    Long countByCarId(@Param("carId") Long carId);
}