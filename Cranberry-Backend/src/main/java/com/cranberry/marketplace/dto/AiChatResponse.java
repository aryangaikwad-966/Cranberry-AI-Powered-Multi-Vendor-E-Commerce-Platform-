package com.cranberry.marketplace.dto;

import java.util.List;

public class AiChatResponse {
    private String reply;
    private String intent;
    private List<ProductResponse> suggestedProducts;
    private String orderTrackingInfo;

    public AiChatResponse() {
    }

    public AiChatResponse(String reply) {
        this.reply = reply;
    }

    public AiChatResponse(String reply, String intent) {
        this.reply = reply;
        this.intent = intent;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public List<ProductResponse> getSuggestedProducts() {
        return suggestedProducts;
    }

    public void setSuggestedProducts(List<ProductResponse> suggestedProducts) {
        this.suggestedProducts = suggestedProducts;
    }

    public String getOrderTrackingInfo() {
        return orderTrackingInfo;
    }

    public void setOrderTrackingInfo(String orderTrackingInfo) {
        this.orderTrackingInfo = orderTrackingInfo;
    }

    // Builder pattern for convenience
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String reply;
        private String intent;
        private List<ProductResponse> suggestedProducts;
        private String orderTrackingInfo;

        public Builder reply(String reply) {
            this.reply = reply;
            return this;
        }

        public Builder intent(String intent) {
            this.intent = intent;
            return this;
        }

        public Builder suggestedProducts(List<ProductResponse> suggestedProducts) {
            this.suggestedProducts = suggestedProducts;
            return this;
        }

        public Builder orderTrackingInfo(String orderTrackingInfo) {
            this.orderTrackingInfo = orderTrackingInfo;
            return this;
        }

        public AiChatResponse build() {
            AiChatResponse response = new AiChatResponse();
            response.reply = this.reply;
            response.intent = this.intent;
            response.suggestedProducts = this.suggestedProducts;
            response.orderTrackingInfo = this.orderTrackingInfo;
            return response;
        }
    }
}
