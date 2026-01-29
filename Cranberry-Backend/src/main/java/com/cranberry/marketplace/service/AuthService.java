package com.cranberry.marketplace.service;

import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.repository.UserRepository;
import com.cranberry.marketplace.exception.BadRequestException;
import com.cranberry.marketplace.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Set default role to CUSTOMER if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        return userRepository.save(user);
    }


    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        // If user is a vendor, check approval status
        if ("VENDOR".equalsIgnoreCase(user.getRole())) {
            // Check vendor status
            com.cranberry.marketplace.model.Vendor vendor = user.getVendor();
            if (vendor == null) {
                throw new BadRequestException("Vendor profile not found. Please register as a vendor.");
            }
            if (!"APPROVED".equalsIgnoreCase(vendor.getStatus())) {
                throw new BadRequestException("Your vendor account is not approved yet. Please wait for admin approval.");
            }
        }

        return user;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}