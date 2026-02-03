package com.autoprime.rental.service;

import com.autoprime.rental.entity.Review;
import com.autoprime.rental.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CarService carService;

    public List<Review> getCarReviews(Long carId) {
        return reviewRepository.findByCarId(carId);
    }

    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Transactional
    public Review submitReview(Review review) {
        // Check if review already exists for this booking
        if (reviewRepository.existsByBookingId(review.getBookingId())) {
            throw new RuntimeException("Review already submitted for this booking");
        }
        
        // Validate rating
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        
        Review savedReview = reviewRepository.save(review);
        
        // Update car rating
        Double avgRating = reviewRepository.getAverageRatingByCarId(review.getCarId());
        if (avgRating != null) {
            carService.updateCarRating(review.getCarId(), avgRating);
        }
        
        return savedReview;
    }

    public Double getCarAverageRating(Long carId) {
        return reviewRepository.getAverageRatingByCarId(carId);
    }

    public Long getCarReviewCount(Long carId) {
        return reviewRepository.countByCarId(carId);
    }
}