package com.cranberry.marketplace.model;

/**
 * Order lifecycle status enum.
 * Flow: CREATED → PAYMENT_PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
 * Alternative: CANCELLED (can happen from CREATED or PAYMENT_PENDING)
 */
public enum OrderStatus {
    CREATED("Order Created"),
    PAYMENT_PENDING("Payment Pending"),
    PAID("Payment Successful"),
    PROCESSING("Order Processing"),
    SHIPPED("Order Shipped"),
    DELIVERED("Order Delivered"),
    CANCELLED("Order Cancelled");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Check if transition from current status to target status is valid
     * Note: ADMIN has full control - use forceTransitionAllowed() for admin operations
     */
    public boolean canTransitionTo(OrderStatus target) {
        return switch (this) {
            case CREATED -> target == PAYMENT_PENDING || target == PAID || target == CANCELLED;
            case PAYMENT_PENDING -> target == PAID || target == CANCELLED;
            case PAID -> target == PROCESSING || target == SHIPPED || target == DELIVERED || target == CANCELLED;
            case PROCESSING -> target == SHIPPED || target == DELIVERED;
            case SHIPPED -> target == DELIVERED;
            case DELIVERED, CANCELLED -> false; // Terminal states
        };
    }

    /**
     * Check if this status allows cancellation
     */
    public boolean isCancellable() {
        return this == CREATED || this == PAYMENT_PENDING;
    }

    /**
     * Check if this is a terminal state
     */
    public boolean isTerminal() {
        return this == DELIVERED || this == CANCELLED;
    }
}
