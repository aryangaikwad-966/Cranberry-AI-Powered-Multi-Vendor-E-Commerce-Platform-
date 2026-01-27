import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  ChevronLeft,
  Share2,
  Check
} from 'lucide-react';
import { productsApi } from '../../services/api';
import { sampleProducts } from '../../data/sampleData';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import AIRecommendations from '../../components/ai/Recommendations';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const data = await productsApi.getById(id);
      if (data) {
        setProduct(data);
      } else {
        // Use sample data if backend returns empty
        const sampleProduct = sampleProducts.find(p => p.id === parseInt(id) || p.id === id);
        setProduct(sampleProduct || null);
      }
    } catch (error) {
      console.error('Backend offline, using sample data:', error);
      // Use sample data as fallback when backend is offline
      const sampleProduct = sampleProducts.find(p => p.id === parseInt(id) || p.id === id);
      setProduct(sampleProduct || null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await addToCart(product.id, quantity);
    setIsAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity);
    navigate('/checkout');
  };

  const inWishlist = product ? isInWishlist(product.id) : false;
  const discount = product?.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Handle both imageUrl (sample data) and images array (backend data)
  const getProductImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    if (product?.imageUrl) {
      return [product.imageUrl];
    }
    return ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];
  };

  const productImages = product ? getProductImages() : [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="product-detail-loading">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="product-detail-page">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-[#0071E3] transition-colors"
            data-testid="back-button"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50">
              <img
                src={productImages[selectedImage] || productImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex space-x-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                      ? 'border-[#0071E3]'
                      : 'border-transparent hover:border-slate-200'
                      }`}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.featured && (
                <Badge className="bg-[#0071E3] text-white">Featured</Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive">-{discount}% OFF</Badge>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Only {product.stock} left
                </Badge>
              )}
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-slate-900">{product.rating}</span>
                  <span className="text-slate-500">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Sold by {product.vendorName}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="font-display text-4xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-slate-900">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 hover:bg-slate-50 transition-colors"
                  disabled={quantity <= 1}
                  data-testid="quantity-decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium" data-testid="quantity-value">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-3 hover:bg-slate-50 transition-colors"
                  disabled={quantity >= product.stock}
                  data-testid="quantity-increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-slate-500">
                {product.stock} available
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1 h-14 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-lg shadow-btn-primary"
                data-testid="add-to-cart-button"
              >
                {addedToCart ? (
                  <span className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart!
                  </span>
                ) : isAddingToCart ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </span>
                )}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                variant="outline"
                className="flex-1 h-14 rounded-xl text-lg border-2"
                data-testid="buy-now-button"
              >
                Buy Now
              </Button>
            </div>

            {/* Secondary actions */}
            <div className="flex items-center space-x-6 pt-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center space-x-2 ${inWishlist ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                  } transition-colors`}
                data-testid="wishlist-button"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <button className="flex items-center space-x-2 text-slate-600 hover:text-[#0071E3] transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Truck className="h-5 w-5 text-[#0071E3]" />
                </div>
                <p className="text-sm font-medium text-slate-900">Free Shipping</p>
                <p className="text-xs text-slate-500">Over $100</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#0071E3]" />
                </div>
                <p className="text-sm font-medium text-slate-900">Secure Payment</p>
                <p className="text-xs text-slate-500">100% Protected</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-slate-50 rounded-xl flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-[#0071E3]" />
                </div>
                <p className="text-sm font-medium text-slate-900">Easy Returns</p>
                <p className="text-xs text-slate-500">30 Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full justify-start border-b border-slate-200 bg-transparent h-auto p-0 space-x-8">
              <TabsTrigger
                value="specifications"
                className="border-b-2 border-transparent data-[state=active]:border-[#0071E3] rounded-none pb-4 px-0"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="border-b-2 border-transparent data-[state=active]:border-[#0071E3] rounded-none pb-4 px-0"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="border-b-2 border-transparent data-[state=active]:border-[#0071E3] rounded-none pb-4 px-0"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-500">{key}</span>
                    <span className="font-medium text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-8">
              <div className="text-center py-12 text-slate-500">
                <p>Reviews feature coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="pt-8">
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Shipping</h3>
                  <p className="text-slate-600">Free shipping on orders over $100. Standard delivery takes 3-5 business days.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Returns</h3>
                  <p className="text-slate-600">Free returns within 30 days. Items must be in original condition with tags attached.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-50 py-16">
        <AIRecommendations productId={product.id} title="You May Also Like" limit={4} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
