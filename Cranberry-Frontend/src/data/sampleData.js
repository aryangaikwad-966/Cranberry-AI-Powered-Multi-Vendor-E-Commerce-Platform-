// Sample data for frontend testing when backend is offline
// All prices in INR (Indian Rupees)

export const sampleProducts = [
    {
        id: 1,
        name: 'MacBook Pro 16" M3 Max',
        description: 'The most powerful MacBook Pro ever. With M3 Max chip, up to 128GB unified memory, and stunning Liquid Retina XDR display.',
        price: 349900.00,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        stock: 25,
        vendorId: 1,
        vendorName: 'TechVista Electronics',
        rating: 4.9,
        reviewCount: 256,
        featured: true
    },
    {
        id: 2,
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling.',
        price: 29990.00,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        stock: 50,
        vendorId: 2,
        vendorName: 'AudioPeak',
        rating: 4.8,
        reviewCount: 1024,
        featured: true
    },
    {
        id: 3,
        name: 'Nike Air Max 270 React',
        description: 'Comfort meets style with Nike Air Max cushioning and React foam technology.',
        price: 13995.00,
        category: 'Fashion',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        stock: 100,
        vendorId: 3,
        vendorName: 'UrbanStyle Co.',
        rating: 4.6,
        reviewCount: 512,
        featured: true
    },
    {
        id: 4,
        name: 'Dyson V15 Detect Vacuum',
        description: 'Intelligently optimizes suction power. Laser reveals microscopic dust.',
        price: 62900.00,
        category: 'Home & Living',
        imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
        stock: 30,
        vendorId: 4,
        vendorName: 'HomeEssentials Plus',
        rating: 4.7,
        reviewCount: 328,
        featured: true
    },
    {
        id: 5,
        name: 'iPad Pro 12.9" M2',
        description: 'Supercharged by M2 chip. 12.9-inch Liquid Retina XDR display.',
        price: 112900.00,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        stock: 40,
        vendorId: 1,
        vendorName: 'TechVista Electronics',
        rating: 4.8,
        reviewCount: 445,
        featured: true
    },
    {
        id: 6,
        name: "Levi's 501 Original Fit Jeans",
        description: 'The original blue jean. Signature straight leg with button fly.',
        price: 4999.00,
        category: 'Fashion',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
        stock: 200,
        vendorId: 3,
        vendorName: 'UrbanStyle Co.',
        rating: 4.5,
        reviewCount: 2048,
        featured: true
    },
    {
        id: 7,
        name: 'Samsung 65" OLED 4K Smart TV',
        description: 'Neural Quantum Processor with Object Tracking Sound+. Anti-Reflection technology.',
        price: 164900.00,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
        stock: 15,
        vendorId: 1,
        vendorName: 'TechVista Electronics',
        rating: 4.7,
        reviewCount: 189,
        featured: true
    },
    {
        id: 8,
        name: 'La Mer Crème de la Mer',
        description: 'Legendary moisturizer with cell-renewing Miracle Broth. Ultra-rich cream.',
        price: 32500.00,
        category: 'Beauty',
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
        stock: 45,
        vendorId: 5,
        vendorName: 'GlowBeauty',
        rating: 4.9,
        reviewCount: 567,
        featured: true
    },
    {
        id: 9,
        name: 'Apple Watch Ultra 2',
        description: 'The most rugged Apple Watch. Precision dual-frequency GPS.',
        price: 89900.00,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
        stock: 60,
        vendorId: 1,
        vendorName: 'TechVista Electronics',
        rating: 4.8,
        reviewCount: 723,
        featured: false
    },
    {
        id: 10,
        name: 'Herman Miller Aeron Chair',
        description: 'Iconic ergonomic office chair with PostureFit SL support.',
        price: 169900.00,
        category: 'Home & Living',
        imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
        stock: 20,
        vendorId: 4,
        vendorName: 'HomeEssentials Plus',
        rating: 4.9,
        reviewCount: 412,
        featured: false
    },
    {
        id: 11,
        name: 'Canon EOS R5 Camera',
        description: '45MP full-frame CMOS sensor. 8K RAW video recording.',
        price: 339900.00,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        stock: 12,
        vendorId: 1,
        vendorName: 'TechVista Electronics',
        rating: 4.9,
        reviewCount: 234,
        featured: false
    },
    {
        id: 12,
        name: 'Chanel N°5 Eau de Parfum',
        description: 'The timeless feminine fragrance. Floral aldehyde composition.',
        price: 15500.00,
        category: 'Beauty',
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
        stock: 75,
        vendorId: 5,
        vendorName: 'GlowBeauty',
        rating: 4.8,
        reviewCount: 1567,
        featured: false
    }
];

export const sampleCategories = [
    { id: 'electronics', name: 'Electronics', count: 45 },
    { id: 'fashion', name: 'Fashion', count: 78 },
    { id: 'home-living', name: 'Home & Living', count: 56 },
    { id: 'beauty', name: 'Beauty', count: 42 }
];

export default { sampleProducts, sampleCategories };
