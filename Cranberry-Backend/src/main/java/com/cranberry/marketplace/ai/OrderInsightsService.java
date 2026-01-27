package com.cranberry.marketplace.ai;

import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.OrderItem;
import com.cranberry.marketplace.model.OrderStatus;
import com.cranberry.marketplace.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI-Powered Order Analytics Service
 * Provides intelligent insights on orders for admin dashboard
 */
@Service
public class OrderInsightsService {

    private static final Logger logger = LoggerFactory.getLogger(OrderInsightsService.class);

    private final OrderRepository orderRepository;
    private final AiProviderClient aiClient;

    public OrderInsightsService(OrderRepository orderRepository, AiProviderClient aiClient) {
        this.orderRepository = orderRepository;
        this.aiClient = aiClient;
    }

    /**
     * Generate comprehensive AI-powered insights for order analytics
     */
    public OrderInsightsResponse generateInsights() {
        List<Order> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        
        if (allOrders.isEmpty()) {
            return OrderInsightsResponse.builder()
                    .summary("No orders found in the system yet.")
                    .insights(Collections.emptyList())
                    .recommendations(Collections.emptyList())
                    .build();
        }

        // Calculate metrics
        OrderMetrics metrics = calculateMetrics(allOrders);
        
        // Generate AI insights
        List<InsightItem> insights = generateAiInsights(metrics, allOrders);
        
        // Generate recommendations
        List<RecommendationItem> recommendations = generateRecommendations(metrics, allOrders);
        
        // Generate summary using AI
        String summary = generateExecutiveSummary(metrics);

        return OrderInsightsResponse.builder()
                .summary(summary)
                .metrics(metrics)
                .insights(insights)
                .recommendations(recommendations)
                .topProducts(getTopProducts(allOrders))
                .salesTrend(calculateSalesTrend(allOrders))
                .build();
    }

