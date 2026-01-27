package com.cranberry.marketplace.dto;

import java.util.List;

public class AiPriceSuggestResponse {
    private Double recommendedPrice;
    private Double minPrice;
    private Double maxPrice;
    private int confidenceScore;
    private MarketAnalysis marketAnalysis;
    private List<String> pricingInsights;

    public AiPriceSuggestResponse() {
    }

    public Double getRecommendedPrice() {
        return recommendedPrice;
    }

    public void setRecommendedPrice(Double recommendedPrice) {
        this.recommendedPrice = recommendedPrice;
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

    public int getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(int confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public MarketAnalysis getMarketAnalysis() {
        return marketAnalysis;
    }

    public void setMarketAnalysis(MarketAnalysis marketAnalysis) {
        this.marketAnalysis = marketAnalysis;
    }

    public List<String> getPricingInsights() {
        return pricingInsights;
    }

    public void setPricingInsights(List<String> pricingInsights) {
        this.pricingInsights = pricingInsights;
    }

    public static class MarketAnalysis {
        private Double averageMarketPrice;
        private int productsAnalyzed;
        private String marketPosition; // PREMIUM, COMPETITIVE, BUDGET

        public MarketAnalysis() {
        }

        public Double getAverageMarketPrice() {
            return averageMarketPrice;
        }

        public void setAverageMarketPrice(Double averageMarketPrice) {
            this.averageMarketPrice = averageMarketPrice;
        }

        public int getProductsAnalyzed() {
            return productsAnalyzed;
        }

        public void setProductsAnalyzed(int productsAnalyzed) {
            this.productsAnalyzed = productsAnalyzed;
        }

        public String getMarketPosition() {
            return marketPosition;
        }

        public void setMarketPosition(String marketPosition) {
            this.marketPosition = marketPosition;
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Double recommendedPrice;
        private Double minPrice;
        private Double maxPrice;
        private int confidenceScore;
        private MarketAnalysis marketAnalysis;
        private List<String> pricingInsights;

        public Builder recommendedPrice(Double recommendedPrice) {
            this.recommendedPrice = recommendedPrice;
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

        public Builder confidenceScore(int confidenceScore) {
            this.confidenceScore = confidenceScore;
            return this;
        }

        public Builder marketAnalysis(MarketAnalysis marketAnalysis) {
            this.marketAnalysis = marketAnalysis;
            return this;
        }

        public Builder pricingInsights(List<String> pricingInsights) {
            this.pricingInsights = pricingInsights;
            return this;
        }

        public AiPriceSuggestResponse build() {
            AiPriceSuggestResponse response = new AiPriceSuggestResponse();
            response.recommendedPrice = this.recommendedPrice;
            response.minPrice = this.minPrice;
            response.maxPrice = this.maxPrice;
            response.confidenceScore = this.confidenceScore;
            response.marketAnalysis = this.marketAnalysis;
            response.pricingInsights = this.pricingInsights;
            return response;
        }
    }
}
