package com.cranberry.marketplace.dto;

import java.time.LocalDateTime;

public class OrderResponse {
    private Long orderId;
    private double totalAmount;
    private String status;
    private LocalDateTime createdAt;

    public OrderResponse(Long orderId, double totalAmount,
                         String status, LocalDateTime createdAt) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getOrderId() { return orderId; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}