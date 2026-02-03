package com.autoprime.rental.controller;

import com.autoprime.rental.dto.ApiResponse;
import com.autoprime.rental.entity.User;
import com.autoprime.rental.entity.Wishlist;
import com.autoprime.rental.service.UserService;
import com.autoprime.rental.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> getUserWishlist(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            List<Wishlist> wishlist = wishlistService.getUserWishlist(user.getId());
            return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved", wishlist));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{carId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> addToWishlist(Authentication authentication, @PathVariable Long carId) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            Wishlist wishlist = wishlistService.addToWishlist(user.getId(), carId);
            return ResponseEntity.ok(ApiResponse.success("Added to wishlist", wishlist));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{carId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> removeFromWishlist(Authentication authentication, @PathVariable Long carId) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            wishlistService.removeFromWishlist(user.getId(), carId);
            return ResponseEntity.ok(ApiResponse.success("Removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}