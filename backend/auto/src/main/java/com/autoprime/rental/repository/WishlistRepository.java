package com.autoprime.rental.repository;

import com.autoprime.rental.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Wishlist Repository - Database operations for Wishlist entity
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    List<Wishlist> findByUserId(Long userId);
    
    Optional<Wishlist> findByUserIdAndCarId(Long userId, Long carId);
    
    Boolean existsByUserIdAndCarId(Long userId, Long carId);
    
    void deleteByUserIdAndCarId(Long userId, Long carId);
}