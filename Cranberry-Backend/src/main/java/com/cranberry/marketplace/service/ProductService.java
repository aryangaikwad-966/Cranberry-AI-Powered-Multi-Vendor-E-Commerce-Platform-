package com.cranberry.marketplace.service;

import com.cranberry.marketplace.exception.ResourceNotFoundException;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getProductsByVendor(Long vendorId) {
        return productRepository.findByVendorId(vendorId);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<String> getAllCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .filter(c -> c != null && !c.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Product updateProduct(Long id, Product updated) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (updated.getName() != null) {
            product.setName(updated.getName());
        }
        if (updated.getPrice() > 0) {
            product.setPrice(updated.getPrice());
        }
        if (updated.getStock() >= 0) {
            product.setStock(updated.getStock());
        }
        if (updated.getDescription() != null) {
            product.setDescription(updated.getDescription());
        }
        if (updated.getImageUrl() != null) {
            product.setImageUrl(updated.getImageUrl());
        }
        if (updated.getCategory() != null) {
            product.setCategory(updated.getCategory());
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<Product> getFilteredProducts(String category, String search, Double minPrice,
                                              Double maxPrice, Boolean featured, Integer limit) {
        List<Product> products = productRepository.findAll().stream()
                .filter(p -> (p.getVendor() == null || "approved".equalsIgnoreCase(p.getVendor().getStatus()) || "active".equalsIgnoreCase(p.getVendor().getStatus()))
                             && "active".equalsIgnoreCase(p.getStatus()))
                .collect(Collectors.toList());

        // Filter by search query
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            products = products.stream()
                    .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(searchLower)) ||
                                 (p.getDescription() != null && p.getDescription().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }

        // Filter by category
        if (category != null && !category.isEmpty()) {
            products = products.stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        // Filter by price range
        if (minPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() >= minPrice)
                    .collect(Collectors.toList());
        }
        if (maxPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        // Filter by featured (for now, use stock > 0 as featured indicator)
        if (featured != null && featured) {
            products = products.stream()
                    .filter(p -> p.getStock() > 10) // Products with good stock as "featured"
                    .collect(Collectors.toList());
        }

        // Apply limit
        if (limit != null && limit > 0) {
            products = products.stream()
                    .limit(limit)
                    .collect(Collectors.toList());
        }

        return products;
    }
}