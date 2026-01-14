package com.autoprime.service;

import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.model.Wishlist;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.UserRepository;
import com.autoprime.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository; // Added
    private final CarRepository carRepository;   // Added

    // Fixed: Added method to match WishlistController
    public Wishlist addToWishlist(Long userId, Long carId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setCar(car);
        return wishlistRepository.save(wishlist);
    }

    // Fixed: Added method to match WishlistController
    public List<Wishlist> getUserWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUser(user);
    }
}