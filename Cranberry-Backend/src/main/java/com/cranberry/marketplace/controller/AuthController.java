package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.LoginRequest;
import com.cranberry.marketplace.dto.RegisterRequest;
import com.cranberry.marketplace.dto.AuthResponse;
import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole() != null ? request.getRole() : "CUSTOMER");
        User registeredUser = authService.register(user);

        String token = JwtUtil.generateToken(registeredUser.getEmail(), registeredUser.getId(), registeredUser.getRole());
        AuthResponse authResponse = new AuthResponse(token, registeredUser.getId(),
                registeredUser.getName(), registeredUser.getEmail(), registeredUser.getRole());

        return ResponseEntity.ok(ApiResponse.success("Registration successful", authResponse));
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