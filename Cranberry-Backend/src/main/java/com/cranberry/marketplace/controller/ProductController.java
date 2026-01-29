package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.ProductResponse;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.service.ProductService;
import com.cranberry.marketplace.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final VendorService vendorService;
    private final AuthService authService;

    public ProductController(ProductService productService, VendorService vendorService, AuthService authService) {
        this.productService = productService;
        this.vendorService = vendorService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> addProduct(@Valid @RequestBody Product product,
                                                           @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserId(authHeader);
            Vendor vendor = vendorService.getVendorByUserId(userId);
            product.setVendor(vendor);
            
            // Default status
            if (product.getStatus() == null) {
                product.setStatus("pending");
            }

            Product savedProduct = productService.addProduct(product);
            return ResponseEntity.ok(ApiResponse.success("Product added successfully", savedProduct));
        } catch (Exception e) {
             return ResponseEntity.badRequest().body(ApiResponse.error("Failed to add product: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Integer limit) {
        List<ProductResponse> products = productService.getFilteredProducts(category, search, minPrice, maxPrice, featured, limit)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByVendor(@PathVariable Long vendorId) {
        List<ProductResponse> products = productService.getProductsByVendor(vendorId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Product>>> searchProducts(@RequestParam String query) {
        List<Product> products = productService.searchProducts(query);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id,
                                                              @Valid @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updatedProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        return authService.findByEmail(email).getId();
    }

    private ProductResponse convertToResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getImageUrl(),
                p.getCategory(),
                p.getStatus(),
                p.getVendor() != null ? p.getVendor().getId() : null,
                p.getVendor() != null ? p.getVendor().getShopName() : "Unknown Vendor"
        );
    }
}
