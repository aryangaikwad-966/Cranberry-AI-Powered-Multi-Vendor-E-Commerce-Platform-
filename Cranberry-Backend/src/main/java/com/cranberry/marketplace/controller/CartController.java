package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.CartItemRequest;
import com.cranberry.marketplace.dto.CartResponse;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        CartResponse cart = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CartItemRequest request) {
        Long userId = extractUserId(authHeader);
        CartResponse cart = cartService.addToCart(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CartItemRequest request) {
        Long userId = extractUserId(authHeader);
        CartResponse cart = cartService.updateCartItem(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long productId) {
        Long userId = extractUserId(authHeader);
        CartResponse cart = cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        CartResponse cart = cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", cart));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        return authService.findByEmail(email).getId();
    }
}
