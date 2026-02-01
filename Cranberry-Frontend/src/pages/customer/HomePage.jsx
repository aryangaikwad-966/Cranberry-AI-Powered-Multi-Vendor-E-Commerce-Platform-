import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { productsApi } from '../../services/api';
import { sampleProducts } from '../../data/sampleData';
import AISearchBar from '../../components/ai/SearchBar';
import AIRecommendations from '../../components/ai/Recommendations';
import ProductCard from '../../components/product/ProductCard';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await productsApi.getFeatured(8);
        if (Array.isArray(products) && products.length > 0) {
          setFeaturedProducts(products);
        } else {
          // Use sample data if backend returns empty
          setFeaturedProducts(sampleProducts.filter(p => p.featured).slice(0, 8));
        }
      } catch (error) {
        // Use sample data as fallback when backend is offline
        setFeaturedProducts(sampleProducts.filter(p => p.featured).slice(0, 8));
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Electronics',
      href: '/shop?category=electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      count: '45+ items'
    },
    {
      name: 'Fashion',
      href: '/shop?category=fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      count: '78+ items'
    },
    {
      name: 'Home & Living',
      href: '/shop?category=home-living',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
      count: '56+ items'
    },
    {
      name: 'Beauty',
      href: '/shop?category=beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      count: '42+ items'
    },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹5000' },
    { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day returns' },
    { icon: Headphones, title: '24/7 Support', desc: 'AI-powered help' },
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-[#0071E3] rounded-full text-sm font-medium mb-6">
              AI-Powered Shopping Experience
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
              Discover products
              <br />
              <span className="text-[#0071E3]">you'll love</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Shop from thousands of trusted vendors with AI-powered recommendations,
              smart search, and personalized experience.
            </p>

            {/* AI Search */}
            <AISearchBar variant="hero" />

            {/* Quick links */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="text-sm text-slate-500">Popular:</span>
              {['MacBook Pro', 'Sony Headphones', 'Nike Sneakers'].map((term) => (
                <Link
                  key={term}
                  to={`/shop?search=${encodeURIComponent(term)}`}
                  className="text-sm text-slate-600 hover:text-[#0071E3] transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-[#0071E3]" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{feature.title}</p>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900">Shop by Category</h2>
              <p className="text-slate-500 mt-2">Find exactly what you need</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center space-x-2 text-[#0071E3] hover:text-[#0077ED] transition-colors"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden"
                data-testid={`category-card-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-slate-500 mt-2">Handpicked by our team</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center space-x-2 text-[#0071E3] hover:text-[#0077ED] transition-colors"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              asChild
              className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full px-8 py-6 text-lg shadow-btn-primary"
            >
              <Link to="/shop" data-testid="explore-all-products">
                Explore All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-20 bg-white">
        <AIRecommendations title="AI Picks for You" limit={4} />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0071E3] to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start selling?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of vendors and reach millions of customers worldwide.
            Get AI-powered pricing suggestions and analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="bg-white text-[#0071E3] hover:bg-slate-100 rounded-full px-8 py-6 text-lg"
            >
              <Link to="/vendor/register" data-testid="become-vendor-cta">
                Become a Vendor
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
            >
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
