package com.autoprime.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String upiId;

    private BigDecimal amount;

    private String status; // CREATED, SUCCESS, FAILED

    private LocalDateTime timestamp;

    @OneToOne
    private Booking booking;
}
