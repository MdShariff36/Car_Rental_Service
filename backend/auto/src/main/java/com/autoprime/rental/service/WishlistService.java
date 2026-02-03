package com.autoprime.rental.service;

import com.autoprime.rental.entity.Wishlist;
import com.autoprime.rental.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private CarService carService;

    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Transactional
    public Wishlist addToWishlist(Long userId, Long carId) {
        // Verify car exists
        carService.getCarById(carId);
        
        // Check if already in wishlist
        if (wishlistRepository.existsByUserIdAndCarId(userId, carId)) {
            throw new RuntimeException("Car already in wishlist");
        }
        
        Wishlist wishlist = new Wishlist();
        wishlist.setUserId(userId);
        wishlist.setCarId(carId);
        
        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long carId) {
        if (!wishlistRepository.existsByUserIdAndCarId(userId, carId)) {
            throw new RuntimeException("Car not in wishlist");
        }
        
        wishlistRepository.deleteByUserIdAndCarId(userId, carId);
    }

    public boolean isInWishlist(Long userId, Long carId) {
        return wishlistRepository.existsByUserIdAndCarId(userId, carId);
    }
}