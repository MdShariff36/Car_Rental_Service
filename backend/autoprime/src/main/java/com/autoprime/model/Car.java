package com.autoprime.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String name;
    private String type;
    private String transmission;
    private String fuel;
    private String city;

    private BigDecimal pricePerDay;

    private String mainImage; // filename

    @ManyToOne
    private User host; // car owner (host role)
}
