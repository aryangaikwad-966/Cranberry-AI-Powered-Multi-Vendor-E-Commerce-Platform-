import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { Button } from '../ui/button';

const ProductCard = ({ product, showAIBadge = false }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    await addToCart(product.id, 1);
    setIsAddingToCart(false);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const fallbackImage = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';

  // Handle both imageUrl (sample data) and images array (backend data)
  const productImage = product.imageUrl || product.images?.[0] || fallbackImage;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-slate-100"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={imageError ? fallbackImage : productImage}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 bg-[#0071E3] text-white text-xs font-medium rounded-full">
              Featured
            </span>
          )}
          {showAIBadge && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#0071E3] to-indigo-600 text-white text-xs font-medium rounded-full flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>AI Pick</span>
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${inWishlist
            ? 'bg-red-50 text-red-500'
            : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100'
            }`}
          data-testid={`wishlist-toggle-${product.id}`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick add to cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="w-full bg-white/95 backdrop-blur-sm text-slate-900 hover:bg-white border border-slate-200 rounded-xl shadow-lg"
            data-testid={`add-to-cart-${product.id}`}
          >
            {isAddingToCart ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </span>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <span className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-slate-900">{product.rating}</span>
          <span className="text-sm text-slate-400">({product.reviewCount})</span>
        </div>

        <h3 className="font-medium text-slate-900 line-clamp-2 mb-1 group-hover:text-[#0071E3] transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-slate-500 mb-3">{product.vendorName}</p>

        <div className="flex items-center space-x-2">
          <span className="font-display font-bold text-lg text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
