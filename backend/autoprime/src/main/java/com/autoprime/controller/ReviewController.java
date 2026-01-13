package com.autoprime.controller;

import com.autoprime.model.Review;
import com.autoprime.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/add")
    public Review addReview(@RequestParam Long userId,
                            @RequestParam Long carId,
                            @RequestParam int rating,
                            @RequestParam String comment) {
        return reviewService.addReview(userId, carId, rating, comment);
    }

    @GetMapping("/car/{carId}")
    public List<Review> getReviews(@PathVariable Long carId) {
        return reviewService.getCarReviews(carId);
    }
}
