package com.cranberry.marketplace.dto;

public class AiRecommendRequest {
    private Long userId;
    private Long productId;
    private String type; // "similar" or "personalized"

    public AiRecommendRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
