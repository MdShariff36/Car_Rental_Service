package com.autoprime.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Car car;

    @ManyToOne
    private User user;

    private LocalDateTime pickupTime;
    private LocalDateTime dropTime;

    private BigDecimal totalAmount;

    private String status; // PENDING, PAID, CANCELLED
}
