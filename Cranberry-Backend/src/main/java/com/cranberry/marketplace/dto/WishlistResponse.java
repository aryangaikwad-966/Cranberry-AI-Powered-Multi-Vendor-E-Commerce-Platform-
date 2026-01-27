package com.cranberry.marketplace.dto;

import java.util.List;

public class WishlistResponse {
    private List<WishlistItemDto> items;

    public WishlistResponse() {
    }

    public WishlistResponse(List<WishlistItemDto> items) {
        this.items = items;
    }

    public List<WishlistItemDto> getItems() {
        return items;
    }

    public void setItems(List<WishlistItemDto> items) {
        this.items = items;
    }

    public static class WishlistItemDto {
        private Long id;
        private Long productId;
        private String name;
        private double price;
        private String imageUrl;
        private String vendorName;

        public WishlistItemDto() {
        }

        public WishlistItemDto(Long id, Long productId, String name, double price, String imageUrl, String vendorName) {
            this.id = id;
            this.productId = productId;
            this.name = name;
            this.price = price;
            this.imageUrl = imageUrl;
            this.vendorName = vendorName;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public String getVendorName() {
            return vendorName;
        }

        public void setVendorName(String vendorName) {
            this.vendorName = vendorName;
        }
    }
}
