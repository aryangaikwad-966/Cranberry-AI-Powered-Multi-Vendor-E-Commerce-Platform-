package com.cranberry.marketplace.ai;

import com.cranberry.marketplace.dto.AiRecommendationResponse;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {

    private final OrderRepository orderRepository;
    private final AiProviderClient aiClient;

    public RecommendationService(OrderRepository orderRepository,
                                 AiProviderClient aiClient) {
        this.orderRepository = orderRepository;
        this.aiClient = aiClient;
    }

    public AiRecommendationResponse recommendForUser(Long userId) {

        // Build prompt from user history
        List<Order> orders = orderRepository.findByUserId(userId);
        String prompt = "Recommend products based on past orders: " + orders.size();

        List<Long> productIds = aiClient.recommendProductIds(prompt);
        return new AiRecommendationResponse(productIds);
    }

    public String enhanceSearch(String query) {
        return aiClient.rewriteSearchQuery(query);
    }
}