package com.autoprime.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique = true)
    private String email;

    @Column(nullable=false)
    private String password;

    private String fullName;

    private String phone;

    private String address;

    @ManyToOne
    private Role role; // USER or HOST or ADMIN

    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "host")
    private List<Car> cars;
}
