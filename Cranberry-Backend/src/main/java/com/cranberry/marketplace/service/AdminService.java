package com.cranberry.marketplace.service;

import com.cranberry.marketplace.dto.AdminDashboardResponse;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final VendorRepository vendorRepository;

    public AdminService(UserRepository userRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository,
                        VendorRepository vendorRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.vendorRepository = vendorRepository;
    }

    public AdminDashboardResponse getDashboard() {
        int totalUsers = (int) userRepository.count();
        int totalProducts = (int) productRepository.count();
        List<Order> allOrders = orderRepository.findAll();
        int totalOrders = allOrders.size();
        double totalRevenue = allOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();

        List<Vendor> allVendors = vendorRepository.findAll();
        int totalVendors = allVendors.size();
        int pendingVendors = (int) allVendors.stream()
                .filter(v -> "PENDING".equals(v.getStatus()))
                .count();

        return new AdminDashboardResponse(
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                totalVendors,
                pendingVendors
        );
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor approveVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
        vendor.setStatus("APPROVED");
        return vendorRepository.save(vendor);
    }

    public Vendor rejectVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
        vendor.setStatus("REJECTED");
        return vendorRepository.save(vendor);
    }

    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        productRepository.deleteById(productId);
    }
}
