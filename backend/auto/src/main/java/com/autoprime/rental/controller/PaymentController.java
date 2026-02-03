package com.autoprime.rental.controller;

import com.autoprime.rental.dto.ApiResponse;
import com.autoprime.rental.entity.Payment;
import com.autoprime.rental.entity.User;
import com.autoprime.rental.service.PaymentService;
import com.autoprime.rental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> processPayment(Authentication authentication, @RequestBody Map<String, Object> paymentData) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            
            Long bookingId = Long.valueOf(paymentData.get("bookingId").toString());
            BigDecimal amount = new BigDecimal(paymentData.get("amount").toString());
            String paymentMethodStr = paymentData.get("paymentMethod").toString();
            
            Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.valueOf(paymentMethodStr.toUpperCase());
            
            Payment payment = paymentService.processPayment(bookingId, user.getId(), amount, paymentMethod);
            return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> getPaymentStatus(@PathVariable Long bookingId) {
        try {
            Payment payment = paymentService.getPaymentByBookingId(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Payment status retrieved", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}