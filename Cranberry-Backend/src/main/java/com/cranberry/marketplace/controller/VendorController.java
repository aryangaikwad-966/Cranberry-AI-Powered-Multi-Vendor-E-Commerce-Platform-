package com.cranberry.marketplace.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.VendorDashboardResponse;
import com.cranberry.marketplace.dto.VendorOrderResponse;
import com.cranberry.marketplace.dto.VendorRequest;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.service.VendorService;

import jakarta.validation.Valid;

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

    /**
     * Get orders containing this vendor's products.
     * Each order response only includes items that belong to this vendor.
     * If a customer buys from multiple vendors, each vendor sees only their own items.
     */
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<VendorOrderResponse>>> getVendorOrders(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        Vendor vendor = vendorService.getVendorByUserId(userId);
        List<VendorOrderResponse> orders = vendorService.getVendorOrdersFiltered(vendor.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    /**
     * Update order status for vendor's items.
     * Vendors can update status to: PROCESSING, SHIPPED, DELIVERED
     * @deprecated Use /orders/items/{itemId}/status for item-level tracking
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse<VendorOrderResponse>> updateOrderStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long orderId,
            @RequestParam String status) {
        Long userId = extractUserId(authHeader);
        Vendor vendor = vendorService.getVendorByUserId(userId);
        VendorOrderResponse updatedOrder = vendorService.updateOrderStatus(vendor.getId(), orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated to " + status, updatedOrder));
    }

    /**
     * Update individual item status (item-level tracking for multi-vendor orders).
     * Each vendor updates only their own items' status independently.
     * Statuses: PROCESSING, SHIPPED, DELIVERED
     */
    @PutMapping("/orders/items/{itemId}/status")
    public ResponseEntity<ApiResponse<VendorOrderResponse.VendorOrderItemResponse>> updateItemStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long itemId,
            @RequestParam String status) {
        Long userId = extractUserId(authHeader);
        Vendor vendor = vendorService.getVendorByUserId(userId);
        VendorOrderResponse.VendorOrderItemResponse updatedItem = vendorService.updateItemStatus(vendor.getId(), itemId, status);
        return ResponseEntity.ok(ApiResponse.success("Item status updated to " + status, updatedItem));
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