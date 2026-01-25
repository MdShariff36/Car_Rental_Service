package com.autoprime.service;

import com.autoprime.dto.*;
import com.autoprime.model.Role;
import com.autoprime.model.User;
import com.autoprime.repository.UserRepository;
import com.autoprime.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setLicenseNumber(request.getLicense());
        user.setAddress(request.getAddress());
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        
        // Save user
        user = userRepository.save(user);
        
        // Generate token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        
        // Create UserDTO
        UserDTO userDTO = convertToDTO(user);
        
        return new AuthResponse(token, "User registered successfully!", userDTO);
    }
    
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Generate token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        
        // Create UserDTO
        UserDTO userDTO = convertToDTO(user);
        
        return new AuthResponse(token, "Login successful!", userDTO);
    }
    
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getLicenseNumber(),
            user.getAddress(),
            user.getRole()
        );
    }
}