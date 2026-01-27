package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.VendorDashboardResponse;
import com.cranberry.marketplace.dto.VendorRequest;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor")
public class VendorController {

    private final VendorService vendorService;
    private final AuthService authService;

    public VendorController(VendorService vendorService, AuthService authService) {
        this.vendorService = vendorService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<VendorDashboardResponse>> getDashboard(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        Vendor vendor = vendorService.getVendorByUserId(userId);
        VendorDashboardResponse dashboard = vendorService.getDashboard(vendor.getId());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Product>>> getVendorProducts(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        Vendor vendor = vendorService.getVendorByUserId(userId);
        List<Product> products = vendorService.getVendorProducts(vendor.getId());
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getVendorOrders(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        Vendor vendor = vendorService.getVendorByUserId(userId);
        List<Order> orders = vendorService.getVendorOrders(vendor.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Vendor>> createVendor(@Valid @RequestBody VendorRequest request) {
        Vendor createdVendor = vendorService.createVendor(request);
        return ResponseEntity.ok(ApiResponse.success("Vendor created successfully", createdVendor));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Vendor>>> getAllVendors() {
        List<Vendor> vendors = vendorService.getAllVendors();
        return ResponseEntity.ok(ApiResponse.success(vendors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Vendor>> getVendorById(@PathVariable Long id) {
        Vendor vendor = vendorService.getVendorById(id);
        return ResponseEntity.ok(ApiResponse.success(vendor));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Vendor>> getVendorByUser(@PathVariable Long userId) {
        Vendor vendor = vendorService.getVendorByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(vendor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Vendor>> updateVendor(@PathVariable Long id,
                                                             @Valid @RequestBody VendorRequest request) {
        Vendor updatedVendor = vendorService.updateVendor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vendor updated successfully", updatedVendor));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Vendor>> updateVendorStatus(@PathVariable Long id,
                                                                   @RequestParam String status) {
        Vendor updatedVendor = vendorService.updateVendorStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Vendor status updated", updatedVendor));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        return authService.findByEmail(email).getId();
    }
}