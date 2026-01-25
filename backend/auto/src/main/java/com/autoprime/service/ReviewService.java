package com.autoprime.service;

import com.autoprime.model.Review;
import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.repository.ReviewRepository;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get all reviews for a specific car
     */
    public List<Review> getCarReviews(Long carId) {
        if (carId == null) {
            throw new RuntimeException("Car ID cannot be null");
        }
        
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));
        
        return reviewRepository.findByCarOrderByCreatedAtDesc(car);
    }
    
    /**
     * Get all reviews by a specific user
     */
    public List<Review> getUserReviews(Long userId) {
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        return reviewRepository.findByUser(user);
    }
    
    /**
     * Add a new review
     */
    @Transactional
    public Review addReview(Long userId, Long carId, Review review) {
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        
        if (carId == null) {
            throw new RuntimeException("Car ID cannot be null");
        }
        
        if (review == null) {
            throw new RuntimeException("Review cannot be null");
        }
        
        // Validate rating
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Find car
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));
        
        // Set user and car
        review.setUser(user);
        review.setCar(car);
        
        // Save review
        Review savedReview = reviewRepository.save(review);
        
        // Update car rating
        updateCarRating(car);
        
        return savedReview;
    }
    
    /**
     * Update car's average rating based on all reviews
     */
    private void updateCarRating(Car car) {
        List<Review> reviews = reviewRepository.findByCar(car);
        
        if (reviews.isEmpty()) {
            car.setRating(0.0);
            car.setTotalTrips(0);
        } else {
            // Calculate average rating
            double averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            
            // Round to 1 decimal place
            averageRating = Math.round(averageRating * 10.0) / 10.0;
            
            car.setRating(averageRating);
            car.setTotalTrips(reviews.size());
        }
        
        carRepository.save(car);
    }
    
    /**
     * Get a review by ID
     */
    public Review getReviewById(Long id) {
        if (id == null) {
            throw new RuntimeException("Review ID cannot be null");
        }
        
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
    }
    
    /**
     * Update a review
     */
    @Transactional
    public Review updateReview(Long reviewId, Integer newRating, String newComment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        
        boolean updated = false;
        
        if (newRating != null) {
            if (newRating < 1 || newRating > 5) {
                throw new RuntimeException("Rating must be between 1 and 5");
            }
            review.setRating(newRating);
            updated = true;
        }
        
        if (newComment != null && !newComment.trim().isEmpty()) {
            review.setComment(newComment);
            updated = true;
        }
        
        if (!updated) {
            throw new RuntimeException("No changes to update");
        }
        
        Review updatedReview = reviewRepository.save(review);
        
        // Update car rating if rating changed
        if (newRating != null) {
            updateCarRating(review.getCar());
        }
        
        return updatedReview;
    }
    
    /**
     * Delete a review
     */
    @Transactional
    public void deleteReview(Long reviewId) {
        if (reviewId == null) {
            throw new RuntimeException("Review ID cannot be null");
        }
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        
        Car car = review.getCar();
        
        reviewRepository.delete(review);
        
        // Update car rating after deletion
        updateCarRating(car);
    }
    
    /**
     * Get all reviews
     */
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}