package com.cranberry.marketplace.dto;

import java.util.List;

public class AiSearchResponse {
    private List<ProductResponse> products;
    private int totalResults;
    private String topCategory;
    private Double minPrice;
    private Double maxPrice;
    private String searchInsight;

    public AiSearchResponse() {
    }

    public List<ProductResponse> getProducts() {
        return products;
    }

    public void setProducts(List<ProductResponse> products) {
        this.products = products;
    }

    public int getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(int totalResults) {
        this.totalResults = totalResults;
    }

    public String getTopCategory() {
        return topCategory;
    }

    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }

    public Double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getSearchInsight() {
        return searchInsight;
    }

    public void setSearchInsight(String searchInsight) {
        this.searchInsight = searchInsight;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private List<ProductResponse> products;
        private int totalResults;
        private String topCategory;
        private Double minPrice;
        private Double maxPrice;
        private String searchInsight;

        public Builder products(List<ProductResponse> products) {
            this.products = products;
            return this;
        }

        public Builder totalResults(int totalResults) {
            this.totalResults = totalResults;
            return this;
        }

        public Builder topCategory(String topCategory) {
            this.topCategory = topCategory;
            return this;
        }

        public Builder minPrice(Double minPrice) {
            this.minPrice = minPrice;
            return this;
        }

        public Builder maxPrice(Double maxPrice) {
            this.maxPrice = maxPrice;
            return this;
        }

        public Builder searchInsight(String searchInsight) {
            this.searchInsight = searchInsight;
            return this;
        }

        public AiSearchResponse build() {
            AiSearchResponse response = new AiSearchResponse();
            response.products = this.products;
            response.totalResults = this.totalResults;
            response.topCategory = this.topCategory;
            response.minPrice = this.minPrice;
            response.maxPrice = this.maxPrice;
            response.searchInsight = this.searchInsight;
            return response;
        }
    }
}
