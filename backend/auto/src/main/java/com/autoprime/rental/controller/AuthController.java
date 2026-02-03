package com.autoprime.rental.controller;

import com.autoprime.rental.dto.ApiResponse;
import com.autoprime.rental.entity.User;
import com.autoprime.rental.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller - Handles authentication endpoints
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register new user
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody @Valid Map<String, String> registerData) {
        try {
            User user = authService.register(
                registerData.get("email"),
                registerData.get("password"),
                registerData.get("firstName"),
                registerData.get("lastName"),
                registerData.get("phone"),
                registerData.get("role")
            );

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * User login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody @Valid Map<String, String> loginData) {
        try {
            String token = authService.login(loginData.get("email"), loginData.get("password"));
            User user = authService.getUserFromToken(token);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("type", "Bearer");
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid email or password"));
        }
    }

    /**
     * Verify JWT token
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<?>> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                boolean isValid = authService.verifyToken(token);
                
                if (isValid) {
                    User user = authService.getUserFromToken(token);
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("userId", user.getId());
                    response.put("email", user.getEmail());
                    response.put("role", user.getRole().name());
                    
                    return ResponseEntity.ok(ApiResponse.success("Token is valid", response));
                }
            }
            return ResponseEntity.ok(ApiResponse.error("Invalid token"));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Invalid token"));
        }
    }

    /**
     * User logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout() {
        // JWT is stateless, so logout is handled client-side
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }

    /**
     * Forgot password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestBody Map<String, String> data) {
        try {
            authService.forgotPassword(data.get("email"));
            return ResponseEntity.ok(ApiResponse.success("Password reset link sent to email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}