import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { Button } from '../../components/ui/button';

const WishlistPage = () => {
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (productId) => {
    await addToCart(productId, 1);
    await removeFromWishlist(productId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="wishlist-loading">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="wishlist-empty">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
            Your wishlist is empty
          </h1>
          <p className="text-slate-500 mb-8">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Button
            asChild
            className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full px-8"
          >
            <Link to="/shop" data-testid="start-browsing">
              Start Browsing
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="wishlist-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">
          My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            // Support both backend DTO (WishlistResponse.WishlistItemDto) and local/sample products
            const productId = item.productId || item.id;
            const name = item.name || item.productName;
            const vendorName = item.vendorName || item.vendor?.name || 'Vendor';
            const price = item.price ?? item.product?.price ?? 0;
            const originalPrice = item.originalPrice;

            // Safely resolve image URL without ever indexing into undefined
            let imageUrl = item.imageUrl;
            if (!imageUrl && Array.isArray(item.images) && item.images.length > 0) {
              imageUrl = item.images[0];
            }

            return (
            <div
              key={productId}
              className="bg-white rounded-2xl overflow-hidden shadow-card"
              data-testid={`wishlist-item-${productId}`}
            >
              {/* Image */}
              <Link to={`/product/${productId}`}>
                <div className="aspect-square overflow-hidden bg-slate-50">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link
                  to={`/product/${productId}`}
                  className="font-medium text-slate-900 hover:text-[#0071E3] transition-colors line-clamp-2"
                >
                  {name}
                </Link>
                <p className="text-sm text-slate-500 mt-1">{vendorName}</p>

                <div className="flex items-center justify-between mt-3">
                  <span className="font-display font-bold text-lg text-slate-900">
                    ${price.toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleMoveToCart(productId)}
                    className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl"
                    data-testid={`move-to-cart-${productId}`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => removeFromWishlist(productId)}
                    variant="outline"
                    size="icon"
                    className="rounded-xl text-slate-500 hover:text-red-500"
                    data-testid={`remove-wishlist-${productId}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
