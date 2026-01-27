package com.cranberry.marketplace.dto;

public class AiPriceSuggestRequest {
    private String productName;
    private String category;
    private String description;
    private Double intendedPrice;

    public AiPriceSuggestRequest() {
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getIntendedPrice() {
        return intendedPrice;
    }

    public void setIntendedPrice(Double intendedPrice) {
        this.intendedPrice = intendedPrice;
    }
}
