package com.autoprime.service;

import com.autoprime.model.Car;
import com.autoprime.model.Review;
import com.autoprime.model.User;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.ReviewRepository;
import com.autoprime.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository; // Added
    private final CarRepository carRepository;   // Added

    // Fixed: Added method to match ReviewController
    public Review addReview(Long userId, Long carId, int rating, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        Review review = new Review();
        review.setUser(user);
        review.setCar(car);
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepository.save(review);
    }

    // Fixed: Added method to match ReviewController
    public List<Review> getCarReviews(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        return reviewRepository.findByCar(car);
    }
}