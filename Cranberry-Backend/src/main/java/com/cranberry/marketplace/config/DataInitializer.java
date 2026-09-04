package com.cranberry.marketplace.config;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.cranberry.marketplace.model.Cart;
import com.cranberry.marketplace.model.Product;
import com.cranberry.marketplace.model.User;
import com.cranberry.marketplace.model.Vendor;
import com.cranberry.marketplace.model.Wishlist;
import com.cranberry.marketplace.repository.CartRepository;
import com.cranberry.marketplace.repository.ProductRepository;
import com.cranberry.marketplace.repository.UserRepository;
import com.cranberry.marketplace.repository.VendorRepository;
import com.cranberry.marketplace.repository.WishlistRepository;

/**
 * Data Initializer - Seeds the database with sample data on startup
 * Runs only in the explicit demo profile; production databases are never seeded.
 */
@Configuration
public class DataInitializer {

    @Bean
    @Profile("demo")
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            VendorRepository vendorRepository,
            ProductRepository productRepository,
            CartRepository cartRepository,
            WishlistRepository wishlistRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // Check if products exist (more specific than users)
            if (productRepository.count() > 0) {
                System.out.println("📦 Database already has " + productRepository.count() + " products, skipping seed...");
                return;
            }

            System.out.println("🌱 Seeding demo database with sample data...");

            // ============ CREATE USERS ============
            // Admin
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@cranberry.com");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole("ADMIN");
            admin.setAvatar("https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=fff");
            admin = userRepository.save(admin);

            // Vendor Users
            User vendorUser1 = new User();
            vendorUser1.setName("TechVista Electronics");
            vendorUser1.setEmail("techvista@cranberry.com");
            vendorUser1.setPassword(passwordEncoder.encode("password"));
            vendorUser1.setRole("VENDOR");
            vendorUser1.setAvatar("https://ui-avatars.com/api/?name=TechVista&background=2563eb&color=fff");
            vendorUser1 = userRepository.save(vendorUser1);

            User vendorUser2 = new User();
            vendorUser2.setName("UrbanStyle Co.");
            vendorUser2.setEmail("urbanstyle@cranberry.com");
            vendorUser2.setPassword(passwordEncoder.encode("password"));
            vendorUser2.setRole("VENDOR");
            vendorUser2.setAvatar("https://ui-avatars.com/api/?name=UrbanStyle&background=7c3aed&color=fff");
            vendorUser2 = userRepository.save(vendorUser2);

            User vendorUser3 = new User();
            vendorUser3.setName("HomeEssentials Plus");
            vendorUser3.setEmail("homeessentials@cranberry.com");
            vendorUser3.setPassword(passwordEncoder.encode("password"));
            vendorUser3.setRole("VENDOR");
            vendorUser3.setAvatar("https://ui-avatars.com/api/?name=HomeEssentials&background=059669&color=fff");
            vendorUser3 = userRepository.save(vendorUser3);

            User vendorUser4 = new User();
            vendorUser4.setName("GlowBeauty");
            vendorUser4.setEmail("glowbeauty@cranberry.com");
            vendorUser4.setPassword(passwordEncoder.encode("password"));
            vendorUser4.setRole("VENDOR");
            vendorUser4.setAvatar("https://ui-avatars.com/api/?name=GlowBeauty&background=db2777&color=fff");
            vendorUser4 = userRepository.save(vendorUser4);

            // Customer Users
            User customer1 = new User();
            customer1.setName("Aryan Gaikwad");
            customer1.setEmail("aryan@example.com");
            customer1.setPassword(passwordEncoder.encode("password"));
            customer1.setRole("CUSTOMER");
            customer1.setAvatar("https://ui-avatars.com/api/?name=Aryan+Gaikwad&background=6366f1&color=fff");
            customer1 = userRepository.save(customer1);

            User customer2 = new User();
            customer2.setName("Priya Sharma");
            customer2.setEmail("priya@example.com");
            customer2.setPassword(passwordEncoder.encode("password"));
            customer2.setRole("CUSTOMER");
            customer2.setAvatar("https://ui-avatars.com/api/?name=Priya+Sharma&background=ec4899&color=fff");
            customer2 = userRepository.save(customer2);

