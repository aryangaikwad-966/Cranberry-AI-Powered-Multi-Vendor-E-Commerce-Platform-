package com.cranberry.marketplace.controller;

import com.cranberry.marketplace.dto.ApiResponse;
import com.cranberry.marketplace.dto.PaymentResponse;
import com.cranberry.marketplace.model.Payment;
import com.cranberry.marketplace.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Create a Razorpay order for the given order ID
     * Returns payment details including razorpayOrderId for frontend checkout
     */
    @PostMapping("/create/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@PathVariable Long orderId) {
        Payment payment = paymentService.createPayment(orderId);
        PaymentResponse response = new PaymentResponse(
                payment.getId(),
                payment.getRazorpayOrderId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                paymentService.getRazorpayKey()
        );
        return ResponseEntity.ok(ApiResponse.success("Payment initiated", response));
    }

    /**
     * Verify Razorpay payment after successful checkout
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Payment>> verifyPayment(
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature) {
        Payment payment = paymentService.verifyAndCompletePayment(
                razorpayOrderId, razorpayPaymentId, razorpaySignature);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", payment));
    }

    /**
     * Handle payment failure callback
     */
    @PostMapping("/failure")
    public ResponseEntity<ApiResponse<Payment>> paymentFailed(
            @RequestParam String razorpayOrderId,
            @RequestParam(required = false) String reason) {
        Payment payment = paymentService.markPaymentFailed(
                razorpayOrderId, 
                reason != null ? reason : "Payment failed or cancelled by user");
        return ResponseEntity.ok(ApiResponse.success("Payment failure recorded", payment));
    }

    /**
     * Retry payment for a failed order
     */
    @PostMapping("/retry/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> retryPayment(@PathVariable Long orderId) {
        Payment payment = paymentService.retryPayment(orderId);
        PaymentResponse response = new PaymentResponse(
                payment.getId(),
                payment.getRazorpayOrderId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                paymentService.getRazorpayKey()
        );
        return ResponseEntity.ok(ApiResponse.success("Payment retry initiated", response));
    }

    /**
     * Get payment details by order ID
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentByOrder(@PathVariable Long orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    /**
     * Get Razorpay configuration for frontend
     */
    @GetMapping("/config")
    public ResponseEntity<ApiResponse<Map<String, String>>> getPaymentConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("key", paymentService.getRazorpayKey());
        config.put("currency", "INR");
        config.put("name", "Cranberry Marketplace");
        config.put("description", "Premium E-Commerce Platform");
        return ResponseEntity.ok(ApiResponse.success(config));
    }
}