package com.cranberry.marketplace.dto;

import java.time.LocalDateTime;

public class VendorResponse {
    private Long id;
    private String name;
    private String email;
    private String logo;
    private int productCount;
    private Double rating;
    private String status;
    private LocalDateTime joinedAt;

    public VendorResponse(Long id, String name, String email, String logo, int productCount, Double rating, String status, LocalDateTime joinedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.logo = logo;
        this.productCount = productCount;
        this.rating = rating;
        this.status = status;
        this.joinedAt = joinedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public int getProductCount() {
        return productCount;
    }

    public void setProductCount(int productCount) {
        this.productCount = productCount;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
