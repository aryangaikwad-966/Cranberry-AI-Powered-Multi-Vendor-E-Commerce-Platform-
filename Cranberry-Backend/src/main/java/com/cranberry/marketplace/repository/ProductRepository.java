package com.cranberry.marketplace.repository;

import com.cranberry.marketplace.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByVendorId(Long vendorId);

    List<Product> findByNameContainingIgnoreCase(String keyword);

    List<Product> findByCategoryIgnoreCase(String category);

    // Search by name or description containing keyword
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(@Param("keyword") String keyword);

    // Search with price range
    @Query("SELECT p FROM Product p WHERE (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> searchByKeywordAndPriceRange(@Param("keyword") String keyword, @Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice);

    // Search by category with price range
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) LIKE LOWER(CONCAT('%', :category, '%')) AND p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByCategoryAndPriceRange(@Param("category") String category, @Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice);

    // Find products in price range
    List<Product> findByPriceBetween(double minPrice, double maxPrice);

    // Find products by multiple IDs
    List<Product> findByIdIn(List<Long> ids);

    // Get distinct categories
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL")
    List<String> findAllCategories();

    // Find top products by category (for recommendations)
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category) ORDER BY p.id DESC")
    List<Product> findTopByCategory(@Param("category") String category);

    // Find similar products (same category, excluding given product)
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.id != :productId")
    List<Product> findSimilarProducts(@Param("category") String category, @Param("productId") Long productId);
}