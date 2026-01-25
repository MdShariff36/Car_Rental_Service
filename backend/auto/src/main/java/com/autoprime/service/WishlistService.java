package com.autoprime.service;

import com.autoprime.model.Wishlist;
import com.autoprime.model.User;
import com.autoprime.model.Car;
import com.autoprime.repository.WishlistRepository;
import com.autoprime.repository.UserRepository;
import com.autoprime.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarRepository carRepository;

    /**
     * Get all wishlist items for a specific user
     */
    public List<Wishlist> getUserWishlist(Long userId) {
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return wishlistRepository.findByUser(user);
    }

    /**
     * Add a car to user's wishlist
     */
    @Transactional
    public Wishlist addToWishlist(Long userId, Long carId) {
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        if (carId == null) {
            throw new RuntimeException("Car ID cannot be null");
        }

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Find car
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));

        // Check if already in wishlist
        if (wishlistRepository.existsByUserAndCar(user, car)) {
            throw new RuntimeException("Car is already in your wishlist");
        }

        // Create new wishlist entry
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setCar(car);

        return wishlistRepository.save(wishlist);
    }

    /**
     * Remove a car from wishlist by wishlist ID
     */
    @Transactional
    public void removeFromWishlist(Long wishlistId) {
        if (wishlistId == null) {
            throw new RuntimeException("Wishlist ID cannot be null");
        }

        Wishlist wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found with id: " + wishlistId));

        wishlistRepository.delete(wishlist);
    }

    /**
     * Remove a specific car from user's wishlist
     */
    @Transactional
    public void removeCarFromWishlist(Long userId, Long carId) {
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        if (carId == null) {
            throw new RuntimeException("Car ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));

        Optional<Wishlist> wishlist = wishlistRepository.findByUserAndCar(user, car);

        if (wishlist.isPresent()) {
            wishlistRepository.delete(wishlist.get());
        } else {
            throw new RuntimeException("Car not found in wishlist");
        }
    }

    /**
     * Check if a car is in user's wishlist
     */
    public boolean isInWishlist(Long userId, Long carId) {
        if (userId == null || carId == null) {
            return false;
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new RuntimeException("Car not found"));

            return wishlistRepository.existsByUserAndCar(user, car);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get wishlist item by ID
     */
    public Wishlist getWishlistById(Long id) {
        return wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found with id: " + id));
    }

    /**
     * Clear entire wishlist for a user
     */
    @Transactional
    public void clearWishlist(Long userId) {
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<Wishlist> wishlistItems = wishlistRepository.findByUser(user);

        if (!wishlistItems.isEmpty()) {
            wishlistRepository.deleteAll(wishlistItems);
        }
    }
}