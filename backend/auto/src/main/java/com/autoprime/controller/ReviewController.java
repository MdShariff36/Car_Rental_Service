// ReviewController.java
package com.autoprime.controller;

import com.autoprime.model.Review;
import com.autoprime.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @GetMapping("/car/{carId}")
    public ResponseEntity<?> getCarReviews(@PathVariable Long carId) {
        try {
            return ResponseEntity.ok(reviewService.getCarReviews(carId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> addReview(
            @RequestBody Review review,
            @RequestParam Long userId,
            @RequestParam Long carId) {
        try {
            Review saved = reviewService.addReview(userId, carId, review);
            return ResponseEntity.ok(Map.of(
                "message", "Review added successfully",
                "review", saved
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
