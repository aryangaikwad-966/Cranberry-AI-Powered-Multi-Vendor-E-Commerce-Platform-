package com.cranberry.marketplace.repository;

import com.cranberry.marketplace.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items oi WHERE oi.product.vendor.id = :vendorId ORDER BY o.createdAt DESC")
    List<Order> findByVendorId(@Param("vendorId") Long vendorId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items oi WHERE oi.product.vendor.id = :vendorId AND o.status = :status")
    List<Order> findByVendorIdAndStatus(@Param("vendorId") Long vendorId, @Param("status") String status);

    // Admin queries
    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByStatus(String status);

    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate ORDER BY o.createdAt DESC")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt >= :startDate AND o.createdAt <= :endDate ORDER BY o.createdAt DESC")
    List<Order> findByStatusAndDateRange(@Param("status") String status,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    // Pagination support
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    // Statistics
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'PAID' OR o.status = 'PROCESSING' OR o.status = 'SHIPPED' OR o.status = 'DELIVERED'")
    Double getTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE (o.status = 'PAID' OR o.status = 'PROCESSING' OR o.status = 'SHIPPED' OR o.status = 'DELIVERED') AND o.createdAt >= :startDate")
    Double getRevenueSince(@Param("startDate") LocalDateTime startDate);
}