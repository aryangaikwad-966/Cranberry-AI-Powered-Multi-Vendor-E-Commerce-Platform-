package com.cranberry.marketplace.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cranberry.marketplace.dto.AdminDashboardResponse;
import com.cranberry.marketplace.dto.ProductResponse;
import com.cranberry.marketplace.dto.VendorResponse;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.repository.OrderRepository;
import com.cranberry.marketplace.repository.ProductRepository;
import com.cranberry.marketplace.repository.UserRepository;
import com.cranberry.marketplace.repository.VendorRepository;

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
                .filter(v -> "PENDING".equalsIgnoreCase(v.getStatus()))
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

    public List<VendorResponse> getAllVendors(String status) {
        List<Vendor> vendors;
        if (status == null) {
            vendors = vendorRepository.findAll();
        } else {
            vendors = vendorRepository.findByStatusIgnoreCase(status);
        }
        return vendors.stream()
                .map(this::convertToVendorResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse convertToProductResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getImageUrl(),
                p.getCategory(),
                p.getStatus(),
                p.getVendor() != null ? p.getVendor().getId() : null,
                p.getVendor() != null ? p.getVendor().getShopName() : "Unknown Vendor"
        );
    }

    private VendorResponse convertToVendorResponse(Vendor vendor) {
        int productCount = (int) productRepository.countByVendorId(vendor.getId());
        return new VendorResponse(
                vendor.getId(),
                vendor.getShopName(),
                vendor.getContactEmail(),
                vendor.getLogo() != null ? vendor.getLogo() : "https://via.placeholder.com/150",
                productCount,
                4.5, // Default rating for now until Review system is implemented
                vendor.getStatus(),
                vendor.getJoinedAt() != null ? vendor.getJoinedAt() : java.time.LocalDateTime.now()
        );
    }

    public Vendor approveVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
        vendor.setStatus("APPROVED");
        
        // Also update the user role to VENDOR
        if (vendor.getUser() != null) {
            vendor.getUser().setRole("VENDOR");
            userRepository.save(vendor.getUser());
        }
        
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

    public void deleteVendor(Long vendorId) {
        if (!vendorRepository.existsById(vendorId)) {
            throw new RuntimeException("Vendor not found with id: " + vendorId);
        }
        vendorRepository.deleteById(vendorId);
    }

    public Product moderateProduct(Long productId, String status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        product.setStatus(status);
        return productRepository.save(product);
    }
}
