package com.cranberry.marketplace.service;

import com.cranberry.marketplace.exception.BadRequestException;
import com.cranberry.marketplace.exception.ResourceNotFoundException;
import com.cranberry.marketplace.model.Order;
import com.cranberry.marketplace.model.OrderStatus;
import com.cranberry.marketplace.model.Payment;
import com.cranberry.marketplace.repository.OrderRepository;
import com.cranberry.marketplace.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final RazorpayClient razorpayClient;
    private final String razorpayKey;
    private final String razorpaySecret;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          @Value("${razorpay.key}") String key,
                          @Value("${razorpay.secret}") String secret) throws RazorpayException {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.razorpayKey = key;
        this.razorpaySecret = secret;
        this.razorpayClient = new RazorpayClient(key, secret);
        logger.info("Razorpay client initialized successfully");
    }

    /**
     * Creates a Razorpay order and stores payment record
     */
    @Transactional
    public Payment createPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // Check if payment already exists for this order
        if (paymentRepository.findByOrderId(orderId).isPresent()) {
            throw new BadRequestException("Payment already initiated for this order");
        }

        // Validate order status
        if (!order.getStatus().equals(OrderStatus.CREATED.name()) && 
            !order.getStatus().equals(OrderStatus.PAYMENT_PENDING.name())) {
            throw new BadRequestException("Order is not eligible for payment. Current status: " + order.getStatus());
        }

        try {
            // Create Razorpay order
            JSONObject options = new JSONObject();
            int amountInPaise = (int) (order.getTotalAmount() * 100);
            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", "order_" + orderId);

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);
            String razorpayOrderId = razorpayOrder.get("id");

            // Create payment record
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setCurrency("INR");
            payment.setStatus("PENDING");
            payment.setRazorpayOrderId(razorpayOrderId);

            // Update order status
            order.setStatus(OrderStatus.PAYMENT_PENDING.name());
            orderRepository.save(order);

            Payment savedPayment = paymentRepository.save(payment);
            logger.info("Payment created: razorpayOrderId={}, orderId={}", razorpayOrderId, orderId);

            return savedPayment;

        } catch (RazorpayException e) {
            logger.error("Failed to create Razorpay order: {}", e.getMessage());
            throw new BadRequestException("Failed to initiate payment: " + e.getMessage());
        }
    }

    /**
     * Verifies Razorpay payment signature and marks payment as successful
     */
    @Transactional
    public Payment verifyAndCompletePayment(String razorpayOrderId,
                                             String razorpayPaymentId,
                                             String razorpaySignature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for razorpayOrderId: " + razorpayOrderId));

        // Verify signature
        boolean isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
            payment.setStatus("FAILED");
            payment.setFailureReason("Invalid payment signature");
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed: Invalid signature");
        }

        // Update payment
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setStatus("PAID");

        // Update order status
        Order order = payment.getOrder();
        order.setStatus(OrderStatus.PAID.name());
        orderRepository.save(order);

        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Payment verified successfully: paymentId={}, orderId={}", razorpayPaymentId, order.getId());

        return savedPayment;
    }

    /**
     * Marks payment as failed
     */
    @Transactional
    public Payment markPaymentFailed(String razorpayOrderId, String reason) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setStatus("FAILED");
        payment.setFailureReason(reason);

        logger.warn("Payment marked as failed: razorpayOrderId={}, reason={}", razorpayOrderId, reason);
        return paymentRepository.save(payment);
    }

    /**
     * Creates a retry payment for failed/cancelled payments
     */
    @Transactional
    public Payment retryPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Delete existing failed payment if exists
        paymentRepository.findByOrderId(orderId).ifPresent(existingPayment -> {
            if ("FAILED".equals(existingPayment.getStatus()) || "PENDING".equals(existingPayment.getStatus())) {
                paymentRepository.delete(existingPayment);
            } else if ("PAID".equals(existingPayment.getStatus())) {
                throw new BadRequestException("Payment already completed for this order");
            }
        });

        // Reset order status if needed
        if (order.getStatus().equals(OrderStatus.PAYMENT_PENDING.name())) {
            order.setStatus(OrderStatus.CREATED.name());
            orderRepository.save(order);
        }

        return createPayment(orderId);
    }

    /**
     * Get payment by order ID
     */
    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
    }

    /**
     * Get Razorpay key for frontend
     */
    public String getRazorpayKey() {
        return razorpayKey;
    }

    /**
     * Verify Razorpay payment signature using HMAC SHA256
     */
    private boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    razorpaySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            String generatedSignature = bytesToHex(hash);
            
            boolean isValid = generatedSignature.equals(razorpaySignature);
            
            if (!isValid) {
                logger.warn("Signature mismatch: expected={}, received={}", generatedSignature, razorpaySignature);
            }
            
            return isValid;
        } catch (Exception e) {
            logger.error("Error verifying signature: {}", e.getMessage());
            return false;
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}