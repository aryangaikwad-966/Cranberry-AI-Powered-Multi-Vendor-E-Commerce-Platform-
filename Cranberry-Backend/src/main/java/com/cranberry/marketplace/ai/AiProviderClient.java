package com.cranberry.marketplace.ai;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.cranberry.marketplace.config.OllamaConfig;

@Component
public class AiProviderClient {

    private static final Logger logger = LoggerFactory.getLogger(AiProviderClient.class);

    private final WebClient webClient;
    private final OllamaConfig ollamaConfig;

    @Value("${ai.ollama.model:gemma3:4b}")
    private String model;

    public AiProviderClient(WebClient ollamaWebClient, OllamaConfig ollamaConfig) {
        this.webClient = ollamaWebClient;
        this.ollamaConfig = ollamaConfig;
    }

    /**
     * Call Ollama API to get product recommendations based on user history
     */
    public List<Long> recommendProductIds(String prompt) {
        try {
            String fullPrompt = "Based on the following user information, recommend product IDs (return only comma-separated numbers, no other text): " + prompt;

            String response = callOllama(fullPrompt);

            // Extract numbers from response
            return extractProductIds(response);
        } catch (Exception e) {
            logger.error("Error calling Ollama for recommendations", e);
            // Fallback to default recommendations
            return List.of(1L, 2L, 3L);
        }
    }

    /**
     * Enhance search query using Ollama
     */
    public String rewriteSearchQuery(String query) {
        try {
            String prompt = "Improve this product search query for better results. Return only the improved query without explanations: " + query;

            String response = callOllama(prompt);

            return response.trim().isEmpty() ? query : response.trim();
        } catch (Exception e) {
            logger.error("Error enhancing search query", e);
            return query;
        }
    }

    /**
     * Generate a general AI response for chat
     */
    /**
     * Generate a chat response using Ollama's /api/chat endpoint
     */
    public String generateChatResponse(List<Map<String, String>> messages) {
        Map<String, Object> requestBody = Map.of(
            "model", model,
            "messages", messages,
            "stream", false
        );

        try {
            Map response = webClient.post()
                .uri("/api/chat")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(ollamaConfig.getTimeout())
                .block();
            
            if (response != null && response.containsKey("message")) {
                Map<String, Object> message = (Map<String, Object>) response.get("message");
                if (message != null && message.containsKey("content")) {
                    return message.get("content").toString().trim();
                }
            }
            return "I'm sorry, I couldn't understand that.";
        } catch (Exception e) {
            logger.error("Error calling Ollama Chat API: {}", e.getMessage());
            // Fallback to simulated response
            return simulateResponse(messages);
        }
    }

    /**
     * Generate a generic AI response (Legacy/Single prompt)
     */
    public String generateResponse(String prompt) {
        return callOllama(prompt);
    }

    /**
     * Generic method to call Ollama API (legacy /api/generate)
     */
    private String callOllama(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "model", model,
            "prompt", prompt,
            "stream", false
        );

        try {
            Map response = webClient.post()
                .uri("/api/generate")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(ollamaConfig.getTimeout())
                .block();
            
            if (response != null && response.get("response") != null) {
                return response.get("response").toString().trim();
            }
            return "";
        } catch (Exception e) {
            logger.error("Error calling Ollama API: {}", e.getMessage());
            return "Here are some product recommendations based on your request: Electronics, Fashion, and Home Decor items are trending now.";
        }
    }

    private String simulateResponse(List<Map<String, String>> messages) {
        String lastUserMessage = "";
        for (int i = messages.size() - 1; i >= 0; i--) {
            if ("user".equals(messages.get(i).get("role"))) {
                lastUserMessage = messages.get(i).get("content").toLowerCase();
                break;
            }
        }

        if (lastUserMessage.contains("laptop") || lastUserMessage.contains("computer")) {
            return "We have some great laptops available! Check out the MacBook Pro and Dell XPS in our Electronics section. They offer great performance for work and creativity.";
        } else if (lastUserMessage.contains("phone") || lastUserMessage.contains("mobile")) {
            return "For smartphones, I recommend the iPhone 15 or the latest Samsung Galaxy. Both match your preference for high-quality cameras and battery life.";
        } else if (lastUserMessage.contains("hello") || lastUserMessage.contains("hi")) {
            return "Hello! I'm your Cranberry AI assistant. How can I help you find the perfect product today?";
        } else if (lastUserMessage.contains("track") || lastUserMessage.contains("order")) {
            return "You can track your orders in the 'My Orders' section. If you have a specific order ID, I can help you check its status.";
        } else {
            return "That sounds interesting! We have a wide range of products that might fit what you're looking for. Could you be more specific about the category or price range?";
        }
    }

    /**
     * Extract product IDs from AI response
     */
    private List<Long> extractProductIds(String response) {
        List<Long> productIds = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(response);

        while (matcher.find() && productIds.size() < 10) {
            try {
                productIds.add(Long.valueOf(matcher.group()));
            } catch (NumberFormatException e) {
                // Skip invalid numbers
            }
        }

        // If no IDs found, return defaults
        return productIds.isEmpty() ? List.of(1L, 2L, 3L) : productIds;
    }

    /**
     * Check if Ollama is available
     */
    public boolean isOllamaAvailable() {
        try {
            webClient.get()
                    .uri("/api/tags")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(2))
                    .block();
            return true;
        } catch (Exception e) {
            logger.warn("Ollama is not available: {}", e.getMessage());
            return false;
        }
    }
}