    private OrderMetrics calculateMetrics(List<Order> orders) {
        OrderMetrics metrics = new OrderMetrics();
        
        // Basic counts
        metrics.setTotalOrders(orders.size());
        
        // Status breakdown
        Map<String, Long> statusCounts = orders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));
        metrics.setStatusBreakdown(statusCounts);
        
        // Revenue calculations
        double totalRevenue = orders.stream()
                .filter(o -> isRevenueStatus(o.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();
        metrics.setTotalRevenue(totalRevenue);
        
        // Average order value
        double avgOrderValue = orders.stream()
                .mapToDouble(Order::getTotalAmount)
                .average()
                .orElse(0.0);
        metrics.setAverageOrderValue(Math.round(avgOrderValue * 100.0) / 100.0);
        
        // Last 7 days stats
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Order> recentOrders = orders.stream()
                .filter(o -> o.getCreatedAt().isAfter(sevenDaysAgo))
                .collect(Collectors.toList());
        metrics.setOrdersLast7Days(recentOrders.size());
        
        double recentRevenue = recentOrders.stream()
                .filter(o -> isRevenueStatus(o.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();
        metrics.setRevenueLast7Days(Math.round(recentRevenue * 100.0) / 100.0);
        
        // Conversion rate (paid orders / total orders)
        long paidOrders = orders.stream()
                .filter(o -> isRevenueStatus(o.getStatus()))
                .count();
        double conversionRate = orders.size() > 0 ? (double) paidOrders / orders.size() * 100 : 0;
        metrics.setConversionRate(Math.round(conversionRate * 10.0) / 10.0);
        
        // Cancellation rate
        long cancelledOrders = statusCounts.getOrDefault(OrderStatus.CANCELLED.name(), 0L);
        double cancellationRate = orders.size() > 0 ? (double) cancelledOrders / orders.size() * 100 : 0;
        metrics.setCancellationRate(Math.round(cancellationRate * 10.0) / 10.0);
        
        return metrics;
    }

    private List<InsightItem> generateAiInsights(OrderMetrics metrics, List<Order> orders) {
        List<InsightItem> insights = new ArrayList<>();
        
        // Revenue trend insight
        if (metrics.getRevenueLast7Days() > 0) {
            double weeklyAvg = metrics.getTotalRevenue() / Math.max(1, orders.size() / 7.0);
            boolean isAboveAvg = metrics.getRevenueLast7Days() > weeklyAvg;
            
            insights.add(new InsightItem(
                    isAboveAvg ? "POSITIVE" : "NEUTRAL",
                    "Revenue Trend",
                    String.format("Last 7 days revenue: $%.2f (%s weekly average)", 
                            metrics.getRevenueLast7Days(),
                            isAboveAvg ? "above" : "below"),
                    "revenue"
            ));
        }
        
        // Conversion rate insight
        if (metrics.getConversionRate() < 70) {
            insights.add(new InsightItem(
                    "WARNING",
                    "Conversion Rate Alert",
                    String.format("Current conversion rate is %.1f%%. Consider optimizing checkout flow.",
                            metrics.getConversionRate()),
                    "conversion"
            ));
        } else {
            insights.add(new InsightItem(
                    "POSITIVE",
                    "Strong Conversion",
                    String.format("Conversion rate of %.1f%% is healthy.",
                            metrics.getConversionRate()),
                    "conversion"
            ));
        }
        
        // Pending orders insight
        Long pendingCount = metrics.getStatusBreakdown().getOrDefault(OrderStatus.CREATED.name(), 0L) +
                           metrics.getStatusBreakdown().getOrDefault(OrderStatus.PAYMENT_PENDING.name(), 0L);
        if (pendingCount > 5) {
            insights.add(new InsightItem(
                    "ACTION_REQUIRED",
                    "Pending Orders",
                    String.format("%d orders are awaiting payment. Consider sending reminder emails.",
                            pendingCount),
                    "pending"
            ));
        }
        
        // Shipping insight
        Long processingCount = metrics.getStatusBreakdown().getOrDefault(OrderStatus.PROCESSING.name(), 0L);
        if (processingCount > 10) {
            insights.add(new InsightItem(
                    "WARNING",
                    "Shipping Backlog",
                    String.format("%d orders are being processed. Consider expediting shipping.",
                            processingCount),
                    "shipping"
            ));
        }
        
        // Peak hours analysis
        Map<Integer, Long> hourlyDistribution = orders.stream()
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().getHour(), Collectors.counting()));
        Integer peakHour = hourlyDistribution.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(12);
        
        insights.add(new InsightItem(
                "INFO",
                "Peak Shopping Hour",
                String.format("Most orders are placed around %d:00. Optimize marketing campaigns for this time.",
                        peakHour),
                "timing"
        ));
        
        return insights;
    }

    private List<RecommendationItem> generateRecommendations(OrderMetrics metrics, List<Order> orders) {
        List<RecommendationItem> recommendations = new ArrayList<>();
        
        // Based on cancellation rate
        if (metrics.getCancellationRate() > 10) {
            recommendations.add(new RecommendationItem(
                    "HIGH",
                    "Reduce Cancellations",
                    "Cancellation rate is above 10%. Consider improving product descriptions, " +
                    "offering better return policies, or enhancing customer communication.",
                    Arrays.asList("Review cancelled order reasons", "Improve product images", "Add customer reviews")
            ));
        }
        
        // Based on conversion rate
        if (metrics.getConversionRate() < 60) {
            recommendations.add(new RecommendationItem(
                    "HIGH",
                    "Improve Checkout",
                    "Conversion rate needs improvement. Many carts are being abandoned.",
                    Arrays.asList("Simplify checkout process", "Add multiple payment options", "Offer guest checkout")
            ));
        }
        
        // Average order value optimization
        if (metrics.getAverageOrderValue() < 50) {
            recommendations.add(new RecommendationItem(
                    "MEDIUM",
                    "Increase Average Order Value",
                    String.format("Current AOV is $%.2f. Consider upselling strategies.", metrics.getAverageOrderValue()),
                    Arrays.asList("Add product bundles", "Offer free shipping threshold", "Implement cross-selling")
            ));
        }
        
        // Growth recommendation
        recommendations.add(new RecommendationItem(
                "MEDIUM",
                "Growth Opportunity",
                "Based on your order patterns, consider these growth strategies:",
                Arrays.asList("Launch email marketing campaigns", "Introduce loyalty program", "Expand product categories")
        ));
        
        return recommendations;
    }

    private String generateExecutiveSummary(OrderMetrics metrics) {
        String prompt = String.format("""
            Generate a brief executive summary (2-3 sentences) for an e-commerce admin dashboard based on these metrics:
            IMPORTANT: Always use the name 'Cranberry' and never 'CranBerry'.
            - Total Orders: %d
            - Total Revenue: $%.2f
            - Average Order Value: $%.2f
            - Conversion Rate: %.1f%%
            - Orders in last 7 days: %d
            - Revenue in last 7 days: $%.2f
            
            Be concise, professional, and highlight the most important insight.
            """,
                metrics.getTotalOrders(),
                metrics.getTotalRevenue(),
                metrics.getAverageOrderValue(),
                metrics.getConversionRate(),
                metrics.getOrdersLast7Days(),
                metrics.getRevenueLast7Days()
        );

        try {
            return aiClient.generateResponse(prompt);
        } catch (Exception e) {
            logger.warn("Failed to generate AI summary, using fallback: {}", e.getMessage());
            return String.format(
                    "Your store has processed %d orders with total revenue of $%.2f. " +
                    "Average order value is $%.2f with a %.1f%% conversion rate. " +
                    "Last 7 days saw %d orders generating $%.2f in revenue.",
                    metrics.getTotalOrders(),
                    metrics.getTotalRevenue(),
                    metrics.getAverageOrderValue(),
                    metrics.getConversionRate(),
                    metrics.getOrdersLast7Days(),
                    metrics.getRevenueLast7Days()
            );
        }
    }

    private List<TopProduct> getTopProducts(List<Order> orders) {
        Map<Long, TopProduct> productMap = new HashMap<>();
        
        for (Order order : orders) {
            if (!isRevenueStatus(order.getStatus())) continue;
            
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() == null) continue;
                
                Long productId = item.getProduct().getId();
                TopProduct tp = productMap.computeIfAbsent(productId, id -> {
                    TopProduct newTp = new TopProduct();
                    newTp.setProductId(id);
                    newTp.setProductName(item.getProduct().getName());
                    return newTp;
                });
                
                tp.setQuantitySold(tp.getQuantitySold() + item.getQuantity());
                tp.setRevenue(tp.getRevenue() + item.getPrice());
            }
        }
        
        return productMap.values().stream()
                .sorted((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()))
                .limit(5)
                .collect(Collectors.toList());
    }

    private List<SalesTrendPoint> calculateSalesTrend(List<Order> orders) {
        LocalDateTime now = LocalDateTime.now();
        List<SalesTrendPoint> trend = new ArrayList<>();
        
        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = now.minusDays(i).truncatedTo(ChronoUnit.DAYS);
            LocalDateTime dayEnd = dayStart.plusDays(1);
            
            long count = orders.stream()
                    .filter(o -> o.getCreatedAt().isAfter(dayStart) && o.getCreatedAt().isBefore(dayEnd))
                    .count();
            
            double revenue = orders.stream()
                    .filter(o -> o.getCreatedAt().isAfter(dayStart) && o.getCreatedAt().isBefore(dayEnd))
                    .filter(o -> isRevenueStatus(o.getStatus()))
                    .mapToDouble(Order::getTotalAmount)
                    .sum();
            
            trend.add(new SalesTrendPoint(
                    dayStart.toLocalDate().toString(),
                    count,
                    Math.round(revenue * 100.0) / 100.0
            ));
        }
        
        return trend;
    }

    private boolean isRevenueStatus(String status) {
        return OrderStatus.PAID.name().equals(status) ||
               OrderStatus.PROCESSING.name().equals(status) ||
               OrderStatus.SHIPPED.name().equals(status) ||
               OrderStatus.DELIVERED.name().equals(status);
    }

    // ============== RESPONSE CLASSES ==============

    public static class OrderInsightsResponse {
        private String summary;
        private OrderMetrics metrics;
        private List<InsightItem> insights;
        private List<RecommendationItem> recommendations;
        private List<TopProduct> topProducts;
        private List<SalesTrendPoint> salesTrend;

        // Builder pattern
        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private final OrderInsightsResponse response = new OrderInsightsResponse();
            
            public Builder summary(String summary) { response.summary = summary; return this; }
            public Builder metrics(OrderMetrics metrics) { response.metrics = metrics; return this; }
            public Builder insights(List<InsightItem> insights) { response.insights = insights; return this; }
            public Builder recommendations(List<RecommendationItem> recs) { response.recommendations = recs; return this; }
            public Builder topProducts(List<TopProduct> products) { response.topProducts = products; return this; }
            public Builder salesTrend(List<SalesTrendPoint> trend) { response.salesTrend = trend; return this; }
            public OrderInsightsResponse build() { return response; }
        }

        // Getters
        public String getSummary() { return summary; }
        public OrderMetrics getMetrics() { return metrics; }
        public List<InsightItem> getInsights() { return insights; }
        public List<RecommendationItem> getRecommendations() { return recommendations; }
        public List<TopProduct> getTopProducts() { return topProducts; }
        public List<SalesTrendPoint> getSalesTrend() { return salesTrend; }
    }

    public static class OrderMetrics {
        private long totalOrders;
        private double totalRevenue;
        private double averageOrderValue;
        private Map<String, Long> statusBreakdown;
        private int ordersLast7Days;
        private double revenueLast7Days;
        private double conversionRate;
        private double cancellationRate;

        // Getters and Setters
        public long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
        public double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
        public double getAverageOrderValue() { return averageOrderValue; }
        public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }
        public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
        public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }
        public int getOrdersLast7Days() { return ordersLast7Days; }
        public void setOrdersLast7Days(int ordersLast7Days) { this.ordersLast7Days = ordersLast7Days; }
        public double getRevenueLast7Days() { return revenueLast7Days; }
        public void setRevenueLast7Days(double revenueLast7Days) { this.revenueLast7Days = revenueLast7Days; }
        public double getConversionRate() { return conversionRate; }
        public void setConversionRate(double conversionRate) { this.conversionRate = conversionRate; }
        public double getCancellationRate() { return cancellationRate; }
        public void setCancellationRate(double cancellationRate) { this.cancellationRate = cancellationRate; }
    }

    public static class InsightItem {
        private String type; // POSITIVE, WARNING, ACTION_REQUIRED, INFO
        private String title;
        private String description;
        private String category;

        public InsightItem(String type, String title, String description, String category) {
            this.type = type;
            this.title = title;
            this.description = description;
            this.category = category;
        }

        public String getType() { return type; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getCategory() { return category; }
    }

    public static class RecommendationItem {
        private String priority; // HIGH, MEDIUM, LOW
        private String title;
        private String description;
        private List<String> actionItems;

        public RecommendationItem(String priority, String title, String description, List<String> actionItems) {
            this.priority = priority;
            this.title = title;
            this.description = description;
            this.actionItems = actionItems;
        }

        public String getPriority() { return priority; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public List<String> getActionItems() { return actionItems; }
    }

    public static class TopProduct {
        private Long productId;
        private String productName;
        private int quantitySold;
        private double revenue;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public int getQuantitySold() { return quantitySold; }
        public void setQuantitySold(int quantitySold) { this.quantitySold = quantitySold; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
    }

    public static class SalesTrendPoint {
        private String date;
        private long orderCount;
        private double revenue;

        public SalesTrendPoint(String date, long orderCount, double revenue) {
            this.date = date;
            this.orderCount = orderCount;
            this.revenue = revenue;
        }

        public String getDate() { return date; }
        public long getOrderCount() { return orderCount; }
        public double getRevenue() { return revenue; }
    }
}
