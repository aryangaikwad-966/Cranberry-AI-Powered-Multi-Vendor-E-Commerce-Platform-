package com.cranberry.marketplace.service;

import com.cranberry.marketplace.dto.VendorDashboardResponse;
import com.cranberry.marketplace.dto.VendorRequest;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.repository.OrderRepository;
import com.cranberry.marketplace.repository.ProductRepository;
import com.cranberry.marketplace.repository.UserRepository;
import com.cranberry.marketplace.repository.VendorRepository;
import com.cranberry.marketplace.exception.ResourceNotFoundException;
import com.cranberry.marketplace.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public VendorService(VendorRepository vendorRepository, UserRepository userRepository,
                         ProductRepository productRepository, OrderRepository orderRepository) {
        this.vendorRepository = vendorRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Vendor createVendor(VendorRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Check if vendor already exists for this user
        if (vendorRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new BadRequestException("Vendor already exists for this user");
        }

        Vendor vendor = new Vendor();
        vendor.setShopName(request.getShopName());
        vendor.setContactEmail(request.getContactEmail());
        vendor.setContactPhone(request.getContactPhone());
        vendor.setAddress(request.getAddress());
        vendor.setUser(user);
        vendor.setStatus("pending");

        // Update user role to VENDOR
        user.setRole("VENDOR");
        userRepository.save(user);

        return vendorRepository.save(vendor);
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
    }

    public Vendor getVendorByUserId(Long userId) {
        return vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found for user: " + userId));
    }

    @Transactional
    public Vendor updateVendor(Long id, VendorRequest request) {
        Vendor vendor = getVendorById(id);

        if (request.getShopName() != null) {
            vendor.setShopName(request.getShopName());
        }
        if (request.getContactEmail() != null) {
            vendor.setContactEmail(request.getContactEmail());
        }
        if (request.getContactPhone() != null) {
            vendor.setContactPhone(request.getContactPhone());
        }
        if (request.getAddress() != null) {
            vendor.setAddress(request.getAddress());
        }

        return vendorRepository.save(vendor);
    }

    @Transactional
    public Vendor updateVendorStatus(Long id, String status) {
        Vendor vendor = getVendorById(id);
        vendor.setStatus(status);
        return vendorRepository.save(vendor);
    }

    public VendorDashboardResponse getDashboard(Long vendorId) {
        Vendor vendor = getVendorById(vendorId);

        List<Product> products = productRepository.findByVendorId(vendorId);
        int totalProducts = products.size();

        List<Order> orders = orderRepository.findByVendorId(vendorId);
        int totalOrders = orders.size();

        double totalRevenue = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .filter(item -> item.getProduct().getVendor() != null
                        && item.getProduct().getVendor().getId().equals(vendorId))
                .mapToDouble(item -> item.getPrice())
                .sum();

        int pendingOrders = (int) orders.stream()
                .filter(o -> "PENDING".equals(o.getStatus()) || "CREATED".equals(o.getStatus()))
                .count();

        return new VendorDashboardResponse(totalProducts, totalOrders, totalRevenue, pendingOrders, vendor.getStatus());
    }

    public List<Product> getVendorProducts(Long vendorId) {
        return productRepository.findByVendorId(vendorId);
    }

    public List<Order> getVendorOrders(Long vendorId) {
        return orderRepository.findByVendorId(vendorId);
    }
}