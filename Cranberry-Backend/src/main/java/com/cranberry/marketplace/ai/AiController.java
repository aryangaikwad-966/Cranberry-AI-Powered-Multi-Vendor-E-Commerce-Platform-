package com.cranberry.marketplace.ai;

import com.cranberry.marketplace.dto.*;
import com.cranberry.marketplace.security.JwtUtil;
import com.cranberry.marketplace.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiProviderClient aiProviderClient;
    private final AiService aiService;
    private final OrderInsightsService orderInsightsService;
    private final AuthService authService;

    public AiController(AiProviderClient aiProviderClient,
                        AiService aiService,
                        OrderInsightsService orderInsightsService,
                        AuthService authService) {
        this.aiProviderClient = aiProviderClient;
        this.aiService = aiService;
        this.orderInsightsService = orderInsightsService;
        this.authService = authService;
    }

    /**
     * AI Chat endpoint - for the chatbot
     * POST /api/ai/chat
     */
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@RequestBody AiChatRequest request) {
        AiChatResponse response = aiService.chat(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * AI Search endpoint - semantic search for products
     * POST /api/ai/search
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<AiSearchResponse>> search(@RequestBody AiSearchRequest request) {
        AiSearchResponse response = aiService.search(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * AI Recommend endpoint - product recommendations
     * POST /api/ai/recommend
     */
    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<AiRecommendationResponse>> recommend(@RequestBody AiRecommendRequest request) {
        AiRecommendationResponse response = aiService.recommend(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Get recommendations by user ID (legacy endpoint)
     * GET /api/ai/recommend/{userId}
     */
    @GetMapping("/recommend/{userId}")
    public ResponseEntity<ApiResponse<AiRecommendationResponse>> recommendByUser(@PathVariable Long userId) {
        AiRecommendRequest request = new AiRecommendRequest();
        request.setUserId(userId);
        request.setType("personalized");
        AiRecommendationResponse response = aiService.recommend(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * AI Price Suggestion endpoint - for vendors
     * POST /api/ai/price-suggest
     */
    @PostMapping("/price-suggest")
    public ResponseEntity<ApiResponse<AiPriceSuggestResponse>> suggestPrice(@RequestBody AiPriceSuggestRequest request) {
        AiPriceSuggestResponse response = aiService.suggestPrice(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * AI Order Insights - Admin Analytics
     * GET /api/ai/admin/order-insights
     */
    @GetMapping("/admin/order-insights")
    public ResponseEntity<ApiResponse<OrderInsightsService.OrderInsightsResponse>> getOrderInsights(
            @RequestHeader("Authorization") String authHeader) {
        // Verify admin role
        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        String role = authService.findByEmail(email).getRole();
        
        if (!"admin".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Admin access required for order insights"));
        }
        
        OrderInsightsService.OrderInsightsResponse insights = orderInsightsService.generateInsights();
        return ResponseEntity.ok(ApiResponse.success("AI insights generated", insights));
    }

    /**
     * Health check endpoint
     * GET /api/ai/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        boolean isAvailable = aiProviderClient.isOllamaAvailable();
        Map<String, Object> health = Map.of(
            "ollama_available", isAvailable,
            "status", isAvailable ? "healthy" : "unavailable",
            "message", isAvailable ? "Ollama is running and accessible" : "Ollama is not available. Please ensure Ollama is installed and running on port 11434."
        );
        return ResponseEntity.ok(ApiResponse.success(health));
    }
}
