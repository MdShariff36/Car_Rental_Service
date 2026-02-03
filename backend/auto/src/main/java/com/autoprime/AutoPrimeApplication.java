package com.autoprime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Spring Boot Application class for Auto Prime Rental
 * 
 * @author Auto Prime Development Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class AutoPrimeApplication {

    public static void main(String[] args) {
        SpringApplication.run(AutoPrimeApplication.class, args);
        System.out.println("========================================");
        System.out.println("Auto Prime Rental Backend Started!");
        System.out.println("Server running on: http://localhost:8080");
        System.out.println("========================================");
    }
}