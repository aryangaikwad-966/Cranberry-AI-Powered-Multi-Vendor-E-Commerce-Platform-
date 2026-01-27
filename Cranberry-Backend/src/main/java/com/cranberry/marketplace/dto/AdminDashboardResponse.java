package com.cranberry.marketplace.dto;

public class AdminDashboardResponse {
    private int totalUsers;
    private int totalProducts;
    private int totalOrders;
    private double totalRevenue;
    private int totalVendors;
    private int pendingVendors;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(int totalUsers, int totalProducts, int totalOrders,
                                   double totalRevenue, int totalVendors, int pendingVendors) {
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.totalVendors = totalVendors;
        this.pendingVendors = pendingVendors;
    }

    public int getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public int getTotalVendors() {
        return totalVendors;
    }

    public void setTotalVendors(int totalVendors) {
        this.totalVendors = totalVendors;
    }

    public int getPendingVendors() {
        return pendingVendors;
    }

    public void setPendingVendors(int pendingVendors) {
        this.pendingVendors = pendingVendors;
    }
}
