package com.cranberry.marketplace.service;

import com.cranberry.marketplace.dto.OrderRequest;
import com.cranberry.marketplace.exception.BadRequestException;
import com.cranberry.marketplace.exception.ResourceNotFoundException;
import com.cranberry.marketplace.model.*;
import com.cranberry.marketplace.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CREATED.name());
        order.setShippingAddress(request.getShippingAddress());

        double totalAmount = 0;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName() + 
                    ". Available: " + product.getStock() + ", Requested: " + itemRequest.getQuantity());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice() * itemRequest.getQuantity());

            order.addItem(orderItem);
            totalAmount += orderItem.getPrice();

            // Reduce stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Clear user's cart after order creation
        cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        // Force initialization of items
        order.getItems().size();
        return order;
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        // Force initialization of items for each order
        orders.forEach(order -> order.getItems().size());
        return orders;
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    // ============== ADMIN METHODS ==============

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        orders.forEach(order -> order.getItems().size());
        return orders;
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByDateRange(startDate, endDate);
    }

    public List<Order> getOrdersByStatusAndDateRange(String status, LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByStatusAndDateRange(status, startDate, endDate);
    }

    public Page<Order> getOrdersPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<Order> getOrdersByStatusPaginated(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = getOrderById(orderId);
        String currentStatus = order.getStatus();

        // Validate status transition
        try {
            OrderStatus current = OrderStatus.valueOf(currentStatus);
            OrderStatus target = OrderStatus.valueOf(newStatus);

            if (!current.canTransitionTo(target)) {
                throw new BadRequestException(
                    String.format("Invalid status transition from %s to %s", currentStatus, newStatus));
            }
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + newStatus);
        }

        if (OrderStatus.SHIPPED.name().equals(newStatus)) {
            if (order.getTrackingNumber() == null) {
                order.setTrackingNumber("CRB" + System.currentTimeMillis() + (int)(Math.random() * 1000));
                order.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(3 + (int)(Math.random() * 5)));
            }
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);

        try {
            OrderStatus status = OrderStatus.valueOf(order.getStatus());
            if (!status.isCancellable()) {
                throw new BadRequestException(
                    "Cannot cancel order with status: " + order.getStatus() + 
                    ". Only orders with status CREATED or PAYMENT_PENDING can be cancelled.");
            }
        } catch (IllegalArgumentException e) {
            // Legacy status handling
            if ("PAID".equals(order.getStatus()) || "SHIPPED".equals(order.getStatus()) || 
                "DELIVERED".equals(order.getStatus())) {
                throw new BadRequestException("Cannot cancel order that is already " + order.getStatus().toLowerCase());
            }
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED.name());
        orderRepository.save(order);
    }

    // Statistics for admin dashboard
    public OrderStatistics getOrderStatistics() {
        OrderStatistics stats = new OrderStatistics();
        
        stats.setTotalOrders(orderRepository.count());
        stats.setPendingOrders(orderRepository.countByStatus(OrderStatus.CREATED.name()) + 
                              orderRepository.countByStatus(OrderStatus.PAYMENT_PENDING.name()));
        stats.setPaidOrders(orderRepository.countByStatus(OrderStatus.PAID.name()));
        stats.setProcessingOrders(orderRepository.countByStatus(OrderStatus.PROCESSING.name()));
        stats.setShippedOrders(orderRepository.countByStatus(OrderStatus.SHIPPED.name()));
        stats.setDeliveredOrders(orderRepository.countByStatus(OrderStatus.DELIVERED.name()));
        stats.setCancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED.name()));
        
        Double totalRevenue = orderRepository.getTotalRevenue();
        stats.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        
        // Last 30 days stats
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        stats.setOrdersLast30Days(orderRepository.countOrdersSince(thirtyDaysAgo));
        Double revenueLast30Days = orderRepository.getRevenueSince(thirtyDaysAgo);
        stats.setRevenueLast30Days(revenueLast30Days != null ? revenueLast30Days : 0.0);
        
        return stats;
    }

    // Inner class for statistics
    public static class OrderStatistics {
        private long totalOrders;
        private long pendingOrders;
        private long paidOrders;
        private long processingOrders;
        private long shippedOrders;
        private long deliveredOrders;
        private long cancelledOrders;
        private double totalRevenue;
        private long ordersLast30Days;
        private double revenueLast30Days;

        // Getters and Setters
        public long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
        
        public long getPendingOrders() { return pendingOrders; }
        public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }
        
        public long getPaidOrders() { return paidOrders; }
        public void setPaidOrders(long paidOrders) { this.paidOrders = paidOrders; }
        
        public long getProcessingOrders() { return processingOrders; }
        public void setProcessingOrders(long processingOrders) { this.processingOrders = processingOrders; }
        
        public long getShippedOrders() { return shippedOrders; }
        public void setShippedOrders(long shippedOrders) { this.shippedOrders = shippedOrders; }
        
        public long getDeliveredOrders() { return deliveredOrders; }
        public void setDeliveredOrders(long deliveredOrders) { this.deliveredOrders = deliveredOrders; }
        
        public long getCancelledOrders() { return cancelledOrders; }
        public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }
        
        public double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
        
        public long getOrdersLast30Days() { return ordersLast30Days; }
        public void setOrdersLast30Days(long ordersLast30Days) { this.ordersLast30Days = ordersLast30Days; }
        
        public double getRevenueLast30Days() { return revenueLast30Days; }
        public void setRevenueLast30Days(double revenueLast30Days) { this.revenueLast30Days = revenueLast30Days; }
    }
}