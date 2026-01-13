package com.autoprime.controller;

import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/cars")
    public List<Car> getAllCars() {
        return adminService.getAllCars();
    }
}
