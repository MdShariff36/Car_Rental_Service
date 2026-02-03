package com.autoprime.rental.controller;

import com.autoprime.rental.dto.ApiResponse;
import com.autoprime.rental.entity.Review;
import com.autoprime.rental.entity.User;
import com.autoprime.rental.service.ReviewService;
import com.autoprime.rental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    @GetMapping("/car/{carId}")
    public ResponseEntity<ApiResponse<?>> getCarReviews(@PathVariable Long carId) {
        try {
            List<Review> reviews = reviewService.getCarReviews(carId);
            return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviews));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> submitReview(Authentication authentication, @RequestBody Review review) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            review.setUserId(user.getId());
            Review savedReview = reviewService.submitReview(review);
            return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", savedReview));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}