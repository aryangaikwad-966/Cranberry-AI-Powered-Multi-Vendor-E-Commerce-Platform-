package com.cranberry.marketplace.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.UserResponse;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        UserResponse profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> updates) {
        Long userId = extractUserId(authHeader);
        UserResponse profile = userService.updateUserProfile(
                userId,
                updates.get("name"),
                updates.get("email")
        );
        return ResponseEntity.ok(ApiResponse.success("Profile updated", profile));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        return authService.findByEmail(email).getId();
    }
}