            // ============ CREATE VENDORS ============
            Vendor vendor1 = new Vendor();
            vendor1.setUser(vendorUser1);
            vendor1.setShopName("TechVista Electronics");
            vendor1.setContactEmail("techvista@cranberry.com");
            vendor1.setContactPhone("+91-98765-43210");
            vendor1.setAddress("Electronic City, Bengaluru, Karnataka 560100");
            vendor1.setStatus("APPROVED");
            vendor1.setLogo("https://images.unsplash.com/photo-1518770660439-4636190af475?w=200");
            vendor1.setJoinedAt(LocalDateTime.now());
            vendor1 = vendorRepository.save(vendor1);

            Vendor vendor2 = new Vendor();
            vendor2.setUser(vendorUser2);
            vendor2.setShopName("UrbanStyle Co.");
            vendor2.setContactEmail("urbanstyle@cranberry.com");
            vendor2.setContactPhone("+91-98765-43211");
            vendor2.setAddress("Linking Road, Bandra, Mumbai 400050");
            vendor2.setStatus("APPROVED");
            vendor2.setLogo("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200");
            vendor2.setJoinedAt(LocalDateTime.now());
            vendor2 = vendorRepository.save(vendor2);

            Vendor vendor3 = new Vendor();
            vendor3.setUser(vendorUser3);
            vendor3.setShopName("HomeEssentials Plus");
            vendor3.setContactEmail("homeessentials@cranberry.com");
            vendor3.setContactPhone("+91-98765-43212");
            vendor3.setAddress("Connaught Place, New Delhi 110001");
            vendor3.setStatus("APPROVED");
            vendor3.setLogo("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200");
            vendor3.setJoinedAt(LocalDateTime.now());
            vendor3 = vendorRepository.save(vendor3);

            Vendor vendor4 = new Vendor();
            vendor4.setUser(vendorUser4);
            vendor4.setShopName("GlowBeauty");
            vendor4.setContactEmail("glowbeauty@cranberry.com");
            vendor4.setContactPhone("+91-98765-43213");
            vendor4.setAddress("Phoenix Mall, Pune, Maharashtra 411014");
            vendor4.setStatus("APPROVED");
            vendor4.setLogo("https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200");
            vendor4.setJoinedAt(LocalDateTime.now());
            vendor4 = vendorRepository.save(vendor4);

