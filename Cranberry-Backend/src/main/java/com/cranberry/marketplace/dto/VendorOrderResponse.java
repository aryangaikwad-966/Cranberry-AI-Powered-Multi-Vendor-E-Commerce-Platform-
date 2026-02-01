package com.cranberry.marketplace.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for vendor-specific order view.
 * Shows only the items that belong to the specific vendor within an order.
 * This ensures vendors only see their own products when a customer buys from multiple vendors.
 */
public class VendorOrderResponse {

    private Long orderId;
    private String orderStatus;
    private LocalDateTime orderDate;
    private String trackingNumber;
    private LocalDateTime estimatedDeliveryDate;
    
    // Vendor-specific amounts (only their products)
    private double vendorSubtotal;
    
    // Items belonging to this vendor only
    private List<VendorOrderItemResponse> items;
    
    // Customer info (limited - no address for FBA model)
    private String customerName;

    public VendorOrderResponse() {}

    public VendorOrderResponse(Long orderId, String orderStatus, LocalDateTime orderDate,
                               String trackingNumber, LocalDateTime estimatedDeliveryDate,
                               double vendorSubtotal, List<VendorOrderItemResponse> items,
                               String customerName) {
        this.orderId = orderId;
        this.orderStatus = orderStatus;
        this.orderDate = orderDate;
        this.trackingNumber = trackingNumber;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.vendorSubtotal = vendorSubtotal;
        this.items = items;
        this.customerName = customerName;
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public LocalDateTime getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }

    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) {
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    public double getVendorSubtotal() {
        return vendorSubtotal;
    }

    public void setVendorSubtotal(double vendorSubtotal) {
        this.vendorSubtotal = vendorSubtotal;
    }

    public List<VendorOrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<VendorOrderItemResponse> items) {
        this.items = items;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    /**
     * Inner class for vendor-specific order item details
     */
    public static class VendorOrderItemResponse {
        private Long itemId;
        private Long productId;
        private String productName;
        private String productImage;
        private int quantity;
        private double unitPrice;
        private double totalPrice;
        private String itemStatus; // Item-level status for multi-vendor tracking

        public VendorOrderItemResponse() {}

        public VendorOrderItemResponse(Long itemId, Long productId, String productName,
                                       String productImage, int quantity, double unitPrice,
                                       double totalPrice, String itemStatus) {
            this.itemId = itemId;
            this.productId = productId;
            this.productName = productName;
            this.productImage = productImage;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.totalPrice = totalPrice;
            this.itemStatus = itemStatus;
        }

        // Getters and Setters
        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public String getProductImage() {
            return productImage;
        }

        public void setProductImage(String productImage) {
            this.productImage = productImage;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public double getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(double unitPrice) {
            this.unitPrice = unitPrice;
        }

        public double getTotalPrice() {
            return totalPrice;
        }

        public void setTotalPrice(double totalPrice) {
            this.totalPrice = totalPrice;
        }
        
        public String getItemStatus() {
            return itemStatus;
        }

        public void setItemStatus(String itemStatus) {
            this.itemStatus = itemStatus;
        }
    }
}
