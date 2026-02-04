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
        String systemContext = "";
        
        for (Map<String, String> msg : messages) {
            if ("user".equals(msg.get("role"))) {
                lastUserMessage = msg.get("content").toLowerCase();
            } else if ("system".equals(msg.get("role"))) {
                systemContext = msg.get("content");
            }
        }

        // Handle greetings FIRST (before product search)
        if (lastUserMessage.matches("^(hi+|hey|hello|hola)\\s*$") || 
            lastUserMessage.equals("hi") || lastUserMessage.equals("hii") || 
            lastUserMessage.equals("hello") || lastUserMessage.equals("hey")) {
            return "Hello! 👋 Welcome to Cranberry! I'm your AI shopping assistant.\n\nI can help you:\n• Find products by category (Electronics, Fashion, Beauty, Home)\n• Search by budget (e.g., 'laptops under ₹50,000')\n• Get recommendations based on your needs\n\nWhat are you looking for today?";
        }
        
        if (lastUserMessage.contains("thank")) {
            return "You're welcome! 😊 Happy to help. Feel free to ask if you need anything else. Happy shopping at Cranberry!";
        }

        // Extract REAL products from system context (includes name, category, price)
        List<ProductInfo> products = extractProductsFromContext(systemContext);
        
        // If we have real products from database, use them for dynamic responses
        if (!products.isEmpty()) {
            return buildDynamicResponse(lastUserMessage, products);
        }
        
        return "Welcome to Cranberry! 🛍️ I can help you find:\n\n• **Electronics** - Laptops, phones, headphones, TVs\n• **Fashion** - Shoes, jeans, jackets, sunglasses\n• **Beauty** - Skincare, makeup, haircare\n• **Home & Living** - Appliances, furniture, decor\n\nJust tell me what you're looking for, or ask for recommendations!";
    }

    /**
     * Build dynamic response using REAL products from database
     */
    private String buildDynamicResponse(String userMessage, List<ProductInfo> products) {
        StringBuilder response = new StringBuilder();
        
        // Determine what the user is looking for
        String searchTerm = detectSearchTerm(userMessage);
        
        if (products.size() == 1) {
            // Single product - give detailed response
            ProductInfo p = products.get(0);
            response.append(String.format("I found the perfect match! 🎯\n\n**%s**\n", p.name));
            response.append(String.format("• Price: ₹%.0f\n", p.price));
            if (p.category != null && !p.category.isEmpty()) {
                response.append(String.format("• Category: %s\n", p.category));
            }
            if (p.description != null && !p.description.isEmpty()) {
                response.append(String.format("• %s\n", p.description));
            }
            response.append("\nWould you like to add this to your cart?");
        } else if (products.size() <= 5) {
            // Few products - list them all
            response.append(String.format("Here are the %s I found for you:\n\n", searchTerm.isEmpty() ? "products" : searchTerm));
            for (ProductInfo p : products) {
                response.append(String.format("• **%s** - ₹%.0f", p.name, p.price));
                if (p.category != null && !p.category.isEmpty()) {
                    response.append(String.format(" (%s)", p.category));
                }
                response.append("\n");
            }
            response.append("\nWould you like more details on any of these?");
        } else {
            // Many products - show top 5
            response.append(String.format("Great news! I found %d %s for you. Here are the top picks:\n\n", 
                    products.size(), searchTerm.isEmpty() ? "products" : searchTerm));
            for (int i = 0; i < Math.min(5, products.size()); i++) {
                ProductInfo p = products.get(i);
                response.append(String.format("• **%s** - ₹%.0f", p.name, p.price));
                if (p.category != null && !p.category.isEmpty()) {
                    response.append(String.format(" (%s)", p.category));
                }
                response.append("\n");
            }
            if (products.size() > 5) {
                response.append(String.format("\n...and %d more options available!\n", products.size() - 5));
            }
            response.append("\nWould you like me to narrow down the options?");
        }
        
        return response.toString();
    }

    /**
     * Detect what the user is searching for
     */
    private String detectSearchTerm(String message) {
        if (message.contains("headphone") || message.contains("earphone")) return "headphones";
        if (message.contains("laptop") || message.contains("computer")) return "laptops";
        if (message.contains("phone") || message.contains("mobile")) return "phones";
        if (message.contains("watch")) return "watches";
        if (message.contains("tv") || message.contains("television")) return "TVs";
        if (message.contains("shoe") || message.contains("sneaker")) return "shoes";
        if (message.contains("jeans") || message.contains("pants")) return "jeans";
        if (message.contains("shirt")) return "shirts";
        if (message.contains("dress")) return "dresses";
        if (message.contains("jacket")) return "jackets";
        if (message.contains("bag")) return "bags";
        if (message.contains("beauty") || message.contains("skincare")) return "beauty products";
        if (message.contains("electronic") || message.contains("tech")) return "electronics";
        if (message.contains("fashion") || message.contains("cloth")) return "fashion items";
        return "products";
    }

    /**
     * Product info holder class
     */
    private static class ProductInfo {
        String name;
        String category;
        double price;
        String description;
        
        ProductInfo(String name, String category, double price, String description) {
            this.name = name;
            this.category = category;
            this.price = price;
            this.description = description;
        }
    }

    /**
     * Extract full product info from system context
     * Format: "- ID:X, Name: ProductName, Category: Cat, Price: ₹XXXX, Description: Desc"
     */
    private List<ProductInfo> extractProductsFromContext(String context) {
        List<ProductInfo> products = new ArrayList<>();
        if (context == null || context.isEmpty()) return products;
        
        // Pattern to match: "Name: ProductName, Category: Cat, Price: ₹XXXX"
        Pattern pattern = Pattern.compile("Name:\\s*([^,]+),\\s*Category:\\s*([^,]+),\\s*Price:\\s*₹?([\\d.]+)(?:,\\s*Description:\\s*([^\\n]+))?");
        Matcher matcher = pattern.matcher(context);
        
        while (matcher.find()) {
            String name = matcher.group(1).trim();
            String category = matcher.group(2).trim();
            double price = 0;
            try {
                price = Double.parseDouble(matcher.group(3).trim());
            } catch (NumberFormatException e) {
                // Skip if price is invalid
            }
            String description = matcher.group(4) != null ? matcher.group(4).trim() : "";
            
            products.add(new ProductInfo(name, category, price, description));
        }
        
        return products;
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

