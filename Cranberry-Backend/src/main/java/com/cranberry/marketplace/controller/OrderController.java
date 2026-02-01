package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.OrderRequest;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.OrderItem;
import com.cranberry.marketplace.model.Payment;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import com.cranberry.marketplace.service.OrderService;
import com.cranberry.marketplace.service.PaymentService;
import com.cranberry.marketplace.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;
    private final VendorService vendorService;
    private final PaymentService paymentService;

    public OrderController(OrderService orderService, 
                          AuthService authService, 
                          VendorService vendorService,
                          PaymentService paymentService) {
        this.orderService = orderService;
        this.authService = authService;
        this.vendorService = vendorService;
        this.paymentService = paymentService;
    }

    // ============== CUSTOMER ENDPOINTS ==============

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCurrentUserOrders(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        List<Order> orders = orderService.getOrdersByUser(userId);
        
        List<Map<String, Object>> data = orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("status", order.getStatus());
            map.put("totalAmount", order.getTotalAmount());
            map.put("createdAt", order.getCreatedAt());
            
            // Map items for thumbnails
            List<Map<String, Object>> items = order.getItems().stream().map(item -> {
                Map<String, Object> itemMap = new HashMap<>();
                Map<String, Object> productMap = new HashMap<>();
                productMap.put("id", item.getProduct().getId());
                productMap.put("name", item.getProduct().getName());
                productMap.put("imageUrl", item.getProduct().getImageUrl());
                itemMap.put("product", productMap);
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("price", item.getPrice());
                return itemMap;
            }).toList();
            
            map.put("items", items);
            map.put("itemCount", items.size());
            return map;
        }).toList();
        
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody OrderRequest request) {
        Long userId = extractUserId(authHeader);
        request.setUserId(userId);
        Order createdOrder = orderService.createOrder(request);
        
        Map<String, Object> data = new HashMap<>();
        data.put("id", createdOrder.getId());
        data.put("status", createdOrder.getStatus());
        data.put("totalAmount", createdOrder.getTotalAmount());
        
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", data));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderById(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        
        Map<String, Object> orderMap = new HashMap<>();
        orderMap.put("id", order.getId());
        orderMap.put("status", order.getStatus());
        orderMap.put("totalAmount", order.getTotalAmount());
        orderMap.put("shippingAddress", order.getShippingAddress());
        orderMap.put("trackingNumber", order.getTrackingNumber());
        orderMap.put("estimatedDeliveryDate", order.getEstimatedDeliveryDate());
        orderMap.put("createdAt", order.getCreatedAt());
        
        // Map items
        List<Map<String, Object>> items = order.getItems().stream().map(item -> {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("productId", item.getProduct().getId());
            itemMap.put("productName", item.getProduct().getName());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("price", item.getPrice());
            itemMap.put("imageUrl", item.getProduct().getImageUrl());
            return itemMap;
        }).toList();
        orderMap.put("items", items);
        
        Map<String, Object> response = new HashMap<>();
        response.put("order", orderMap);
        
        try {
            Payment payment = paymentService.getPaymentByOrderId(orderId);
            Map<String, Object> paymentMap = new HashMap<>();
            paymentMap.put("id", payment.getId());
            paymentMap.put("status", payment.getStatus());
            paymentMap.put("amount", payment.getAmount());
            paymentMap.put("currency", payment.getCurrency());
            response.put("payment", paymentMap);
        } catch (Exception e) {
            response.put("payment", null);
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByUser(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<ApiResponse<List<OrderItem>>> getOrderItems(@PathVariable Long orderId) {
        List<OrderItem> items = orderService.getOrderItems(orderId);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully"));
    }

    // ============== VENDOR ENDPOINTS ==============

    @GetMapping("/vendor")
    public ResponseEntity<ApiResponse<List<Order>>> getVendorOrders(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        Vendor vendor = vendorService.getVendorByUserId(userId);
        List<Order> orders = vendorService.getVendorOrders(vendor.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    // ============== ADMIN ENDPOINTS ==============

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders(
            @RequestHeader("Authorization") String authHeader) {
        // Verify admin role
        verifyAdminRole(authHeader);
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/admin/paginated")
    public ResponseEntity<ApiResponse<Page<Order>>> getOrdersPaginated(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        verifyAdminRole(authHeader);
        Page<Order> orders = orderService.getOrdersPaginated(page, size);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/admin/filter")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersFiltered(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        verifyAdminRole(authHeader);
        
        List<Order> orders;
        
        if (status != null && startDate != null && endDate != null) {
            LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endDate).atTime(LocalTime.MAX);
            orders = orderService.getOrdersByStatusAndDateRange(status, start, end);
        } else if (status != null) {
            orders = orderService.getOrdersByStatus(status);
        } else if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endDate).atTime(LocalTime.MAX);
            orders = orderService.getOrdersByDateRange(start, end);
        } else {
            orders = orderService.getAllOrders();
        }
        
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/admin/statistics")
    public ResponseEntity<ApiResponse<OrderService.OrderStatistics>> getOrderStatistics(
            @RequestHeader("Authorization") String authHeader) {
        verifyAdminRole(authHeader);
        OrderService.OrderStatistics stats = orderService.getOrderStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status,
            @RequestHeader("Authorization") String authHeader) {
        
        String role = extractUserRole(authHeader);
        boolean isAuthorized = "admin".equalsIgnoreCase(role) || "vendor".equalsIgnoreCase(role);

        // Fallback: If role is not VENDOR (e.g. CUSTOMER), check if they have an approved vendor profile
        if (!isAuthorized) {
            try {
                Long userId = extractUserId(authHeader);
                Vendor vendor = vendorService.getVendorByUserId(userId);
                if (vendor != null && "approved".equalsIgnoreCase(vendor.getStatus())) {
                    isAuthorized = true;
                }
            } catch (Exception e) {
                // Ignore fallback error
            }
        }

        if (!isAuthorized) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Only admins and vendors can update order status"));
        }
        
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", updatedOrder));
    }

    // ============== HELPER METHODS ==============

    private Long extractUserId(String authHeader) {
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        return authService.findByEmail(email).getId();
    }

    private String extractUserRole(String authHeader) {
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        return authService.findByEmail(email).getRole();
    }

    private void verifyAdminRole(String authHeader) {
        String role = extractUserRole(authHeader);
        if (!"admin".equalsIgnoreCase(role)) {
            throw new SecurityException("Admin access required");
        }
    }
}