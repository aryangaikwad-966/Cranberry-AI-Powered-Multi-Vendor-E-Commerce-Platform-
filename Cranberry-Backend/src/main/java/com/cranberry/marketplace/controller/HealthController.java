package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());

        // Check database connectivity
        try (Connection connection = dataSource.getConnection()) {
            health.put("database", connection.isValid(2) ? "connected" : "disconnected");
        } catch (Exception e) {
            health.put("database", "error: " + e.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.success(health));
    }
}
