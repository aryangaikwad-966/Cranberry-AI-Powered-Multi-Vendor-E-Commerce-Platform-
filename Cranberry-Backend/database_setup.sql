-- ============================================================
-- 🍒 CRANBERRY MARKETPLACE - MySQL/MariaDB Database Setup
-- ============================================================
-- Generated from Backend JPA Entity Analysis
-- Compatible with: MySQL 8.0+ / MariaDB 10.5+
-- Last Updated: February 2026
-- ============================================================

-- ============================================================
-- 1. DATABASE CREATION
-- ============================================================

-- View existing databases (optional)
-- SHOW DATABASES;

-- Drop existing database if needed (CAUTION: Destroys all data!)
-- DROP DATABASE IF EXISTS cranberry_db;

-- Create fresh database with proper encoding
CREATE DATABASE IF NOT EXISTS cranberry_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE cranberry_db;

-- ============================================================
-- 2. DROP EXISTING TABLES (Clean Slate)
-- Order matters due to foreign key constraints
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
-- Entity: User.java | Table: users
-- ============================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',  -- ADMIN, VENDOR, CUSTOMER
    google_id VARCHAR(255) UNIQUE,                  -- For Google OAuth
    avatar VARCHAR(500),                            -- Profile picture URL
    
    -- Audit fields (not in entity but useful)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. VENDOR TABLE  
-- Entity: Vendor.java | Table: vendor
-- ============================================================

