package com.cranberry.marketplace.dto;

import java.util.List;

public class AiRecommendationResponse {
    private List<Long> productIds;
    private List<ProductResponse> products;
    private String recommendationType;
    private String reason;

    public AiRecommendationResponse() {
    }

    public AiRecommendationResponse(List<Long> productIds) {
        this.productIds = productIds;
    }

    public AiRecommendationResponse(List<Long> productIds, List<ProductResponse> products, String recommendationType, String reason) {
        this.productIds = productIds;
        this.products = products;
        this.recommendationType = recommendationType;
        this.reason = reason;
    }

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public List<ProductResponse> getProducts() {
        return products;
    }

    public void setProducts(List<ProductResponse> products) {
        this.products = products;
    }

    public String getRecommendationType() {
        return recommendationType;
    }

    public void setRecommendationType(String recommendationType) {
        this.recommendationType = recommendationType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private List<Long> productIds;
        private List<ProductResponse> products;
        private String recommendationType;
        private String reason;

        public Builder productIds(List<Long> productIds) {
            this.productIds = productIds;
            return this;
        }

        public Builder products(List<ProductResponse> products) {
            this.products = products;
            return this;
        }

        public Builder recommendationType(String recommendationType) {
            this.recommendationType = recommendationType;
            return this;
        }

        public Builder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public AiRecommendationResponse build() {
            AiRecommendationResponse response = new AiRecommendationResponse();
            response.productIds = this.productIds;
            response.products = this.products;
            response.recommendationType = this.recommendationType;
            response.reason = this.reason;
            return response;
        }
    }
}