package com.cranberry.marketplace.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cranberry.marketplace.dto.VendorDashboardResponse;
import com.cranberry.marketplace.dto.VendorOrderResponse;
import com.cranberry.marketplace.dto.VendorOrderResponse.VendorOrderItemResponse;
import com.cranberry.marketplace.dto.VendorRequest;
import com.cranberry.marketplace.exception.BadRequestException;
import com.cranberry.marketplace.exception.ResourceNotFoundException;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.OrderItem;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.repository.OrderItemRepository;
import com.cranberry.marketplace.repository.OrderRepository;
import com.cranberry.marketplace.repository.ProductRepository;
import com.cranberry.marketplace.repository.UserRepository;
import com.cranberry.marketplace.repository.VendorRepository;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public VendorService(VendorRepository vendorRepository, UserRepository userRepository,
                         ProductRepository productRepository, OrderRepository orderRepository,
                         OrderItemRepository orderItemRepository) {
        this.vendorRepository = vendorRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public Vendor createVendor(VendorRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Check if vendor already exists for this user
        if (vendorRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new BadRequestException("Vendor already exists for this user");
        }

        Vendor vendor = new Vendor();
        vendor.setShopName(request.getShopName());
        vendor.setContactEmail(request.getContactEmail());
        vendor.setContactPhone(request.getContactPhone());
        vendor.setAddress(request.getAddress());
        vendor.setLogo(request.getLogo());
        vendor.setUser(user);
        vendor.setStatus("PENDING");  // Changed to uppercase for consistency

        // Save vendor first
        Vendor savedVendor = vendorRepository.save(vendor);

        // Keep user role as CUSTOMER until admin approves
        // Role will be changed to VENDOR when admin approves the vendor
        user.setVendor(savedVendor);
        userRepository.save(user);
        return savedVendor;
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
    }

    public Vendor getVendorByUserId(Long userId) {
        return vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found for user: " + userId));
    }

    @Transactional
    public Vendor updateVendor(Long id, VendorRequest request) {
        Vendor vendor = getVendorById(id);

        if (request.getShopName() != null) {
            vendor.setShopName(request.getShopName());
        }
        if (request.getContactEmail() != null) {
            vendor.setContactEmail(request.getContactEmail());
        }
        if (request.getContactPhone() != null) {
            vendor.setContactPhone(request.getContactPhone());
        }
        if (request.getAddress() != null) {
            vendor.setAddress(request.getAddress());
        }

        return vendorRepository.save(vendor);
    }

    @Transactional
    public Vendor updateVendorStatus(Long id, String status) {
        Vendor vendor = getVendorById(id);
        vendor.setStatus(status);
        return vendorRepository.save(vendor);
    }

    public VendorDashboardResponse getDashboard(Long vendorId) {
        Vendor vendor = getVendorById(vendorId);

        List<Product> products = productRepository.findByVendorId(vendorId);
        int totalProducts = products.size();

        List<Order> orders = orderRepository.findByVendorId(vendorId);
        int totalOrders = orders.size();

        double totalRevenue = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .filter(item -> item.getProduct() != null 
                        && item.getProduct().getVendor() != null
                        && item.getProduct().getVendor().getId().equals(vendorId))
                .mapToDouble(item -> item.getPrice())
                .sum();

        int pendingOrders = (int) orders.stream()
                .filter(o -> "PENDING".equals(o.getStatus()) || "CREATED".equals(o.getStatus()))
                .count();

        return new VendorDashboardResponse(totalProducts, totalOrders, totalRevenue, pendingOrders, vendor.getStatus());
    }

    public List<Product> getVendorProducts(Long vendorId) {
        return productRepository.findByVendorId(vendorId);
    }

    public List<Order> getVendorOrders(Long vendorId) {
        return orderRepository.findByVendorId(vendorId);
    }

    /**
     * Get vendor-specific order views where each order only contains
     * items belonging to the specified vendor.
     * 
     * When a customer buys products from multiple vendors in a single order,
     * each vendor will only see their own products within that order.
     * 
     * @param vendorId The vendor's ID
     * @return List of VendorOrderResponse with filtered items
     */
    @Transactional(readOnly = true)
    public List<VendorOrderResponse> getVendorOrdersFiltered(Long vendorId) {
        // Get all orders containing this vendor's products
        List<Order> orders = orderRepository.findByVendorId(vendorId);
        
        List<VendorOrderResponse> vendorOrders = new ArrayList<>();
        
        for (Order order : orders) {
            // Filter items to only include this vendor's products
            List<VendorOrderItemResponse> vendorItems = order.getItems().stream()
                .filter(item -> item.getProduct() != null 
                        && item.getProduct().getVendor() != null
                        && item.getProduct().getVendor().getId().equals(vendorId))
                .map(item -> new VendorOrderItemResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getProduct().getImageUrl(),
                    item.getQuantity(),
                    item.getProduct().getPrice(),
                    item.getPrice(),
                    item.getStatus() != null ? item.getStatus() : "PENDING"
                ))
                .collect(Collectors.toList());
            
            // Only include order if vendor has items in it
            if (!vendorItems.isEmpty()) {
                // Calculate vendor's subtotal for this order
                double vendorSubtotal = vendorItems.stream()
                    .mapToDouble(VendorOrderItemResponse::getTotalPrice)
                    .sum();
                
                // Get customer name (but not address - FBA model)
                String customerName = order.getUser() != null ? order.getUser().getName() : "Customer";
                
                VendorOrderResponse vendorOrder = new VendorOrderResponse(
                    order.getId(),
                    order.getStatus(),
                    order.getCreatedAt(),
                    order.getTrackingNumber(),
                    order.getEstimatedDeliveryDate(),
                    vendorSubtotal,
                    vendorItems,
                    customerName
                );
                
                vendorOrders.add(vendorOrder);
            }
        }
        
        return vendorOrders;
    }

    /**
     * Update item status by vendor (item-level status tracking).
     * Each vendor can only update the status of their own items in an order.
     * 
     * @param vendorId The vendor's ID
     * @param itemId The order item ID to update
     * @param newStatus The new status (PROCESSING, SHIPPED, DELIVERED)
     * @return Updated VendorOrderItemResponse
     */
    @Transactional
    public VendorOrderItemResponse updateItemStatus(Long vendorId, Long itemId, String newStatus) {
        // Validate the new status
        List<String> allowedStatuses = List.of("PROCESSING", "SHIPPED", "DELIVERED");
        if (!allowedStatuses.contains(newStatus)) {
            throw new BadRequestException("Invalid status. Allowed values: PROCESSING, SHIPPED, DELIVERED");
        }

        // Find the order item
        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found with id: " + itemId));

        // Verify this item belongs to the vendor
        if (item.getProduct() == null || item.getProduct().getVendor() == null 
                || !item.getProduct().getVendor().getId().equals(vendorId)) {
            throw new BadRequestException("You don't own this product");
        }

        // Validate status transition
        String currentStatus = item.getStatus() != null ? item.getStatus() : "PENDING";
        if (!isValidItemStatusTransition(currentStatus, newStatus)) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        // Update the item status
        item.setStatus(newStatus);
        orderItemRepository.save(item);

        // Also check if all items in the order are delivered - update order status
        updateOrderStatusBasedOnItems(item.getOrder());

        return new VendorOrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                item.getQuantity(),
                item.getProduct().getPrice(),
                item.getPrice(),
                item.getStatus()
        );
    }

    /**
     * Update overall order status based on item statuses.
     * Order is DELIVERED only when all items are delivered.
     */
    private void updateOrderStatusBasedOnItems(Order order) {
        List<OrderItem> items = order.getItems();
        
        boolean allDelivered = items.stream()
                .allMatch(item -> "DELIVERED".equals(item.getStatus()));
        
        boolean allShipped = items.stream()
                .allMatch(item -> "SHIPPED".equals(item.getStatus()) || "DELIVERED".equals(item.getStatus()));
        
        boolean anyProcessing = items.stream()
                .anyMatch(item -> "PROCESSING".equals(item.getStatus()) 
                        || "SHIPPED".equals(item.getStatus()) 
                        || "DELIVERED".equals(item.getStatus()));

        if (allDelivered) {
            order.setStatus("DELIVERED");
        } else if (allShipped) {
            order.setStatus("SHIPPED");
        } else if (anyProcessing && "PAID".equals(order.getStatus())) {
            order.setStatus("PROCESSING");
        }
        
        orderRepository.save(order);
    }

    /**
     * Validate if the item status transition is allowed
     */
    private boolean isValidItemStatusTransition(String currentStatus, String newStatus) {
        switch (currentStatus) {
            case "PENDING":
                return "PROCESSING".equals(newStatus);
            case "PROCESSING":
                return "SHIPPED".equals(newStatus);
            case "SHIPPED":
                return "DELIVERED".equals(newStatus);
            default:
                return "PROCESSING".equals(newStatus);
        }
    }

    /**
     * @deprecated Use updateItemStatus instead for item-level status tracking
     */
    @Deprecated
    @Transactional
    public VendorOrderResponse updateOrderStatus(Long vendorId, Long orderId, String newStatus) {
        // Validate the new status - vendors can only set these statuses
        List<String> allowedStatuses = List.of("PROCESSING", "SHIPPED", "DELIVERED");
        if (!allowedStatuses.contains(newStatus)) {
            throw new BadRequestException("Invalid status. Allowed values: PROCESSING, SHIPPED, DELIVERED");
        }

        // Find the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // Verify this vendor has products in the order
        boolean hasVendorProducts = order.getItems().stream()
                .anyMatch(item -> item.getProduct() != null 
                        && item.getProduct().getVendor() != null
                        && item.getProduct().getVendor().getId().equals(vendorId));

        if (!hasVendorProducts) {
            throw new BadRequestException("You don't have any products in this order");
        }

        // Validate status transition
        String currentStatus = order.getStatus();
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        // Update the order status
        order.setStatus(newStatus);
        orderRepository.save(order);

        // Return the updated vendor-specific order view
        List<VendorOrderResponse.VendorOrderItemResponse> vendorItems = order.getItems().stream()
                .filter(item -> item.getProduct() != null 
                        && item.getProduct().getVendor() != null
                        && item.getProduct().getVendor().getId().equals(vendorId))
                .map(item -> new VendorOrderResponse.VendorOrderItemResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getProduct().getImageUrl(),
                    item.getQuantity(),
                    item.getProduct().getPrice(),
                    item.getPrice(),
                    item.getStatus() != null ? item.getStatus() : "PENDING"
                ))
                .collect(Collectors.toList());

        double vendorSubtotal = vendorItems.stream()
                .mapToDouble(VendorOrderResponse.VendorOrderItemResponse::getTotalPrice)
                .sum();

        String customerName = order.getUser() != null ? order.getUser().getName() : "Customer";

        return new VendorOrderResponse(
                order.getId(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getTrackingNumber(),
                order.getEstimatedDeliveryDate(),
                vendorSubtotal,
                vendorItems,
                customerName
        );
    }

    /**
     * Validate if the status transition is allowed
     */
    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        // Define valid transitions
        switch (currentStatus) {
            case "PAID":
                return "PROCESSING".equals(newStatus);
            case "PROCESSING":
                return "SHIPPED".equals(newStatus);
            case "SHIPPED":
                return "DELIVERED".equals(newStatus);
            default:
                // Allow any transition from CREATED or PENDING if payment is confirmed
                return true;
        }
    }
}