package com.autoprime.controller;

import com.autoprime.model.Wishlist;
import com.autoprime.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<Wishlist> add(@RequestParam Long userId, @RequestParam Long carId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, carId));
    }

    @GetMapping("/user/{userId}")
    public List<Wishlist> get(@PathVariable Long userId) {
        return wishlistService.getUserWishlist(userId);
    }
}
