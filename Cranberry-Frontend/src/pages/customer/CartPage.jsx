import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';

// Helper functions to safely get item data (handles both backend and local/sample formats)
const getImage = (item) => {
  return item.imageUrl || item.product?.imageUrl || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
};
const getName = (item) => item.productName || item.name || item.product?.name || 'Product';
const getVendor = (item) => item.vendorName || item.product?.vendorName || 'Vendor';
const getPrice = (item) => item.price || item.product?.price || 0;
const getStock = (item) => item.stock || item.product?.stock || 99;
const getId = (item) => item.productId || item.product?.id || item.id;

const CartPage = () => {
  const navigate = useNavigate();
  const { items, isLoading, updateQuantity, removeFromCart, subtotal, shipping, tax, total } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="cart-loading">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="cart-empty">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-slate-500 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button
            asChild
            className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full px-8"
          >
            <Link to="/shop" data-testid="continue-shopping">
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemId = getId(item);
              const itemImage = getImage(item);
              const itemName = getName(item);
              const itemVendor = getVendor(item);
              const itemPrice = getPrice(item);
              const itemStock = getStock(item);

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-2xl p-6 shadow-card"
                  data-testid={`cart-item-${itemId}`}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link to={`/product/${itemId}`}>
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-24 h-24 object-cover rounded-xl bg-slate-50"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            to={`/product/${itemId}`}
                            className="font-medium text-slate-900 hover:text-[#0071E3] transition-colors line-clamp-2"
                          >
                            {itemName}
                          </Link>
                          <p className="text-sm text-slate-500 mt-1">
                            Sold by {itemVendor}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          data-testid={`remove-item-${itemId}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className="p-2 hover:bg-slate-50 transition-colors"
                            disabled={item.quantity <= 1}
                            data-testid={`decrease-${itemId}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="p-2 hover:bg-slate-50 transition-colors"
                            disabled={item.quantity >= itemStock}
                            data-testid={`increase-${itemId}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-display font-bold text-lg text-slate-900">
                            ₹{(itemPrice * item.quantity * 83).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-slate-500">
                              ₹{(itemPrice * 83).toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <Link
              to="/shop"
              className="flex items-center text-[#0071E3] hover:text-[#0077ED] transition-colors font-medium"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">
                Order Summary
              </h2>

              {/* Promo code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="w-full h-11 pl-10 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#0071E3] rounded-xl transition-all outline-none text-sm"
                      data-testid="promo-code-input"
                    />
                  </div>
                  <Button variant="outline" className="px-4">
                    Apply
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{(subtotal * 83).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${(shipping * 83).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>₹{(tax * 83).toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold text-slate-900">
                  <span>Total</span>
                  <span>₹{(total * 83).toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <p className="text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    You qualify for free shipping!
                  </p>
                )}
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 h-14 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-lg shadow-btn-primary"
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </Button>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center gap-4 text-slate-400">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs">Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
