package com.cranberry.marketplace.service;

import com.cranberry.marketplace.dto.OrderRequest;
import com.cranberry.marketplace.exception.BadRequestException;
import com.cranberry.marketplace.exception.ResourceNotFoundException;
import com.cranberry.marketplace.model.*;
import com.cranberry.marketplace.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Product testProduct;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(100.0);
        testProduct.setStock(10);

        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setUser(testUser);
        testOrder.setStatus(OrderStatus.CREATED.name());
        testOrder.setTotalAmount(200.0);
        testOrder.setItems(new ArrayList<>());
    }

    @Test
    @DisplayName("Happy Path: Create order successfully with stock deduction")
    void createOrder_Success_DeductsStock() {
        // Arrange
        OrderRequest request = new OrderRequest();
        request.setUserId(1L);
        request.setShippingAddress("123 Test Street");

        OrderRequest.OrderItemRequest itemRequest = new OrderRequest.OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(2);
        request.setItems(List.of(itemRequest));

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(1L);
            return order;
        });
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());

        // Act
        Order result = orderService.createOrder(request);

        // Assert
        assertNotNull(result);
        assertEquals(OrderStatus.CREATED.name(), result.getStatus());
        assertEquals(200.0, result.getTotalAmount()); // 100 * 2
        assertEquals(8, testProduct.getStock()); // 10 - 2
        verify(productRepository).save(testProduct);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    @DisplayName("Failure: Insufficient stock throws BadRequestException")
    void createOrder_InsufficientStock_ThrowsException() {
        // Arrange
        testProduct.setStock(1); // Only 1 in stock

        OrderRequest request = new OrderRequest();
        request.setUserId(1L);
        request.setShippingAddress("123 Test Street");

        OrderRequest.OrderItemRequest itemRequest = new OrderRequest.OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(5); // Requesting 5
        request.setItems(List.of(itemRequest));

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> orderService.createOrder(request)
        );

        assertTrue(exception.getMessage().contains("Insufficient stock"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("State Transition: Invalid transition from DELIVERED to PROCESSING throws exception")
    void updateOrderStatus_InvalidTransition_ThrowsException() {
        // Arrange
        testOrder.setStatus(OrderStatus.DELIVERED.name());
        OrderItem item = new OrderItem();
        item.setProduct(testProduct);
        item.setQuantity(1);
        testOrder.getItems().add(item);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> orderService.updateOrderStatus(1L, OrderStatus.PROCESSING.name())
        );

        assertTrue(exception.getMessage().contains("Invalid status transition"));
    }
}
