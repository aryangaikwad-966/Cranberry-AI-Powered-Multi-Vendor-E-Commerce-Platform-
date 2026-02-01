package com.cranberry.marketplace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.AuthResponse;
import com.cranberry.marketplace.dto.LoginRequest;
import com.cranberry.marketplace.dto.RegisterRequest;
import com.cranberry.marketplace.dto.VendorRequest;
import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.service.VendorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final VendorService vendorService;

    public AuthController(AuthService authService, VendorService vendorService) {
        this.authService = authService;
        this.vendorService = vendorService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        
        // If registering as vendor, first register as CUSTOMER, then create vendor profile
        String requestedRole = request.getRole() != null ? request.getRole().toUpperCase() : "CUSTOMER";
        if ("VENDOR".equals(requestedRole)) {
            user.setRole("CUSTOMER"); // Initially set as customer
        } else {
            user.setRole(requestedRole);
        }
        
        User registeredUser = authService.register(user);

        // If registering as vendor, create vendor profile with PENDING status
        if ("VENDOR".equals(requestedRole)) {
            VendorRequest vendorRequest = new VendorRequest();
            vendorRequest.setUserId(registeredUser.getId());
            vendorRequest.setShopName(request.getStoreName() != null ? request.getStoreName() : registeredUser.getName() + "'s Store");
            vendorRequest.setContactEmail(registeredUser.getEmail());
            // VendorService.createVendor sets status to "pending" and role to "VENDOR"
            vendorService.createVendor(vendorRequest);
        }

        String token = JwtUtil.generateToken(registeredUser.getEmail(), registeredUser.getId(), registeredUser.getRole());
        AuthResponse authResponse = new AuthResponse(token, registeredUser.getId(),
                registeredUser.getName(), registeredUser.getEmail(), registeredUser.getRole());

        String message = "VENDOR".equals(requestedRole) 
            ? "Registration successful! Your vendor account is pending admin approval."
            : "Registration successful";

        return ResponseEntity.ok(ApiResponse.success(message, authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.login(request.getEmail(), request.getPassword());
        String token = JwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());

        AuthResponse authResponse = new AuthResponse(token, user.getId(),
                user.getName(), user.getEmail(), user.getRole());

        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        User user = authService.findByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}