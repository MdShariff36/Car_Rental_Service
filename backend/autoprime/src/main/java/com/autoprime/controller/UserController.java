package com.autoprime.controller;

import com.autoprime.model.Booking;
import com.autoprime.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/bookings")
    public List<Booking> getBookings(@RequestParam Long userId) {
        return userService.getUserBookings(userId);
    }
}
