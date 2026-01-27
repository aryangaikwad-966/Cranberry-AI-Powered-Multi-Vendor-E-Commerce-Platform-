package com.cranberry.marketplace.ai;

import com.cranberry.marketplace.config.OllamaConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
    public String generateResponse(String prompt) {
        try {
            String response = callOllama(prompt);
            if (response.trim().isEmpty()) {
                return "I'm sorry, I couldn't generate a response. Please try again.";
            }
            // Post-process to fix naming
            return response.replaceAll("(?i)CranBerry", "Cranberry").trim();
        } catch (Exception e) {
            logger.error("Error generating AI response", e);
            return "I'm having trouble connecting to the AI service. Please try again later.";
        }
    }

    /**
     * Generic method to call Ollama API
     */
    private String callOllama(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "model", model,
            "prompt", prompt,
            "stream", false
        );

        try {
            Map<String, Object> response = webClient.post()
                    .uri("/api/generate")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(ollamaConfig.getTimeout())
                    .block();

            if (response != null && response.containsKey("response")) {
                return response.get("response").toString();
            }

            return "";
        } catch (Exception e) {
            logger.error("Error calling Ollama API: {}", e.getMessage());
            throw new RuntimeException("Failed to call Ollama API", e);
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
                productIds.add(Long.parseLong(matcher.group()));
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
                    .timeout(Duration.ofSeconds(5))
                    .block();
            return true;
        } catch (Exception e) {
            logger.warn("Ollama is not available: {}", e.getMessage());
            return false;
        }
    }
}

