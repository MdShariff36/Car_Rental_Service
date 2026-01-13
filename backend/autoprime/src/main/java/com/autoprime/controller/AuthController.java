package com.autoprime.controller;

import com.autoprime.dto.LoginRequest;
import com.autoprime.dto.RegisterRequest;
import com.autoprime.dto.ApiResponse;
import com.autoprime.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        String msg = authService.register(request);
        return ResponseEntity.ok(new ApiResponse(true, msg));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        if (token == null) return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid credentials"));
        return ResponseEntity.ok(token);
    }
}