            // ============ CREATE PRODUCTS ============
            // TechVista Electronics Products
            List<Product> techProducts = List.of(
                createProduct("MacBook Air M2", "Supercharged by M2 chip. Strikingly thin design. 13.6-inch Liquid Retina display. Up to 18 hours battery life.", 49999.00, 25, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", "Electronics", vendor1),
                createProduct("Sony WH-1000XM5 Headphones", "Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling. 30-hour battery.", 24999.00, 50, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", "Electronics", vendor1),
                createProduct("iPhone 15 Pro", "Titanium design. A17 Pro chip. 48MP camera system. Action button.", 44999.00, 40, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800", "Electronics", vendor1),
                createProduct("Samsung 43\" Crystal UHD TV", "Crystal Processor 4K. Smart TV with Tizen OS. HDR support. PurColor technology.", 32999.00, 15, "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800", "Electronics", vendor1),
                createProduct("Apple Watch SE", "Essential features at an accessible price. Fitness tracking, heart rate monitoring, crash detection.", 29999.00, 35, "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800", "Electronics", vendor1)
            );
            productRepository.saveAll(techProducts);

            // UrbanStyle Fashion Products
            List<Product> fashionProducts = List.of(
                createProduct("Nike Air Max 270 React", "Comfort meets style with Nike Air Max cushioning and React foam technology. Breathable mesh upper.", 12999.00, 100, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", "Fashion", vendor2),
                createProduct("Levi's 501 Original Jeans", "The original blue jean since 1873. Signature straight leg with button fly. 100% cotton denim.", 3999.00, 75, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800", "Fashion", vendor2),
                createProduct("Ray-Ban Aviator Classic", "Iconic aviator style with crystal green G-15 lenses. Gold-tone metal frame. UV protection.", 8999.00, 60, "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800", "Fashion", vendor2),
                createProduct("Wildcraft Puffer Jacket", "Lightweight warmth with premium synthetic insulation. Water-resistant outer shell. Packable design.", 5999.00, 45, "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", "Fashion", vendor2),
                createProduct("Adidas Ultraboost 23", "Energy-returning BOOST midsole for endless comfort. Primeknit+ upper. Continental rubber outsole.", 14999.00, 80, "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800", "Fashion", vendor2)
            );
            productRepository.saveAll(fashionProducts);

            // HomeEssentials Products
            List<Product> homeProducts = List.of(
                createProduct("Dyson V12 Slim Vacuum", "Intelligently optimizes suction power with laser dust detection. Up to 60 minutes runtime.", 35999.00, 30, "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800", "Home & Living", vendor3),
                createProduct("Borosil Stand Mixer", "Professional-grade stand mixer with 5L stainless steel bowl. 10 speeds. Multiple attachments included.", 12999.00, 25, "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800", "Home & Living", vendor3),
                createProduct("Nespresso Vertuo Plus", "Barista-grade coffee at the touch of a button. Centrifusion technology. Includes welcome kit.", 14999.00, 55, "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800", "Home & Living", vendor3),
                createProduct("Ergonomic Office Chair", "Premium mesh back with adjustable lumbar support. 4D armrests. Breathable design for all-day comfort.", 18999.00, 10, "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800", "Home & Living", vendor3),
                createProduct("Philips Hue Starter Kit", "Smart lighting that sets the mood. 3 color bulbs + bridge. Voice control compatible.", 9999.00, 40, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", "Home & Living", vendor3)
            );
            productRepository.saveAll(homeProducts);

            // GlowBeauty Products
            List<Product> beautyProducts = List.of(
                createProduct("Neutrogena Hydro Boost Gel", "Hydrating water gel with hyaluronic acid. Oil-free formula for supple, smooth skin. 50g.", 899.00, 45, "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800", "Beauty", vendor4),
                createProduct("Dyson Airwrap Complete", "Style with air, not extreme heat. Multiple attachments for different hair types. Long version included.", 44999.00, 20, "https://images.unsplash.com/photo-1522338242042-2d1c40dc41e0?w=800", "Beauty", vendor4),
                createProduct("Lakme Absolute Set", "Complete makeup essentials kit. Includes primer, foundation, lipstick, and setting spray.", 2499.00, 90, "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800", "Beauty", vendor4),
                createProduct("Forest Essentials Face Serum", "Ayurvedic night repair serum with kumkumadi oil. For radiant, glowing skin. 30ml.", 2999.00, 35, "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800", "Beauty", vendor4),
                createProduct("Park Avenue Perfume", "Long-lasting fragrance with woody and citrus notes. Premium Eau de Parfum. 100ml.", 1299.00, 50, "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800", "Beauty", vendor4)
            );
            productRepository.saveAll(beautyProducts);

            // ============ CREATE CARTS & WISHLISTS FOR CUSTOMERS ============
            Cart cart1 = new Cart();
            cart1.setUser(customer1);
            cartRepository.save(cart1);

            Cart cart2 = new Cart();
            cart2.setUser(customer2);
            cartRepository.save(cart2);

            Wishlist wishlist1 = new Wishlist();
            wishlist1.setUser(customer1);
            wishlistRepository.save(wishlist1);

            Wishlist wishlist2 = new Wishlist();
            wishlist2.setUser(customer2);
            wishlistRepository.save(wishlist2);

            System.out.println("✅ Database seeded successfully!");
            System.out.println("   - Users: " + userRepository.count());
            System.out.println("   - Vendors: " + vendorRepository.count());
            System.out.println("   - Products: " + productRepository.count());
        };
    }

    private Product createProduct(String name, String description, Double price, Integer stock, String imageUrl, String category, Vendor vendor) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setImageUrl(imageUrl);
        product.setCategory(category);
        product.setVendor(vendor);
        product.setStatus("approved");
        return product;
    }
}
