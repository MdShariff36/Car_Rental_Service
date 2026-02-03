package com.autoprime.rental.service;

import com.autoprime.rental.entity.User;
import com.autoprime.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public User updateProfile(Long userId, User updatedUser) {
        User user = getUserById(userId);
        
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPhone(updatedUser.getPhone());
        user.setDateOfBirth(updatedUser.getDateOfBirth());
        user.setGender(updatedUser.getGender());
        user.setAddress(updatedUser.getAddress());
        user.setCity(updatedUser.getCity());
        user.setPincode(updatedUser.getPincode());
        user.setLicenseNumber(updatedUser.getLicenseNumber());
        user.setLicenseExpiry(updatedUser.getLicenseExpiry());
        
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        user.setIsActive(false);
        userRepository.save(user);
    }
}