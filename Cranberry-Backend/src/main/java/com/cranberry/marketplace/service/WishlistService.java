package com.cranberry.marketplace.service;

import com.cranberry.marketplace.dto.WishlistItemRequest;
import com.cranberry.marketplace.dto.WishlistResponse;
import com.cranberry.marketplace.dto.WishlistResponse.WishlistItemDto;
import com.cranberry.marketplace.exception.BadRequestException;
import com.cranberry.marketplace.exception.ResourceNotFoundException;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.model.Wishlist;
import com.cranberry.marketplace.model.WishlistItem;
import com.cranberry.marketplace.repository.ProductRepository;
import com.cranberry.marketplace.repository.UserRepository;
import com.cranberry.marketplace.repository.WishlistItemRepository;
import com.cranberry.marketplace.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public WishlistResponse getWishlist(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        return toWishlistResponse(wishlist);
    }

    @Transactional
    public WishlistResponse addToWishlist(Long userId, WishlistItemRequest request) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Check if item already exists in wishlist
        if (wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), request.getProductId())) {
            throw new BadRequestException("Product already in wishlist");
        }

        WishlistItem newItem = new WishlistItem();
        newItem.setProduct(product);
        wishlist.addItem(newItem);
        wishlistRepository.save(wishlist);

        return getWishlist(userId);
    }

    @Transactional
    public WishlistResponse removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);

        WishlistItem item = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in wishlist"));

        wishlist.removeItem(item);
        wishlistItemRepository.delete(item);

        return getWishlist(userId);
    }

    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                    Wishlist newWishlist = new Wishlist();
                    newWishlist.setUser(user);
                    return wishlistRepository.save(newWishlist);
                });
    }

    private WishlistResponse toWishlistResponse(Wishlist wishlist) {
        List<WishlistItemDto> items = wishlist.getItems().stream()
                .map(item -> {
                    Product product = item.getProduct();
                    String vendorName = product.getVendor() != null ? product.getVendor().getShopName() : null;
                    return new WishlistItemDto(
                            item.getId(),
                            product.getId(),
                            product.getName(),
                            product.getPrice(),
                            product.getImageUrl(),
                            vendorName
                    );
                })
                .collect(Collectors.toList());

        return new WishlistResponse(items);
    }
}
