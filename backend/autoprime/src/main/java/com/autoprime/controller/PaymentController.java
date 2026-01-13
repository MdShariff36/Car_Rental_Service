package com.autoprime.controller;

import com.autoprime.model.Payment;
import com.autoprime.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<Payment> createPayment(@RequestParam Long bookingId,
                                                 @RequestParam String upiId) {
        return ResponseEntity.ok(paymentService.createPayment(bookingId, upiId));
    }
}
