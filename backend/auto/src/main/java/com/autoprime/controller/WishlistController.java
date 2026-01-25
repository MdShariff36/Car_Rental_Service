// WishlistController.java
package com.autoprime.controller;

import com.autoprime.model.Wishlist;
import com.autoprime.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {
    
    @Autowired
    private WishlistService wishlistService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserWishlist(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> addToWishlist(
            @RequestParam Long userId,
            @RequestParam Long carId) {
        try {
            Wishlist wishlist = wishlistService.addToWishlist(userId, carId);
            return ResponseEntity.ok(Map.of(
                "message", "Added to wishlist",
                "wishlist", wishlist
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long id) {
        try {
            wishlistService.removeFromWishlist(id);
            return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to remove from wishlist"));
        }
    }
}
