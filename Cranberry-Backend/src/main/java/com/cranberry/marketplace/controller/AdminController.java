package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.AdminDashboardResponse;
import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.ProductResponse;
import com.cranberry.marketplace.dto.VendorResponse;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        AdminDashboardResponse dashboard = adminService.getDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/vendors")
    public ResponseEntity<ApiResponse<List<VendorResponse>>> getAllVendors(
            @RequestParam(required = false) String status) {
        List<VendorResponse> vendors = adminService.getAllVendors(status);
        return ResponseEntity.ok(ApiResponse.success(vendors));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        List<ProductResponse> products = adminService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @PutMapping("/vendors/{id}/approve")
    public ResponseEntity<ApiResponse<Vendor>> approveVendor(@PathVariable Long id) {
        Vendor vendor = adminService.approveVendor(id);
        return ResponseEntity.ok(ApiResponse.success("Vendor approved", vendor));
    }

    @PutMapping("/vendors/{id}/reject")
    public ResponseEntity<ApiResponse<Vendor>> rejectVendor(@PathVariable Long id) {
        Vendor vendor = adminService.rejectVendor(id);
        return ResponseEntity.ok(ApiResponse.success("Vendor rejected", vendor));
    }

    @DeleteMapping("/vendors/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVendor(@PathVariable Long id) {
        adminService.deleteVendor(id);
        return ResponseEntity.ok(ApiResponse.success("Vendor deleted"));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted"));
    }

    @PutMapping("/products/{id}/moderate")
    public ResponseEntity<ApiResponse<Product>> moderateProduct(@PathVariable Long id, @RequestParam String status) {
        Product product = adminService.moderateProduct(id, status);
        return ResponseEntity.ok(ApiResponse.success("Product status updated to " + status, product));
    }
}
