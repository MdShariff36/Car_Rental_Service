package com.autoprime.service;

import com.autoprime.model.Car;
import com.autoprime.model.Review;
import com.autoprime.model.User;
import com.autoprime.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review addReview(User user, Car car, int rating, String comment) {
        Review review = new Review();
        review.setUser(user);
        review.setCar(car);
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepository.save(review);
    }

    public List<Review> getCarReviews(Car car) {
        return reviewRepository.findByCar(car);
    }
}
