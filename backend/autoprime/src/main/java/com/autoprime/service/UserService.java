package com.autoprime.service;

import com.autoprime.model.Booking;
import com.autoprime.model.User;
import com.autoprime.repository.BookingRepository;
import com.autoprime.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    public List<Booking> getUserBookings(User user) {
        return bookingRepository.findByUser(user);
    }
}
