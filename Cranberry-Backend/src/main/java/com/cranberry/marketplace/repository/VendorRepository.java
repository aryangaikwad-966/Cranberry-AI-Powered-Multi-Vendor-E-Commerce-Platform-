package com.cranberry.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cranberry.marketplace.model.Vendor;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByUserId(Long userId);

    // Find vendors by status
    List<Vendor> findByStatusIgnoreCase(String status);
}