CREATE TABLE vendor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shop_name VARCHAR(100) NOT NULL,                -- @Column maps to snake_case
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',           -- PENDING, APPROVED
    logo_url VARCHAR(500),                          -- @Column(name = "logo_url")
    joined_at TIMESTAMP,                            -- Set by @PrePersist
    
    -- Foreign Key to User (One-to-One)
    user_id BIGINT NOT NULL UNIQUE,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_vendor_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_vendor_status (status),
    INDEX idx_vendor_shop_name (shop_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. PRODUCT TABLE
-- Entity: Product.java | Table: product
-- ============================================================

CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,                          -- Java: double price
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),                         -- snake_case convention
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',           -- pending, approved, rejected
    
    -- Foreign Key to Vendor
    vendor_id BIGINT NOT NULL,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_product_vendor 
        FOREIGN KEY (vendor_id) REFERENCES vendor(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_product_category (category),
    INDEX idx_product_vendor (vendor_id),
    INDEX idx_product_status (status),
    INDEX idx_product_name (name(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. ORDERS TABLE
-- Entity: Order.java | Table: orders
-- ============================================================

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_amount DOUBLE NOT NULL,                   -- Java: double totalAmount
    status VARCHAR(30) DEFAULT 'CREATED',           -- OrderStatus enum values
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    estimated_delivery_date DATE,                   -- Java: LocalDate
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Set by @PrePersist
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key to User
    user_id BIGINT NOT NULL,
    
    -- Constraints
    CONSTRAINT fk_orders_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. ORDER_ITEM TABLE
-- Entity: OrderItem.java | Table: order_item
-- ============================================================

CREATE TABLE order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,                          -- Java: double price
    status VARCHAR(20) DEFAULT 'PENDING',           -- Item-level status for multi-vendor
    
    -- Foreign Keys
    order_id BIGINT NOT NULL,
    product_id BIGINT,                              -- Nullable if product deleted
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_orderitem_order 
        FOREIGN KEY (order_id) REFERENCES orders(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product 
        FOREIGN KEY (product_id) REFERENCES product(id) 
        ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_orderitem_order (order_id),
    INDEX idx_orderitem_product (product_id),
    INDEX idx_orderitem_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. PAYMENTS TABLE
-- Entity: Payment.java | Table: payments
-- ============================================================

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    razorpay_order_id VARCHAR(100) UNIQUE NOT NULL, -- Razorpay order ID
    razorpay_payment_id VARCHAR(100),               -- Razorpay payment ID
    razorpay_signature VARCHAR(255),                -- Payment signature
    amount DOUBLE NOT NULL,                         -- Payment amount
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',    -- Currency code
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED',  -- CREATED, PENDING, PAID, FAILED, REFUNDED
    failure_reason TEXT,                            -- Reason if payment failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Set by @PrePersist
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key to Order (One-to-One)
    order_id BIGINT NOT NULL,
    
    -- Constraints
    CONSTRAINT fk_payment_order 
        FOREIGN KEY (order_id) REFERENCES orders(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_payment_status (status),
    INDEX idx_payment_razorpay_order (razorpay_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. CARTS TABLE
-- Entity: Cart.java | Table: carts
-- ============================================================

CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key to User (One-to-One)
    user_id BIGINT NOT NULL UNIQUE,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_cart_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. CART_ITEMS TABLE
-- Entity: CartItem.java | Table: cart_items
-- ============================================================

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL DEFAULT 1,
    
    -- Foreign Keys
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_cartitem_cart 
        FOREIGN KEY (cart_id) REFERENCES carts(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_product 
        FOREIGN KEY (product_id) REFERENCES product(id) 
        ON DELETE CASCADE,
    
    -- Unique constraint: One product per cart
    UNIQUE KEY uk_cart_product (cart_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. WISHLISTS TABLE
-- Entity: Wishlist.java | Table: wishlists
-- ============================================================

CREATE TABLE wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key to User (One-to-One)
    user_id BIGINT NOT NULL UNIQUE,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_wishlist_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. WISHLIST_ITEMS TABLE
-- Entity: WishlistItem.java | Table: wishlist_items
-- ============================================================

CREATE TABLE wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    wishlist_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_wishlistitem_wishlist 
        FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_wishlistitem_product 
        FOREIGN KEY (product_id) REFERENCES product(id) 
        ON DELETE CASCADE,
    
    -- Unique constraint: One product per wishlist
    UNIQUE KEY uk_wishlist_product (wishlist_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- ============================================================
--                    SAMPLE DATA INSERTION
-- ============================================================
-- ============================================================

-- ============================================================
-- USERS (Password: password123 for all - BCrypt encoded)
-- BCrypt hash for 'password123': $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm
-- ============================================================

INSERT INTO users (name, email, password, role, avatar) VALUES
-- Admin
('Admin User', 'admin@cranberry.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm', 'ADMIN', 'https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=fff'),

-- Vendors (will be linked to vendor profiles)
('TechVista Electronics', 'techvista@cranberry.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm', 'VENDOR', 'https://ui-avatars.com/api/?name=TechVista&background=2563eb&color=fff'),
('UrbanStyle Co.', 'urbanstyle@cranberry.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm', 'VENDOR', 'https://ui-avatars.com/api/?name=UrbanStyle&background=7c3aed&color=fff'),
('HomeEssentials Plus', 'homeessentials@cranberry.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm', 'VENDOR', 'https://ui-avatars.com/api/?name=HomeEssentials&background=059669&color=fff'),
('GlowBeauty', 'glowbeauty@cranberry.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm', 'VENDOR', 'https://ui-avatars.com/api/?name=GlowBeauty&background=db2777&color=fff'),

-- Customers
('John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm', 'CUSTOMER', 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'),
('Jane Smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm', 'CUSTOMER', 'https://ui-avatars.com/api/?name=Jane+Smith&background=ec4899&color=fff'),
('Mike Johnson', 'mike@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm', 'CUSTOMER', 'https://ui-avatars.com/api/?name=Mike+Johnson&background=14b8a6&color=fff');

-- ============================================================
-- VENDORS (Linked to VENDOR users)
-- user_id 2-5 are vendors
-- ============================================================

INSERT INTO vendor (user_id, shop_name, contact_email, contact_phone, address, status, logo_url, joined_at) VALUES
(2, 'TechVista Electronics', 'techvista@cranberry.com', '+1-555-0101', '123 Tech Park, Silicon Valley, CA 94025', 'APPROVED', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', NOW()),
(3, 'UrbanStyle Co.', 'urbanstyle@cranberry.com', '+1-555-0102', '456 Fashion District, New York, NY 10018', 'APPROVED', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200', NOW()),
(4, 'HomeEssentials Plus', 'homeessentials@cranberry.com', '+1-555-0103', '789 Home Ave, Chicago, IL 60601', 'APPROVED', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', NOW()),
(5, 'GlowBeauty', 'glowbeauty@cranberry.com', '+1-555-0104', '321 Beauty Blvd, Los Angeles, CA 90028', 'APPROVED', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200', NOW());

-- ============================================================
-- PRODUCTS (Vendor IDs: 1=TechVista, 2=UrbanStyle, 3=HomeEssentials, 4=GlowBeauty)
-- Prices in INR (Indian Rupees) - Realistic market prices
-- ============================================================

INSERT INTO product (name, description, price, stock, image_url, category, vendor_id, status) VALUES
-- TechVista Electronics (vendor_id = 1)
('MacBook Pro 16" M3 Max', 'The most powerful MacBook Pro ever. Features the M3 Max chip with 14-core CPU and 30-core GPU.', 349900.00, 25, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Electronics', 1, 'approved'),
('Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation with exceptional sound quality.', 29990.00, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Electronics', 1, 'approved'),
('iPhone 15 Pro Max', 'Titanium design. A17 Pro chip. 5x optical zoom.', 159900.00, 40, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'Electronics', 1, 'approved'),
('Samsung 65" QLED 4K TV', 'Quantum Dot technology for incredible color and clarity.', 109990.00, 15, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800', 'Electronics', 1, 'approved'),
('Apple Watch Ultra 2', 'The most rugged and capable Apple Watch.', 89900.00, 35, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800', 'Electronics', 1, 'approved'),

-- UrbanStyle Co. (vendor_id = 2)
('Nike Air Max 270 React', 'Comfort meets style with React foam and Max Air cushioning.', 13995.00, 100, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Fashion', 2, 'approved'),
('Levi''s 501 Original Jeans', 'The original blue jean since 1873. Straight leg, button fly.', 4999.00, 75, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'Fashion', 2, 'approved'),
('Ray-Ban Aviator Sunglasses', 'Classic aviator style with crystal green lenses.', 15490.00, 60, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', 'Fashion', 2, 'approved'),
('North Face Puffer Jacket', 'Lightweight warmth with responsibly sourced down.', 22990.00, 45, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'Fashion', 2, 'approved'),
('Adidas Ultraboost 23', 'Energy-returning BOOST midsole for endless comfort.', 16999.00, 80, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', 'Fashion', 2, 'approved'),

-- HomeEssentials Plus (vendor_id = 3)
('Dyson V15 Detect Vacuum', 'Intelligently optimizes suction power with laser dust detection.', 62900.00, 30, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800', 'Home & Living', 3, 'approved'),
('KitchenAid Stand Mixer', 'Iconic design with 10 speeds and 5-quart bowl.', 42990.00, 25, 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800', 'Home & Living', 3, 'approved'),
('Nespresso Vertuo Plus', 'Barista-grade coffee at the touch of a button.', 16900.00, 55, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800', 'Home & Living', 3, 'approved'),
('Herman Miller Aeron Chair', 'Ergonomic design for all-day comfort.', 169900.00, 10, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', 'Home & Living', 3, 'approved'),
('Philips Hue Starter Kit', 'Smart lighting that sets the mood.', 13990.00, 40, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Home & Living', 3, 'approved'),

-- GlowBeauty (vendor_id = 4)
('La Mer Crème de la Mer', 'Legendary moisturizer with Miracle Broth.', 32500.00, 45, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', 'Beauty', 4, 'approved'),
('Dyson Airwrap Complete', 'Style with air, not extreme heat.', 45900.00, 20, 'https://images.unsplash.com/photo-1522338242042-2d1c40dc41e0?w=800', 'Beauty', 4, 'approved'),
('Charlotte Tilbury Pillow Talk Set', 'Iconic lip and cheek essentials.', 6500.00, 90, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'Beauty', 4, 'approved'),
('SK-II Facial Treatment Essence', 'The miracle water for crystal clear skin.', 15900.00, 35, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800', 'Beauty', 4, 'approved'),
('Tom Ford Black Orchid', 'A luxurious and sensual fragrance.', 12500.00, 50, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', 'Beauty', 4, 'approved');

-- ============================================================
-- CREATE CARTS FOR CUSTOMERS
-- ============================================================

INSERT INTO carts (user_id) VALUES
(6),  -- John Doe
(7),  -- Jane Smith
(8);  -- Mike Johnson

-- ============================================================
-- CREATE WISHLISTS FOR CUSTOMERS
-- ============================================================

INSERT INTO wishlists (user_id) VALUES
(6),  -- John Doe
(7),  -- Jane Smith
(8);  -- Mike Johnson

-- ============================================================
-- SAMPLE CART ITEMS
-- ============================================================

INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 1),   -- John: MacBook Pro
(1, 6, 2),   -- John: Nike Air Max (2 pairs)
(2, 16, 1),  -- Jane: La Mer Crème
(2, 17, 1),  -- Jane: Dyson Airwrap
(3, 11, 1);  -- Mike: Dyson Vacuum

-- ============================================================
-- SAMPLE WISHLIST ITEMS
-- ============================================================

INSERT INTO wishlist_items (wishlist_id, product_id) VALUES
(1, 3),   -- John: iPhone 15 Pro Max
(1, 14),  -- John: Herman Miller Chair
(2, 1),   -- Jane: MacBook Pro
(2, 5),   -- Jane: Apple Watch Ultra
(3, 2),   -- Mike: Sony Headphones
(3, 12);  -- Mike: KitchenAid Mixer

-- ============================================================
-- SAMPLE ORDERS (Prices in INR)
-- ============================================================

INSERT INTO orders (user_id, total_amount, status, shipping_address, tracking_number, estimated_delivery_date, created_at) VALUES
-- John's orders
(6, 319890.00, 'DELIVERED', '123 Main St, Apt 4B, Mumbai, MH 400001', 'TRK-001-2026-A1B2C3', '2026-01-25', '2026-01-15 10:30:00'),
(6, 37483.00, 'SHIPPED', '123 Main St, Apt 4B, Mumbai, MH 400001', 'TRK-002-2026-D4E5F6', '2026-02-05', '2026-01-28 14:20:00'),

-- Jane's orders
(7, 78400.00, 'PROCESSING', '456 Oak Ave, Suite 100, Bangalore, KA 560001', NULL, NULL, '2026-01-30 09:15:00'),
(7, 13995.00, 'PAID', '456 Oak Ave, Suite 100, Bangalore, KA 560001', NULL, NULL, '2026-02-01 11:45:00'),

-- Mike's order
(8, 62900.00, 'CREATED', '789 Pine Rd, Delhi, DL 110001', NULL, NULL, '2026-02-01 16:00:00');

-- ============================================================
-- SAMPLE ORDER ITEMS (Prices in INR)
-- ============================================================

INSERT INTO order_item (order_id, product_id, quantity, price, status) VALUES
-- Order 1 (John - Delivered): MacBook Pro + Sony Headphones
(1, 1, 1, 289900.00, 'DELIVERED'),  -- MacBook Pro 16" M3 Max
(1, 2, 1, 29990.00, 'DELIVERED'),   -- Sony WH-1000XM5 Headphones

-- Order 2 (John - Shipped): Fashion items
(2, 6, 2, 13995.00, 'SHIPPED'),     -- Nike Air Max 270 React x2
(2, 7, 1, 4999.00, 'SHIPPED'),      -- Levi's 501 Original Jeans
(2, 8, 1, 15490.00, 'PROCESSING'),  -- Ray-Ban Aviator (different vendor, still processing)

-- Order 3 (Jane - Processing): Beauty products
(3, 16, 1, 32500.00, 'PROCESSING'), -- La Mer Crème de la Mer
(3, 17, 1, 45900.00, 'PENDING'),    -- Dyson Airwrap Complete

-- Order 4 (Jane - Paid, waiting to ship)
(4, 6, 1, 13995.00, 'PENDING'),     -- Nike Air Max 270 React

-- Order 5 (Mike - Just created)
(5, 11, 1, 62900.00, 'PENDING');    -- Dyson V15 Detect Vacuum

-- ============================================================
-- SAMPLE PAYMENTS (Amounts in INR)
-- ============================================================

INSERT INTO payments (order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, status, created_at) VALUES
(1, 'order_JohnOrder1ABC', 'pay_JohnPay1XYZ', 'sig_john1signature', 319890.00, 'INR', 'PAID', '2026-01-15 10:35:00'),
(2, 'order_JohnOrder2DEF', 'pay_JohnPay2XYZ', 'sig_john2signature', 37483.00, 'INR', 'PAID', '2026-01-28 14:25:00'),
(3, 'order_JaneOrder1GHI', 'pay_JanePay1XYZ', 'sig_jane1signature', 78400.00, 'INR', 'PAID', '2026-01-30 09:20:00'),
(4, 'order_JaneOrder2JKL', 'pay_JanePay2XYZ', 'sig_jane2signature', 13995.00, 'INR', 'PAID', '2026-02-01 11:50:00'),
(5, 'order_MikeOrder1MNO', NULL, NULL, 62900.00, 'INR', 'CREATED', '2026-02-01 16:05:00');


-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check all tables
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

-- View users with roles
SELECT id, name, email, role FROM users ORDER BY id;

-- View vendors with their user info
SELECT v.id, v.shop_name, v.status, u.email 
FROM vendor v 
JOIN users u ON v.user_id = u.id;

-- View products with vendor names
SELECT p.id, p.name, p.price, p.category, p.status, v.shop_name AS vendor
FROM product p 
JOIN vendor v ON p.vendor_id = v.id 
ORDER BY p.category, p.name;

-- View orders with customer info
SELECT o.id, u.name AS customer, o.total_amount, o.status, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;


-- ============================================================
-- USEFUL ADMINISTRATIVE QUERIES
-- ============================================================

-- Update admin password (if needed)
-- Password: admin123
-- UPDATE users SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.nL4X4xFQFg8v9mQdCm' WHERE email = 'admin@cranberry.com';

-- Approve all pending vendors
-- UPDATE vendor SET status = 'APPROVED' WHERE status = 'PENDING';

-- Approve all pending products
-- UPDATE product SET status = 'approved' WHERE status = 'pending';

-- Get vendor sales statistics
-- SELECT 
--     v.shop_name,
--     COUNT(DISTINCT oi.order_id) AS total_orders,
--     SUM(oi.quantity) AS items_sold,
--     SUM(oi.price * oi.quantity) AS total_revenue
-- FROM vendor v
-- JOIN product p ON p.vendor_id = v.id
-- JOIN order_item oi ON oi.product_id = p.id
-- GROUP BY v.id, v.shop_name
-- ORDER BY total_revenue DESC;


-- ============================================================
-- END OF SETUP SCRIPT
-- ============================================================
-- 
-- Login Credentials (all passwords: password123):
-- ┌─────────────┬─────────────────────────────┬──────────┐
-- │ Role        │ Email                       │ Password │
-- ├─────────────┼─────────────────────────────┼──────────┤
-- │ Admin       │ admin@cranberry.com         │ password123 │
-- │ Vendor      │ techvista@cranberry.com     │ password123 │
-- │ Vendor      │ urbanstyle@cranberry.com    │ password123 │
-- │ Vendor      │ homeessentials@cranberry.com│ password123 │
-- │ Vendor      │ glowbeauty@cranberry.com    │ password123 │
-- │ Customer    │ john@example.com            │ password123 │
-- │ Customer    │ jane@example.com            │ password123 │
-- │ Customer    │ mike@example.com            │ password123 │
-- └─────────────┴─────────────────────────────┴──────────┘
--
-- ============================================================
