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

        // Extract product names from system context
        List<String> products = extractProductNamesFromContext(systemContext);
        
        // Smart responses based on query
        if (lastUserMessage.contains("macbook") || lastUserMessage.contains("mac")) {
            return findProductResponse(products, "MacBook", "The MacBook Air M2 is an excellent choice! It features the powerful M2 chip, stunning Liquid Retina display, and up to 18 hours of battery life. Perfect for productivity and creative work. Price: ₹49,999");
        } else if (lastUserMessage.contains("laptop") || lastUserMessage.contains("computer")) {
            return findProductResponse(products, "MacBook,laptop", "I'd recommend the **MacBook Air M2** - it's our top-selling laptop with the M2 chip, 13.6-inch Liquid Retina display, and incredible 18-hour battery life at ₹49,999. Great for both work and personal use!");
        } else if (lastUserMessage.contains("iphone") || lastUserMessage.contains("phone") || lastUserMessage.contains("mobile")) {
            return findProductResponse(products, "iPhone,phone", "The **iPhone 15 Pro** is our flagship smartphone! Featuring titanium design, A17 Pro chip, and a 48MP camera system with the new Action button. Available at ₹44,999 - it's perfect for photography enthusiasts!");
        } else if (lastUserMessage.contains("headphone") || lastUserMessage.contains("earphone") || lastUserMessage.contains("audio")) {
            return findProductResponse(products, "Headphone,Sony,audio", "Check out the **Sony WH-1000XM5 Headphones**! Industry-leading noise cancellation, crystal clear hands-free calling, and 30-hour battery life. Priced at ₹24,999 - perfect for music lovers and professionals!");
        } else if (lastUserMessage.contains("watch") || lastUserMessage.contains("smartwatch")) {
            return findProductResponse(products, "Watch,Apple Watch", "The **Apple Watch SE** is a fantastic choice at ₹29,999! It includes fitness tracking, heart rate monitoring, crash detection - all the essential features you need!");
        } else if (lastUserMessage.contains("tv") || lastUserMessage.contains("television")) {
            return findProductResponse(products, "TV,Samsung", "The **Samsung 43\" Crystal UHD TV** offers stunning 4K picture quality with Crystal Processor, Smart TV features with Tizen OS, and HDR support. Available at ₹32,999!");
        } else if (lastUserMessage.contains("shoe") || lastUserMessage.contains("nike") || lastUserMessage.contains("sneaker")) {
            return findProductResponse(products, "Nike,shoe", "The **Nike Air Max 270 React** combines style with comfort! Features Air Max cushioning and React foam technology with breathable mesh. Only ₹12,999!");
        } else if (lastUserMessage.contains("jeans") || lastUserMessage.contains("pants") || lastUserMessage.contains("levi")) {
            return findProductResponse(products, "Levi,Jeans", "The **Levi's 501 Original Jeans** - the classic since 1873! 100% cotton denim with signature straight leg. A timeless choice at ₹3,999!");
        } else if (lastUserMessage.contains("fashion") || lastUserMessage.contains("clothing") || lastUserMessage.contains("clothes")) {
            return "Here are our top Fashion picks:\n\n• **Nike Air Max 270 React** - ₹12,999 (Stylish comfort)\n• **Levi's 501 Original Jeans** - ₹3,999 (Classic fit)\n• **Ray-Ban Aviator Classic** - ₹8,999 (Iconic style)\n• **Wildcraft Puffer Jacket** - ₹5,999 (Warm & stylish)\n\nWould you like details on any of these?";
        } else if (lastUserMessage.contains("electronic") || lastUserMessage.contains("tech") || lastUserMessage.contains("gadget")) {
            return "Here are our top Electronics:\n\n• **MacBook Air M2** - ₹49,999 (Powerful laptop)\n• **iPhone 15 Pro** - ₹44,999 (Latest iPhone)\n• **Sony WH-1000XM5** - ₹24,999 (Best headphones)\n• **Apple Watch SE** - ₹29,999 (Smart fitness)\n• **Samsung 43\" UHD TV** - ₹32,999 (Crystal clear)\n\nWhich one interests you?";
        } else if (lastUserMessage.contains("beauty") || lastUserMessage.contains("skincare") || lastUserMessage.contains("makeup")) {
            return "Here are our Beauty bestsellers:\n\n• **Neutrogena Hydro Boost Gel** - ₹899 (Hydrating skincare)\n• **Dyson Airwrap Complete** - ₹44,999 (Salon-quality styling)\n• **Lakme Absolute Set** - ₹2,499 (Complete makeup kit)\n• **Forest Essentials Face Serum** - ₹2,999 (Ayurvedic night repair)\n\nWhich would you like to know more about?";
        } else if (lastUserMessage.contains("home") || lastUserMessage.contains("kitchen") || lastUserMessage.contains("furniture")) {
            return "Here are our Home & Living essentials:\n\n• **Dyson V12 Slim Vacuum** - ₹35,999 (Powerful cleaning)\n• **Nespresso Vertuo Plus** - ₹14,999 (Perfect coffee)\n• **Ergonomic Office Chair** - ₹18,999 (All-day comfort)\n• **Philips Hue Starter Kit** - ₹9,999 (Smart lighting)\n\nInterested in any of these?";
        } else if (lastUserMessage.contains("under") && (lastUserMessage.contains("5000") || lastUserMessage.contains("₹5000"))) {
            return "Great budget picks under ₹5,000:\n\n• **Levi's 501 Original Jeans** - ₹3,999\n• **Lakme Absolute Set** - ₹2,499\n• **Forest Essentials Face Serum** - ₹2,999\n• **Park Avenue Perfume** - ₹1,299\n• **Neutrogena Hydro Boost Gel** - ₹899\n\nAll great quality at affordable prices!";
        } else if (lastUserMessage.contains("under") && (lastUserMessage.contains("10000") || lastUserMessage.contains("₹10000"))) {
            return "Great options under ₹10,000:\n\n• **Ray-Ban Aviator Classic** - ₹8,999\n• **Wildcraft Puffer Jacket** - ₹5,999\n• **Philips Hue Starter Kit** - ₹9,999\n• **Levi's 501 Original Jeans** - ₹3,999\n\nWhich category interests you most?";
        } else if (lastUserMessage.contains("hello") || lastUserMessage.contains("hi") || lastUserMessage.contains("hey")) {
            return "Hello! 👋 Welcome to Cranberry! I'm your AI shopping assistant.\n\nI can help you:\n• Find products by category (Electronics, Fashion, Beauty, Home)\n• Search by budget (e.g., 'laptops under ₹50,000')\n• Get recommendations based on your needs\n\nWhat are you looking for today?";
        } else if (lastUserMessage.contains("thank")) {
            return "You're welcome! 😊 Happy to help. Feel free to ask if you need anything else. Happy shopping at Cranberry!";
        } else if (lastUserMessage.contains("deal") || lastUserMessage.contains("discount") || lastUserMessage.contains("offer")) {
            return "🔥 Here are today's best deals at Cranberry:\n\n• **Neutrogena Hydro Boost Gel** - ₹899 (Great value!)\n• **Park Avenue Perfume** - ₹1,299\n• **Levi's 501 Jeans** - ₹3,999\n• **Lakme Absolute Set** - ₹2,499\n\nAll products come with free shipping on orders over ₹500!";
        } else if (lastUserMessage.contains("recommend") || lastUserMessage.contains("suggest") || lastUserMessage.contains("best")) {
            return "Here are my top recommendations:\n\n**Electronics:** MacBook Air M2 (₹49,999) - Best laptop\n**Fashion:** Nike Air Max 270 (₹12,999) - Most comfortable\n**Beauty:** Dyson Airwrap (₹44,999) - Premium styling\n**Home:** Nespresso Vertuo (₹14,999) - Coffee lovers' favorite\n\nWhat category interests you?";
        } else {
            // Use product context if available
            if (!products.isEmpty()) {
                String productSample = products.stream().limit(5).collect(java.util.stream.Collectors.joining(", "));
                return "I'd be happy to help you find the perfect product! 🛍️\n\nWe have great options like " + productSample + " and more.\n\nYou can ask me:\n• 'Show me laptops' or 'Find headphones'\n• 'What's under ₹10,000?'\n• 'Best deals today'\n\nWhat are you looking for?";
            }
            return "Welcome to Cranberry! 🛍️ I can help you find:\n\n• **Electronics** - Laptops, phones, headphones, TVs\n• **Fashion** - Shoes, jeans, jackets, sunglasses\n• **Beauty** - Skincare, makeup, haircare\n• **Home & Living** - Appliances, furniture, decor\n\nJust tell me what you're looking for, or ask for recommendations!";
        }
    }

    private String findProductResponse(List<String> products, String keywords, String defaultResponse) {
        String[] keywordArray = keywords.toLowerCase().split(",");
        for (String product : products) {
            for (String keyword : keywordArray) {
                if (product.toLowerCase().contains(keyword.trim())) {
                    return defaultResponse;
                }
            }
        }
        return defaultResponse;
    }

    private List<String> extractProductNamesFromContext(String context) {
        List<String> products = new ArrayList<>();
        if (context == null || context.isEmpty()) return products;
        
        // Extract product names from "Name: ProductName," pattern
        Pattern pattern = Pattern.compile("Name:\\s*([^,]+),");
        Matcher matcher = pattern.matcher(context);
        while (matcher.find()) {
            products.add(matcher.group(1).trim());
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

