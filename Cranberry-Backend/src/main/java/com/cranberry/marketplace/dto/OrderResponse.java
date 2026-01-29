package com.cranberry.marketplace.dto;

import java.time.LocalDateTime;

public class OrderResponse {
    private Long orderId;
    private double totalAmount;
    private String status;
    private String trackingNumber;
    private LocalDateTime estimatedDeliveryDate;
    private LocalDateTime createdAt;

    public OrderResponse(Long orderId, double totalAmount,
                         String status, String trackingNumber,
                         LocalDateTime estimatedDeliveryDate,
                         LocalDateTime createdAt) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.trackingNumber = trackingNumber;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.createdAt = createdAt;
    }

    public Long getOrderId() { return orderId; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public String getTrackingNumber() { return trackingNumber; }
    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}