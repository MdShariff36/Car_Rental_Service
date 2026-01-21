package com.autoprime.controller;

import com.autoprime.model.Role;
import com.autoprime.model.User;
import com.autoprime.dto.RegisterRequest;
import com.autoprime.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Critical: Allows Frontend (port 5500) to talk to Backend (port 8080)
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        // 1. Check if email already exists in MySQL
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        // 2. Create User Object
        User user = new User(
            request.getName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()), // Encrypt password
            request.getPhone(),
            request.getLicense(),
            request.getAddress(),
            Role.valueOf(request.getRole().toUpperCase())
        );

        // 3. Save to MySQL Database
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }
}