package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.WishlistItemRequest;
import com.cranberry.marketplace.dto.WishlistResponse;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final AuthService authService;

    public WishlistController(WishlistService wishlistService, AuthService authService) {
        this.wishlistService = wishlistService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<WishlistResponse>> getWishlist(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        WishlistResponse wishlist = wishlistService.getWishlist(userId);
        return ResponseEntity.ok(ApiResponse.success(wishlist));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody WishlistItemRequest request) {
        Long userId = extractUserId(authHeader);
        WishlistResponse wishlist = wishlistService.addToWishlist(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to wishlist", wishlist));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<WishlistResponse>> removeFromWishlist(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long productId) {
        Long userId = extractUserId(authHeader);
        WishlistResponse wishlist = wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from wishlist", wishlist));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        return authService.findByEmail(email).getId();
    }
}
