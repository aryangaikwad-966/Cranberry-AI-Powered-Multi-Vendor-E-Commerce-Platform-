-- ============================================================
-- 🍒 CRANBERRY MARKETPLACE - MySQL/MariaDB Database Setup
-- ============================================================
-- Generated from Backend JPA Entity Analysis
-- Compatible with: MySQL 8.0+ / MariaDB 10.5+
-- Last Updated: February 2026
-- All prices in INR (Indian Rupees) - Razorpay Compatible
-- ============================================================

-- ============================================================
-- 1. DATABASE CREATION
-- ============================================================

CREATE DATABASE IF NOT EXISTS cranberry_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE cranberry_db;

-- ============================================================
-- 2. DROP EXISTING TABLES (Clean Slate)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS vendor;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 3. USERS TABLE
-- ============================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    google_id VARCHAR(255) UNIQUE,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. VENDOR TABLE  
-- ============================================================

CREATE TABLE vendor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shop_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    logo_url VARCHAR(500),
    joined_at TIMESTAMP,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_vendor_status (status),
    INDEX idx_vendor_shop_name (shop_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. PRODUCT TABLE
-- ============================================================

CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    vendor_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_vendor FOREIGN KEY (vendor_id) REFERENCES vendor(id) ON DELETE CASCADE,
    INDEX idx_product_category (category),
    INDEX idx_product_vendor (vendor_id),
    INDEX idx_product_status (status),
    INDEX idx_product_name (name(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. ORDERS TABLE
-- ============================================================

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_amount DOUBLE NOT NULL,
    status VARCHAR(30) DEFAULT 'CREATED',
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    estimated_delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. ORDER_ITEM TABLE
-- ============================================================

CREATE TABLE order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL,
    INDEX idx_orderitem_order (order_id),
    INDEX idx_orderitem_product (product_id),
    INDEX idx_orderitem_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. PAYMENTS TABLE
-- ============================================================

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    razorpay_order_id VARCHAR(100) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount DOUBLE NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED',
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    order_id BIGINT NOT NULL,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_payment_status (status),
    INDEX idx_payment_razorpay_order (razorpay_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. CARTS TABLE
-- ============================================================

CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. CART_ITEMS TABLE
-- ============================================================

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL DEFAULT 1,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    UNIQUE KEY uk_cart_product (cart_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. WISHLISTS TABLE
-- ============================================================

CREATE TABLE wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. WISHLIST_ITEMS TABLE
-- ============================================================

CREATE TABLE wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wishlist_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlistitem_wishlist FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlistitem_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    UNIQUE KEY uk_wishlist_product (wishlist_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- ============================================================
--                    SAMPLE DATA INSERTION
-- ============================================================
-- ============================================================

-- ============================================================
-- USERS (Password: password for all - BCrypt encoded)
-- ============================================================

INSERT INTO users (name, email, password, role, avatar) VALUES
-- Admin
('Admin User', 'admin@cranberry.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN', 'https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=fff'),

-- Vendors
('TechVista Electronics', 'techvista@cranberry.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'VENDOR', 'https://ui-avatars.com/api/?name=TechVista&background=2563eb&color=fff'),
('UrbanStyle Co.', 'urbanstyle@cranberry.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'VENDOR', 'https://ui-avatars.com/api/?name=UrbanStyle&background=7c3aed&color=fff'),
('HomeEssentials Plus', 'homeessentials@cranberry.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'VENDOR', 'https://ui-avatars.com/api/?name=HomeEssentials&background=059669&color=fff'),
('GlowBeauty', 'glowbeauty@cranberry.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'VENDOR', 'https://ui-avatars.com/api/?name=GlowBeauty&background=db2777&color=fff'),

-- Customers
('Aryan Gaikwad', 'aryan@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'CUSTOMER', 'https://ui-avatars.com/api/?name=Aryan+Gaikwad&background=6366f1&color=fff'),
('Priya Sharma', 'priya@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'CUSTOMER', 'https://ui-avatars.com/api/?name=Priya+Sharma&background=ec4899&color=fff'),
('Rahul Verma', 'rahul@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'CUSTOMER', 'https://ui-avatars.com/api/?name=Rahul+Verma&background=14b8a6&color=fff');

-- ============================================================
-- VENDORS (Linked to VENDOR users)
-- ============================================================

INSERT INTO vendor (user_id, shop_name, contact_email, contact_phone, address, status, logo_url, joined_at) VALUES
(2, 'TechVista Electronics', 'techvista@cranberry.com', '+91-98765-43210', 'Electronic City, Bengaluru, Karnataka 560100', 'APPROVED', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', NOW()),
(3, 'UrbanStyle Co.', 'urbanstyle@cranberry.com', '+91-98765-43211', 'Linking Road, Bandra, Mumbai 400050', 'APPROVED', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200', NOW()),
(4, 'HomeEssentials Plus', 'homeessentials@cranberry.com', '+91-98765-43212', 'Connaught Place, New Delhi 110001', 'APPROVED', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', NOW()),
(5, 'GlowBeauty', 'glowbeauty@cranberry.com', '+91-98765-43213', 'Phoenix Mall, Pune, Maharashtra 411014', 'APPROVED', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200', NOW());

-- ============================================================
-- PRODUCTS - All prices in INR (Indian Rupees)
-- Realistic Indian market prices, Razorpay test-friendly
-- ============================================================

INSERT INTO product (name, description, price, stock, image_url, category, vendor_id, status) VALUES
-- TechVista Electronics (vendor_id = 1)
('MacBook Air M2', 'Supercharged by M2 chip. Strikingly thin design. 13.6-inch Liquid Retina display. Up to 18 hours battery life.', 49999.00, 25, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Electronics', 1, 'approved'),
('Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling. 30-hour battery.', 24999.00, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Electronics', 1, 'approved'),
('iPhone 15 Pro', 'Titanium design. A17 Pro chip. 48MP camera system. Action button.', 44999.00, 40, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'Electronics', 1, 'approved'),
('Samsung 43" Crystal UHD TV', 'Crystal Processor 4K. Smart TV with Tizen OS. HDR support. PurColor technology.', 32999.00, 15, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800', 'Electronics', 1, 'approved'),
('Apple Watch SE', 'Essential features at an accessible price. Fitness tracking, heart rate monitoring, crash detection.', 29999.00, 35, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800', 'Electronics', 1, 'approved'),

-- UrbanStyle Co. (vendor_id = 2)
('Nike Air Max 270 React', 'Comfort meets style with Nike Air Max cushioning and React foam technology. Breathable mesh upper.', 12999.00, 100, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Fashion', 2, 'approved'),
('Levi''s 501 Original Jeans', 'The original blue jean since 1873. Signature straight leg with button fly. 100% cotton denim.', 3999.00, 75, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'Fashion', 2, 'approved'),
('Ray-Ban Aviator Classic', 'Iconic aviator style with crystal green G-15 lenses. Gold-tone metal frame. UV protection.', 8999.00, 60, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', 'Fashion', 2, 'approved'),
('Wildcraft Puffer Jacket', 'Lightweight warmth with premium synthetic insulation. Water-resistant outer shell. Packable design.', 5999.00, 45, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'Fashion', 2, 'approved'),
('Adidas Ultraboost 23', 'Energy-returning BOOST midsole for endless comfort. Primeknit+ upper. Continental rubber outsole.', 14999.00, 80, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', 'Fashion', 2, 'approved'),

-- HomeEssentials Plus (vendor_id = 3)
('Dyson V12 Slim Vacuum', 'Intelligently optimizes suction power with laser dust detection. Up to 60 minutes runtime.', 35999.00, 30, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800', 'Home & Living', 3, 'approved'),
('Borosil Stand Mixer', 'Professional-grade stand mixer with 5L stainless steel bowl. 10 speeds. Multiple attachments included.', 12999.00, 25, 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800', 'Home & Living', 3, 'approved'),
('Nespresso Vertuo Plus', 'Barista-grade coffee at the touch of a button. Centrifusion technology. Includes welcome kit.', 14999.00, 55, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800', 'Home & Living', 3, 'approved'),
('Ergonomic Office Chair', 'Premium mesh back with adjustable lumbar support. 4D armrests. Breathable design for all-day comfort.', 18999.00, 10, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', 'Home & Living', 3, 'approved'),
('Philips Hue Starter Kit', 'Smart lighting that sets the mood. 3 color bulbs + bridge. Voice control compatible.', 9999.00, 40, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Home & Living', 3, 'approved'),

-- GlowBeauty (vendor_id = 4)
('Neutrogena Hydro Boost Gel', 'Hydrating water gel with hyaluronic acid. Oil-free formula for supple, smooth skin. 50g.', 899.00, 45, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', 'Beauty', 4, 'approved'),
('Dyson Airwrap Complete', 'Style with air, not extreme heat. Multiple attachments for different hair types. Long version included.', 44999.00, 20, 'https://images.unsplash.com/photo-1522338242042-2d1c40dc41e0?w=800', 'Beauty', 4, 'approved'),
('Lakme Absolute Set', 'Complete makeup essentials kit. Includes primer, foundation, lipstick, and setting spray.', 2499.00, 90, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'Beauty', 4, 'approved'),
('Forest Essentials Face Serum', 'Ayurvedic night repair serum with kumkumadi oil. For radiant, glowing skin. 30ml.', 2999.00, 35, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800', 'Beauty', 4, 'approved'),
('Park Avenue Perfume', 'Long-lasting fragrance with woody and citrus notes. Premium Eau de Parfum. 100ml.', 1299.00, 50, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', 'Beauty', 4, 'approved');

-- ============================================================
-- CREATE CARTS FOR CUSTOMERS
-- ============================================================

INSERT INTO carts (user_id) VALUES
(6),  -- Aryan
(7),  -- Priya
(8);  -- Rahul

-- ============================================================
-- CREATE WISHLISTS FOR CUSTOMERS
-- ============================================================

INSERT INTO wishlists (user_id) VALUES
(6),  -- Aryan
(7),  -- Priya
(8);  -- Rahul

-- ============================================================
-- SAMPLE CART ITEMS
-- ============================================================

INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 1),   -- Aryan: MacBook Air M2
(1, 6, 2),   -- Aryan: Nike Air Max (2 pairs)
(2, 16, 1),  -- Priya: Neutrogena Gel
(2, 17, 1),  -- Priya: Dyson Airwrap
(3, 11, 1);  -- Rahul: Dyson Vacuum

-- ============================================================
-- SAMPLE WISHLIST ITEMS
-- ============================================================

INSERT INTO wishlist_items (wishlist_id, product_id) VALUES
(1, 3),   -- Aryan: iPhone 15 Pro
(1, 14),  -- Aryan: Ergonomic Chair
(2, 1),   -- Priya: MacBook Air M2
(2, 5),   -- Priya: Apple Watch SE
(3, 2),   -- Rahul: Sony Headphones
(3, 12);  -- Rahul: Stand Mixer

-- ============================================================
-- SAMPLE ORDERS (All amounts in INR)
-- ============================================================

INSERT INTO orders (user_id, total_amount, status, shipping_address, tracking_number, estimated_delivery_date, created_at) VALUES
-- Aryan's orders
(6, 88598.00, 'DELIVERED', '123 MG Road, Koregaon Park, Pune 411001', 'TRK-001-2026-A1B2C3', '2026-01-25', '2026-01-15 10:30:00'),
(6, 30997.00, 'SHIPPED', '123 MG Road, Koregaon Park, Pune 411001', 'TRK-002-2026-D4E5F6', '2026-02-05', '2026-01-28 14:20:00'),

-- Priya's orders
(7, 53198.00, 'PROCESSING', '456 Bandra West, Mumbai 400050', NULL, NULL, '2026-01-30 09:15:00'),
(7, 12999.00, 'PAID', '456 Bandra West, Mumbai 400050', NULL, NULL, '2026-02-01 11:45:00'),

-- Rahul's order
(8, 42478.00, 'CREATED', '789 Indiranagar, Bengaluru 560038', NULL, NULL, '2026-02-01 16:00:00');

-- ============================================================
-- SAMPLE ORDER ITEMS (Prices in INR)
-- ============================================================

INSERT INTO order_item (order_id, product_id, quantity, price, status) VALUES
-- Order 1 (Aryan - Delivered): MacBook Air + Sony Headphones
(1, 1, 1, 49999.00, 'DELIVERED'),  -- MacBook Air M2
(1, 2, 1, 24999.00, 'DELIVERED'),  -- Sony Headphones

-- Order 2 (Aryan - Shipped): Fashion items from UrbanStyle
(2, 6, 2, 12999.00, 'SHIPPED'),    -- Nike Air Max x2
(2, 7, 1, 3999.00, 'SHIPPED'),     -- Levi's Jeans

-- Order 3 (Priya - Processing): Beauty products from GlowBeauty
(3, 16, 1, 899.00, 'PROCESSING'),  -- Neutrogena Gel
(3, 17, 1, 44999.00, 'PENDING'),   -- Dyson Airwrap

-- Order 4 (Priya - Paid): Fashion from UrbanStyle
(4, 6, 1, 12999.00, 'PENDING'),    -- Nike Air Max

-- Order 5 (Rahul - Just created): Home items
(5, 11, 1, 35999.00, 'PENDING'),   -- Dyson Vacuum
(5, 8, 1, 8999.00, 'PENDING');     -- Ray-Ban Sunglasses (different vendor)

-- ============================================================
-- SAMPLE PAYMENTS (All amounts in INR)
-- ============================================================

INSERT INTO payments (order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, status, created_at) VALUES
(1, 'order_AryanOrder1ABC', 'pay_AryanPay1XYZ', 'sig_aryan1signature', 88598.00, 'INR', 'PAID', '2026-01-15 10:35:00'),
(2, 'order_AryanOrder2DEF', 'pay_AryanPay2XYZ', 'sig_aryan2signature', 30997.00, 'INR', 'PAID', '2026-01-28 14:25:00'),
(3, 'order_PriyaOrder1GHI', 'pay_PriyaPay1XYZ', 'sig_priya1signature', 53198.00, 'INR', 'PAID', '2026-01-30 09:20:00'),
(4, 'order_PriyaOrder2JKL', 'pay_PriyaPay2XYZ', 'sig_priya2signature', 12999.00, 'INR', 'PAID', '2026-02-01 11:50:00'),
(5, 'order_RahulOrder1MNO', NULL, NULL, 42478.00, 'INR', 'CREATED', '2026-02-01 16:05:00');


-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL SELECT 'vendor', COUNT(*) FROM vendor
UNION ALL SELECT 'product', COUNT(*) FROM product
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_item', COUNT(*) FROM order_item
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'carts', COUNT(*) FROM carts
UNION ALL SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL SELECT 'wishlists', COUNT(*) FROM wishlists
UNION ALL SELECT 'wishlist_items', COUNT(*) FROM wishlist_items;

SELECT id, name, email, role FROM users ORDER BY id;

SELECT v.id, v.shop_name, v.status, u.email 
FROM vendor v JOIN users u ON v.user_id = u.id;

SELECT p.id, p.name, p.price, p.category, p.status, v.shop_name AS vendor
FROM product p JOIN vendor v ON p.vendor_id = v.id 
ORDER BY p.category, p.name;


-- ============================================================
-- END OF SETUP SCRIPT
-- ============================================================
-- 
-- 🍒 CRANBERRY MARKETPLACE - Login Credentials
-- ============================================================
-- All passwords: password123
-- ============================================================
-- 
-- ┌─────────────┬──────────────────────────────┬─────────────┐
-- │ Role        │ Email                        │ Password    │
-- ├─────────────┼──────────────────────────────┼─────────────┤
-- │ Admin       │ admin@cranberry.com          │ password123 │
-- │ Vendor      │ techvista@cranberry.com      │ password123 │
-- │ Vendor      │ urbanstyle@cranberry.com     │ password123 │
-- │ Vendor      │ homeessentials@cranberry.com │ password123 │
-- │ Vendor      │ glowbeauty@cranberry.com     │ password123 │
-- │ Customer    │ aryan@example.com            │ password123 │
-- │ Customer    │ priya@example.com            │ password123 │
-- │ Customer    │ rahul@example.com            │ password123 │
-- └─────────────┴──────────────────────────────┴─────────────┘
--
-- ============================================================
-- PRODUCT PRICING (All in INR - Indian Rupees)
-- ============================================================
--
-- Electronics (TechVista):
--   • MacBook Air M2          ₹49,999
--   • Sony WH-1000XM5         ₹24,999
--   • iPhone 15 Pro           ₹44,999
--   • Samsung 43" UHD TV      ₹32,999
--   • Apple Watch SE          ₹29,999
--
-- Fashion (UrbanStyle):
--   • Nike Air Max 270        ₹12,999
--   • Levi's 501 Jeans        ₹3,999
--   • Ray-Ban Aviator         ₹8,999
--   • Wildcraft Puffer        ₹5,999
--   • Adidas Ultraboost 23    ₹14,999
--
-- Home & Living (HomeEssentials):
--   • Dyson V12 Vacuum        ₹35,999
--   • Borosil Stand Mixer     ₹12,999
--   • Nespresso Vertuo Plus   ₹14,999
--   • Ergonomic Office Chair  ₹18,999
--   • Philips Hue Kit         ₹9,999
--
-- Beauty (GlowBeauty):
--   • Neutrogena Hydro Boost  ₹899
--   • Dyson Airwrap Complete  ₹44,999
--   • Lakme Absolute Set      ₹2,499
--   • Forest Essentials Serum ₹2,999
--   • Park Avenue Perfume     ₹1,299
--
-- ============================================================
