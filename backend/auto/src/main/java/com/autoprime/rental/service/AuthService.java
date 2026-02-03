package com.autoprime.rental.service;

import com.autoprime.rental.entity.User;
import com.autoprime.rental.repository.UserRepository;
import com.autoprime.rental.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Service - Handles user authentication and registration
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Register new user
     */
    @Transactional
    public User register(String email, String password, String firstName, String lastName, 
                        String phone, String role) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        user.setRole(User.Role.valueOf(role != null ? role.toUpperCase() : "USER"));
        user.setIsActive(true);

        return userRepository.save(user);
    }

    /**
     * Authenticate user and generate JWT token
     */
    public String login(String email, String password) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );

        // Get user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // Get user entity for additional claims
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Create claims with user info
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", user.getRole().name());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());

        // Generate and return JWT token
        return jwtUtil.generateToken(userDetails, claims);
    }

    /**
     * Verify JWT token
     */
    public boolean verifyToken(String token) {
        return jwtUtil.validateToken(token);
    }

    /**
     * Get user from JWT token
     */
    public User getUserFromToken(String token) {
        String email = jwtUtil.extractUsername(token);
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Request password reset (basic implementation)
     */
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // TODO: Implement email sending logic
        // For now, just log it
        System.out.println("Password reset requested for: " + email);
    }
}
