package com.autoprime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AutoPrimeApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AutoPrimeApplication.class, args);
        System.out.println("🚗 Auto Prime Backend Server is running on http://localhost:8080");
    }
}