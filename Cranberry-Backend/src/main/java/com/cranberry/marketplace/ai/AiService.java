package com.cranberry.marketplace.ai;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cranberry.marketplace.dto.AiChatRequest;
import com.cranberry.marketplace.dto.AiChatResponse;
import com.cranberry.marketplace.dto.AiPriceSuggestRequest;
import com.cranberry.marketplace.dto.AiPriceSuggestResponse;
import com.cranberry.marketplace.dto.AiRecommendRequest;
import com.cranberry.marketplace.dto.AiRecommendationResponse;
import com.cranberry.marketplace.dto.AiSearchRequest;
import com.cranberry.marketplace.dto.AiSearchResponse;
import com.cranberry.marketplace.dto.ProductResponse;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.OrderItem;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.repository.OrderRepository;
import com.cranberry.marketplace.repository.ProductRepository;

@Service
public class AiService {

    // ...existing code...

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AiProviderClient aiClient;

    public AiService(ProductRepository productRepository,
                     OrderRepository orderRepository,
                     AiProviderClient aiClient) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.aiClient = aiClient;
    }

    // ========================= AI CHAT =========================

    public AiChatResponse chat(AiChatRequest request) {
        String userMessage = request.getMessage();
        Long userId = request.getUserId();

        // Detect intent from user message
        String intent = detectIntent(userMessage);

        switch (intent) {
            case "PRODUCT_SEARCH":
                return handleProductSearch(userMessage);
            case "ORDER_TRACKING":
                return handleOrderTracking(userMessage, userId);
            case "DEALS":
                return handleDealsQuery();
            case "HELP":
                return handleHelp();
            default:
                return handleGeneralQuery(userMessage);
        }
    }

    private String detectIntent(String message) {
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("track") || lowerMessage.contains("order status") ||
            lowerMessage.contains("my order") || lowerMessage.contains("delivery")) {
            return "ORDER_TRACKING";
        }

        if (lowerMessage.contains("deal") || lowerMessage.contains("discount") ||
            lowerMessage.contains("offer") || lowerMessage.contains("sale")) {
            return "DEALS";
        }

        if (lowerMessage.contains("help") || lowerMessage.contains("support") ||
            lowerMessage.contains("how to") || lowerMessage.contains("what can")) {
            return "HELP";
        }

        if (lowerMessage.contains("find") || lowerMessage.contains("search") ||
            lowerMessage.contains("show me") || lowerMessage.contains("looking for") ||
            lowerMessage.contains("recommend") || lowerMessage.contains("suggest") ||
            lowerMessage.contains("best") || lowerMessage.contains("laptop") ||
            lowerMessage.contains("phone") || lowerMessage.contains("buy")) {
            return "PRODUCT_SEARCH";
        }

        return "GENERAL";
    }

    private AiChatResponse handleProductSearch(String message) {
        // Extract search criteria from message
        List<Product> allProducts = productRepository.findAll();

        // Extract price constraints if any
        Double maxPrice = extractMaxPrice(message);
        Double minPrice = extractMinPrice(message);

        // Extract category/keywords
        String keywords = extractKeywords(message);

        // Build product context for AI
        List<Product> relevantProducts = filterProducts(allProducts, keywords, minPrice, maxPrice);

        if (relevantProducts.isEmpty()) {
            // Fallback to top rated or random products if no match
            relevantProducts = allProducts.stream().limit(10).collect(Collectors.toList());
        }

        // Build context for AI
        StringBuilder productContext = new StringBuilder();
        productContext.append("Available products in Cranberry store:\n");
        for (Product p : relevantProducts) {
            productContext.append(String.format("- ID:%d, Name: %s, Category: %s, Price: ₹%.0f, Description: %s\n",
                    p.getId(), p.getName(), p.getCategory(), p.getPrice(),
                    p.getDescription() != null ? p.getDescription().substring(0, Math.min(100, p.getDescription().length())) : "N/A"));
        }

        String systemPrompt = String.format("""
            You are a helpful shopping assistant for Cranberry Marketplace.
            IMPORTANT: Always use the name 'Cranberry' and never 'CranBerry'.
            
            %s
            
            Based on the user's query and available products, provide a helpful response.
            Recommend 3-5 specific products by mentioning their names and why they would be a good choice.
            Be friendly and concise. Do not include product IDs in your response, just names and key features.
            """, productContext.toString());

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", message));

        String aiReply = aiClient.generateChatResponse(messages);

        // Get products to return with response
        List<ProductResponse> suggestedProducts = relevantProducts.stream()
                .limit(5)
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());

        return AiChatResponse.builder()
                .reply(aiReply)
                .intent("PRODUCT_SEARCH")
                .suggestedProducts(suggestedProducts)
                .build();
    }

    private AiChatResponse handleOrderTracking(String message, Long userId) {
        if (userId == null) {
            return AiChatResponse.builder()
                    .reply("I'd be happy to help you track your order! Please log in to your account first, and I can show you the status of your orders.")
                    .intent("ORDER_TRACKING")
                    .build();
        }

        List<Order> orders = orderRepository.findByUserId(userId);

        if (orders.isEmpty()) {
            return AiChatResponse.builder()
                    .reply("I couldn't find any orders for your account. Once you place an order, you'll be able to track it here!")
                    .intent("ORDER_TRACKING")
                    .build();
        }

        // Get the most recent order
        Order latestOrder = orders.get(orders.size() - 1);

        StringBuilder trackingInfoBuilder = new StringBuilder();
        trackingInfoBuilder.append(String.format("📦 **Your Latest Order (Order #%d)**\n", latestOrder.getId()));
        trackingInfoBuilder.append(String.format("Status: %s\n", latestOrder.getStatus()));
        trackingInfoBuilder.append(String.format("Total Amount: ₹%.0f\n", latestOrder.getTotalAmount()));
        
        if (latestOrder.getTrackingNumber() != null) {
            trackingInfoBuilder.append(String.format("Tracking ID: %s\n", latestOrder.getTrackingNumber()));
        }
        
        if (latestOrder.getEstimatedDeliveryDate() != null) {
            trackingInfoBuilder.append(String.format("Est. Delivery: %s\n", latestOrder.getEstimatedDeliveryDate().toLocalDate().toString()));
        }
        
        trackingInfoBuilder.append(String.format("Shipping Address: %s\n", latestOrder.getShippingAddress() != null ? latestOrder.getShippingAddress() : "Not specified"));
        trackingInfoBuilder.append(String.format("Ordered on: %s\n", latestOrder.getCreatedAt().toLocalDate().toString()));

        String trackingInfo = trackingInfoBuilder.toString();

        String reply = String.format("""
            Here's the status of your most recent order:
            
            %s
            
            You have %d total order(s). Would you like more details about any specific order?
            """, trackingInfo, orders.size());

        return AiChatResponse.builder()
                .reply(reply)
                .intent("ORDER_TRACKING")
                .orderTrackingInfo(trackingInfo)
                .build();
    }

    private AiChatResponse handleDealsQuery() {
        List<Product> allProducts = productRepository.findAll();

        // Find products with lower prices (simulating deals)
        List<Product> deals = allProducts.stream()
                .sorted(Comparator.comparingDouble(Product::getPrice))
                .limit(5)
                .collect(Collectors.toList());

        StringBuilder dealsInfo = new StringBuilder();
        dealsInfo.append("🔥 **Today's Best Deals:**\n\n");
        for (Product p : deals) {
            dealsInfo.append(String.format("• **%s** - ₹%.0f (%s)\n",
                    p.getName(), p.getPrice(), p.getCategory() != null ? p.getCategory() : "General"));
        }

        List<ProductResponse> dealProducts = deals.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());

        return AiChatResponse.builder()
                .reply(dealsInfo.toString() + "\n\nWould you like me to help you find something specific?")
                .intent("DEALS")
                .suggestedProducts(dealProducts)
                .build();
    }

    private AiChatResponse handleHelp() {
        String helpMessage = """
            👋 **Welcome to Cranberry Marketplace!** I'm your AI shopping assistant. Here's what I can help you with:
            
            🛍️ **Product Search**
            - "Show me best laptops under ₹50000"
            - "Find wireless headphones"
            - "Recommend gaming accessories"
            
            📦 **Order Tracking**
            - "Track my order"
            - "What's my order status?"
            
            💰 **Deals & Offers**
            - "Show me today's deals"
            - "Any discounts available?"
            
            Just type your question and I'll help you find what you need!
            """;

        return AiChatResponse.builder()
                .reply(helpMessage)
                .intent("HELP")
                .build();
    }

    private AiChatResponse handleGeneralQuery(String message) {
        List<Product> products = productRepository.findAll();

        String productList = products.stream()
                .limit(20)
                .map(p -> String.format("%s (₹%.0f)", p.getName(), p.getPrice()))
                .collect(Collectors.joining(", "));

        String systemPrompt = String.format("""
            You are a friendly shopping assistant for Cranberry Marketplace, an online store.
            IMPORTANT: Always use the name 'Cranberry' and never 'CranBerry'.
            Available product categories include: Electronics, Clothing, Home & Garden, Sports, etc.
            Some popular products: %s
            
            Respond helpfully and naturally. If they're looking for products, suggest they search for specific items.
            Keep responses concise and friendly.
            """, productList);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", message));

        String aiReply = aiClient.generateChatResponse(messages);

        return AiChatResponse.builder()
                .reply(aiReply)
                .intent("GENERAL")
                .build();
    }

    // ========================= AI SEARCH =========================

    public AiSearchResponse search(AiSearchRequest request) {
        String query = request.getQuery();

        // Extract search parameters
        Double maxPrice = extractMaxPrice(query);
        Double minPrice = extractMinPrice(query);
        String keywords = extractKeywords(query);

        // Get all products
        List<Product> allProducts = productRepository.findAll();

        // Filter products based on query
        List<Product> matchedProducts = filterProducts(allProducts, keywords, minPrice, maxPrice);

        // If no matches, search more broadly
        if (matchedProducts.isEmpty()) {
            matchedProducts = productRepository.searchByKeyword(keywords);
        }

        // If still no matches, return all products sorted by relevance
        if (matchedProducts.isEmpty()) {
            matchedProducts = allProducts;
        }

        // Use AI to rank products by relevance
        matchedProducts = rankProductsByRelevance(matchedProducts, query);

        // Calculate statistics
        String topCategory = matchedProducts.stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(Product::getCategory, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("General");

        Double resultMinPrice = matchedProducts.stream()
                .mapToDouble(Product::getPrice)
                .min().orElse(0.0);

        Double resultMaxPrice = matchedProducts.stream()
                .mapToDouble(Product::getPrice)
                .max().orElse(0.0);

        // Generate search insight using AI
        String searchInsight = generateSearchInsight(query, matchedProducts.size(), topCategory);

        // Convert to response
        List<ProductResponse> productResponses = matchedProducts.stream()
                .limit(20)
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());

        return AiSearchResponse.builder()
                .products(productResponses)
                .totalResults(matchedProducts.size())
                .topCategory(topCategory)
                .minPrice(resultMinPrice)
                .maxPrice(resultMaxPrice)
                .searchInsight(searchInsight)
                .build();
    }

    private List<Product> rankProductsByRelevance(List<Product> products, String query) {
        String lowerQuery = query.toLowerCase();

        // Score each product based on relevance
        return products.stream()
                .sorted((p1, p2) -> {
                    int score1 = calculateRelevanceScore(p1, lowerQuery);
                    int score2 = calculateRelevanceScore(p2, lowerQuery);
                    return score2 - score1; // Descending order
                })
                .collect(Collectors.toList());
    }

    private int calculateRelevanceScore(Product product, String query) {
        int score = 0;
        String name = product.getName() != null ? product.getName().toLowerCase() : "";
        String description = product.getDescription() != null ? product.getDescription().toLowerCase() : "";
        String category = product.getCategory() != null ? product.getCategory().toLowerCase() : "";

        // Exact name match
        if (name.contains(query)) score += 100;

        // Word matches in name
        for (String word : query.split("\\s+")) {
            if (word.length() > 2) {
                if (name.contains(word)) score += 20;
                if (description.contains(word)) score += 10;
                if (category.contains(word)) score += 15;
            }
        }

        return score;
    }

    private String generateSearchInsight(String query, int resultCount, String topCategory) {
        if (resultCount == 0) {
            return "No exact matches found. Try broadening your search or using different keywords.";
        }

        return String.format("Found %d products matching your search. Most results are in the '%s' category.",
                resultCount, topCategory);
    }

    // ========================= AI RECOMMENDATIONS =========================

    public AiRecommendationResponse recommend(AiRecommendRequest request) {
        String type = request.getType() != null ? request.getType() : "personalized";

        if ("similar".equals(type) && request.getProductId() != null) {
            return getSimilarProducts(request.getProductId());
        } else {
            return getPersonalizedRecommendations(request.getUserId());
        }
    }

    private AiRecommendationResponse getSimilarProducts(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);

        if (productOpt.isEmpty()) {
            return AiRecommendationResponse.builder()
                    .products(Collections.emptyList())
                    .productIds(Collections.emptyList())
                    .recommendationType("similar")
                    .reason("Product not found")
                    .build();
        }

        Product product = productOpt.get();
        String category = product.getCategory();

        // Get products from same category
        List<Product> similarProducts = productRepository.findSimilarProducts(category, productId);

        // Also find products in similar price range
        double priceRange = product.getPrice() * 0.3; // 30% price range
        List<Product> priceRangeProducts = productRepository.findByPriceBetween(
                product.getPrice() - priceRange,
                product.getPrice() + priceRange
        );

        // Combine and deduplicate
        Set<Long> addedIds = new HashSet<>();
        addedIds.add(productId); // Exclude the current product
        List<Product> recommendations = new ArrayList<>();

        for (Product p : similarProducts) {
            if (addedIds.add(p.getId())) {
                recommendations.add(p);
            }
        }

        for (Product p : priceRangeProducts) {
            if (addedIds.add(p.getId()) && recommendations.size() < 10) {
                recommendations.add(p);
            }
        }

        // Use AI to explain the recommendation
        String reason = String.format("Products similar to '%s' in the %s category",
                product.getName(), category != null ? category : "same");

        List<ProductResponse> productResponses = recommendations.stream()
                .limit(10)
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());

        List<Long> productIds = productResponses.stream()
                .map(ProductResponse::getId)
                .collect(Collectors.toList());

        return AiRecommendationResponse.builder()
                .products(productResponses)
                .productIds(productIds)
                .recommendationType("similar")
                .reason(reason)
                .build();
    }

    private AiRecommendationResponse getPersonalizedRecommendations(Long userId) {
        List<Product> recommendations = new ArrayList<>();
        String reason = "Top picks for you";

        if (userId != null) {
            // Get user's order history
            List<Order> orders = orderRepository.findByUserId(userId);

            if (!orders.isEmpty()) {
                // Analyze user's purchase history
                Map<String, Long> categoryCount = new HashMap<>();
                Set<Long> purchasedProductIds = new HashSet<>();

                for (Order order : orders) {
                    for (OrderItem item : order.getItems()) {
                        Product product = item.getProduct();
                        if (product != null) {
                            purchasedProductIds.add(product.getId());
                            String cat = product.getCategory() != null ? product.getCategory() : "General";
                            categoryCount.merge(cat, 1L, Long::sum);
                        }
                    }
                }

                // Find most purchased category
                String favoriteCategory = categoryCount.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse(null);

                if (favoriteCategory != null) {
                    // Get products from favorite category that user hasn't bought
                    List<Product> categoryProducts = productRepository.findTopByCategory(favoriteCategory);
                    for (Product p : categoryProducts) {
                        if (!purchasedProductIds.contains(p.getId())) {
                            recommendations.add(p);
                        }
                    }
                    reason = String.format("Based on your interest in %s products", favoriteCategory);
                }
            }
        }

        // If no personalized recommendations, return popular products
        if (recommendations.isEmpty()) {
            recommendations = productRepository.findAll().stream()
                    .limit(10)
                    .collect(Collectors.toList());
            reason = "Popular products in Cranberry store";
        }

        List<ProductResponse> productResponses = recommendations.stream()
                .limit(10)
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());

        List<Long> productIds = productResponses.stream()
                .map(ProductResponse::getId)
                .collect(Collectors.toList());

        return AiRecommendationResponse.builder()
                .products(productResponses)
                .productIds(productIds)
                .recommendationType("personalized")
                .reason(reason)
                .build();
    }

    // ========================= AI PRICE SUGGESTION =========================

    public AiPriceSuggestResponse suggestPrice(AiPriceSuggestRequest request) {
        String productName = request.getProductName();
        String category = request.getCategory();
        Double intendedPrice = request.getIntendedPrice();

        // Get similar products for market analysis
        List<Product> similarProducts = new ArrayList<>();

        if (category != null && !category.isEmpty()) {
            similarProducts = productRepository.findByCategoryIgnoreCase(category);
        }

        if (similarProducts.isEmpty() && productName != null) {
            similarProducts = productRepository.searchByKeyword(productName);
        }

        if (similarProducts.isEmpty()) {
            similarProducts = productRepository.findAll();
        }

        // Calculate market statistics
        double avgPrice = similarProducts.stream()
                .mapToDouble(Product::getPrice)
                .average().orElse(0.0);

        double minMarketPrice = similarProducts.stream()
                .mapToDouble(Product::getPrice)
                .min().orElse(0.0);

        double maxMarketPrice = similarProducts.stream()
                .mapToDouble(Product::getPrice)
                .max().orElse(0.0);

        // Calculate recommended price
        double recommendedPrice;
        String marketPosition;
        int confidenceScore;

        if (intendedPrice != null && intendedPrice > 0) {
            // Analyze intended price vs market
            if (intendedPrice > avgPrice * 1.2) {
                marketPosition = "PREMIUM";
                recommendedPrice = Math.round((intendedPrice * 0.9 + avgPrice * 0.1) * 100.0) / 100.0;
                confidenceScore = 70;
            } else if (intendedPrice < avgPrice * 0.8) {
                marketPosition = "BUDGET";
                recommendedPrice = Math.round((intendedPrice * 0.7 + avgPrice * 0.3) * 100.0) / 100.0;
                confidenceScore = 75;
            } else {
                marketPosition = "COMPETITIVE";
                recommendedPrice = Math.round(avgPrice * 100.0) / 100.0;
                confidenceScore = 85;
            }
        } else {
            recommendedPrice = Math.round(avgPrice * 100.0) / 100.0;
            marketPosition = "COMPETITIVE";
            confidenceScore = 80;
        }

        // Generate pricing insights using AI
        List<String> insights = generatePricingInsights(productName, category, recommendedPrice, avgPrice, intendedPrice, marketPosition);

        // Build market analysis
        AiPriceSuggestResponse.MarketAnalysis marketAnalysis = new AiPriceSuggestResponse.MarketAnalysis();
        marketAnalysis.setAverageMarketPrice(Math.round(avgPrice * 100.0) / 100.0);
        marketAnalysis.setProductsAnalyzed(similarProducts.size());
        marketAnalysis.setMarketPosition(marketPosition);

        return AiPriceSuggestResponse.builder()
                .recommendedPrice(recommendedPrice)
                .minPrice(Math.round(minMarketPrice * 100.0) / 100.0)
                .maxPrice(Math.round(maxMarketPrice * 100.0) / 100.0)
                .confidenceScore(confidenceScore)
                .marketAnalysis(marketAnalysis)
                .pricingInsights(insights)
                .build();
    }

    private List<String> generatePricingInsights(String productName, String category,
                                                  double recommendedPrice, double avgPrice,
                                                  Double intendedPrice, String marketPosition) {
        List<String> insights = new ArrayList<>();

        switch (marketPosition) {
            case "PREMIUM":
                insights.add("Your intended price positions this as a premium product.");
                insights.add("Consider highlighting unique features to justify the higher price.");
                insights.add("Premium pricing may reduce sales volume but increase profit margins.");
                break;
            case "BUDGET":
                insights.add("Your intended price is below market average - great for competitive entry.");
                insights.add("Low pricing can help gain market share quickly.");
                insights.add("Ensure your margins remain profitable at this price point.");
                break;
            case "COMPETITIVE":
                insights.add("Your pricing aligns well with market standards.");
                insights.add("This competitive pricing should attract a broad customer base.");
                insights.add("Focus on product quality and customer service for differentiation.");
                break;
        }

        if (intendedPrice != null && intendedPrice > 0) {
            double diff = intendedPrice - recommendedPrice;
            if (Math.abs(diff) > 10) {
                if (diff > 0) {
                    insights.add(String.format("Our analysis suggests a price ₹%.0f lower than your intended price.", Math.abs(diff)));
                } else {
                    insights.add(String.format("You could potentially price ₹%.0f higher based on market data.", Math.abs(diff)));
                }
            }
        }

        return insights;
    }

    // ========================= HELPER METHODS =========================

    private Double extractMaxPrice(String text) {
        // Pattern for "under ₹X", "less than ₹X", "below ₹X", "max ₹X" (supports both $ and ₹)
        Pattern pattern = Pattern.compile("(?:under|less than|below|max|maximum)\\s*[₹$]?([\\d,]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1).replace(",", ""));
        }
        return null;
    }

    private Double extractMinPrice(String text) {
        // Pattern for "over ₹X", "more than ₹X", "above ₹X", "min ₹X" (supports both $ and ₹)
        Pattern pattern = Pattern.compile("(?:over|more than|above|min|minimum)\\s*[₹$]?([\\d,]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1).replace(",", ""));
        }
        return null;
    }

    private String extractKeywords(String text) {
        // Remove price-related phrases (supports both $ and ₹)
        String cleaned = text.replaceAll("(?i)(under|less than|below|over|more than|above|max|min|maximum|minimum)\\s*[₹$]?[\\d,]+", "");
        // Remove common filler words
        cleaned = cleaned.replaceAll("(?i)\\b(show me|find me|find|search for|looking for|i want|i need|please|the|a|an|some|best|top|good)\\b", "");
        return cleaned.trim().replaceAll("\\s+", " ");
    }

    private List<Product> filterProducts(List<Product> products, String keywords, Double minPrice, Double maxPrice) {
        return products.stream()
                .filter(p -> {
                    // Price filter
                    if (minPrice != null && p.getPrice() < minPrice) return false;
                    if (maxPrice != null && p.getPrice() > maxPrice) return false;

                    // Keyword filter
                    if (keywords != null && !keywords.isEmpty()) {
                        String name = p.getName() != null ? p.getName().toLowerCase() : "";
                        String description = p.getDescription() != null ? p.getDescription().toLowerCase() : "";
                        String category = p.getCategory() != null ? p.getCategory().toLowerCase() : "";
                        String keywordsLower = keywords.toLowerCase();

                        boolean matches = false;
                        for (String word : keywordsLower.split("\\s+")) {
                            if (word.length() > 2) {
                                if (name.contains(word) || description.contains(word) || category.contains(word)) {
                                    matches = true;
                                    break;
                                }
                            }
                        }
                        return matches || keywords.trim().isEmpty();
                    }

                    return true;
                })
                .collect(Collectors.toList());
    }

    private ProductResponse convertToProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory(),
                product.getStatus(),
                product.getVendor() != null ? product.getVendor().getId() : null,
                product.getVendor() != null ? product.getVendor().getShopName() : "Unknown Vendor"
        );
    }
}
