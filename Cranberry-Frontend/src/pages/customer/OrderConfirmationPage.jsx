import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Home, ShoppingBag, Loader2, Store, Clock, XCircle } from 'lucide-react';
import { ordersApi } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import confetti from '../../lib/confetti';
import { formatPrice, getItemImage } from '../../lib/utils';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = location.state?.orderId;
  const paymentId = location.state?.paymentId;

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
      return;
    }

    loadOrderDetails();

    // Trigger confetti animation
    setTimeout(() => {
      confetti();
    }, 500);
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const data = await ordersApi.getById(orderId);
      setOrder(data.order || data);
      setPayment(data.payment);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50" data-testid="order-confirmation">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce-in">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-lg text-slate-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-8">
          {/* Order ID Header */}
          <div className="bg-gradient-to-r from-[#0071E3] to-[#34C759] px-6 py-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm opacity-80">Order Number</p>
                <p className="text-xl font-bold font-mono">#{orderId}</p>
              </div>
              {paymentId && (
                <div className="text-right">
                  <p className="text-sm opacity-80">Payment ID</p>
                  <p className="text-sm font-mono">{paymentId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Info */}
          <div className="p-6">
            {/* Status Timeline */}
            <div className="flex items-center justify-between mb-8">
              {[
                { key: 'PAID', label: 'Confirmed', icon: CheckCircle },
                { key: 'PROCESSING', label: 'Processing', icon: Package },
                { key: 'SHIPPED', label: 'Shipped', icon: Truck },
                { key: 'DELIVERED', label: 'Delivered', icon: Home },
              ].map((step, index, array) => {
                const statuses = ['CREATED', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                const currentIndex = statuses.indexOf(order?.status || 'PAID');
                const stepIndex = statuses.indexOf(step.key);
                const isCompleted = currentIndex >= stepIndex;
                const isCurrent = currentIndex === stepIndex;

                return (
                  <div key={step.key} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-100' : 'bg-slate-100'
                        }`}>
                        <step.icon className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-slate-400'}`} />
                      </div>
                      <p className={`text-xs mt-2 font-medium ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                    </div>
                    {index < array.length - 1 && (
                      <div className="w-full h-1 bg-slate-100 mt-[-20px]">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: currentIndex > stepIndex ? '100%' : currentIndex === stepIndex ? '50%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tracking Card */}
            {(order?.status === 'SHIPPED' || order?.status === 'PROCESSING') && (
              <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                      {order?.status === 'SHIPPED' ? (
                        <Truck className="w-7 h-7 text-[#0071E3]" />
                      ) : (
                        <Package className="w-7 h-7 text-[#0071E3]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-[#0071E3] font-bold font-display uppercase tracking-wider">
                        {order?.status === 'SHIPPED' ? 'In Transit' : 'Preparing Order'}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        Tracking: {order?.trackingNumber || `CRB-${orderId}-PENDING`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Current Location</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center justify-end gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {order?.status === 'SHIPPED' ? 'Sorting Center, Mumbai' : 'Cranberry Hub, Bengaluru'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-100/50">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Estimated Delivery</p>
                    <p className="text-sm font-bold text-slate-900">
                      {order?.estimatedDeliveryDate
                        ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : 'Checking...'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Shipping Mode</p>
                    <p className="text-sm font-bold text-slate-900 border-b border-dotted border-slate-300 inline-block">SwiftX Express</p>
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Order Items - Grouped by Vendor */}
            {order?.items && order.items.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">Order Items</h3>
                {(() => {
                  // Group items by vendor
                  const itemsByVendor = {};
                  order.items.forEach(item => {
                    const vendorName = item.product?.vendor?.shopName || 'Cranberry Marketplace';
                    const vendorId = item.product?.vendor?.id || 'default';
                    if (!itemsByVendor[vendorId]) {
                      itemsByVendor[vendorId] = {
                        vendorName,
                        items: []
                      };
                    }
                    itemsByVendor[vendorId].items.push(item);
                  });

                  const vendorGroups = Object.values(itemsByVendor);
                  const hasMultipleVendors = vendorGroups.length > 1;

                  return (
                    <div className="space-y-4">
                      {hasMultipleVendors && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                          <Store className="w-4 h-4 text-blue-600 mt-0.5" />
                          <p className="text-sm text-blue-700">
                            Your order contains products from <strong>{vendorGroups.length} different sellers</strong>.
                            Items may be shipped separately.
                          </p>
                        </div>
                      )}
                      {vendorGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="border border-slate-200 rounded-xl overflow-hidden">
                          {/* Vendor Header */}
                          <div className="bg-slate-50 px-4 py-2 flex items-center gap-2">
                            <Store className="w-4 h-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">
                              Sold by: {group.vendorName}
                            </span>
                            <Badge variant="outline" className="ml-auto text-xs">
                              {group.items.length} item{group.items.length > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          {/* Items from this vendor */}
                          <div className="divide-y divide-slate-100">
                            {group.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-4">
                                <img
                                  src={getItemImage(item)}
                                  alt={item.product?.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-slate-900">{item.product?.name}</p>
                                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                  {/* Item-level status */}
                                  {(item.status || item.itemStatus) && (
                                    <Badge className={`mt-1 text-xs flex items-center gap-1 w-fit ${(item.status || item.itemStatus) === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                        (item.status || item.itemStatus) === 'PROCESSING' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                          (item.status || item.itemStatus) === 'SHIPPED' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                            (item.status || item.itemStatus) === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                              'bg-slate-100 text-slate-600 border border-slate-200'
                                      }`}>
                                      {(item.status || item.itemStatus) === 'PENDING' && <Clock className="h-3 w-3" />}
                                      {(item.status || item.itemStatus) === 'PROCESSING' && <Package className="h-3 w-3" />}
                                      {(item.status || item.itemStatus) === 'SHIPPED' && <Truck className="h-3 w-3" />}
                                      {(item.status || item.itemStatus) === 'DELIVERED' && <CheckCircle className="h-3 w-3" />}
                                      {(item.status || item.itemStatus) === 'PENDING' ? 'Awaiting shipment' :
                                        (item.status || item.itemStatus) === 'PROCESSING' ? 'Processing' :
                                          (item.status || item.itemStatus) === 'SHIPPED' ? 'Shipped' :
                                            (item.status || item.itemStatus) === 'DELIVERED' ? 'Delivered' :
                                              (item.status || item.itemStatus)}
                                    </Badge>
                                  )}
                                </div>
                                <p className="font-semibold text-slate-900">
                                  ₹{formatPrice(item.price)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            <Separator className="my-6" />

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Shipping Address</p>
                <p className="font-medium text-slate-900 mt-1">
                  {order?.shippingAddress || 'Address will be updated'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="text-2xl font-bold text-[#0071E3]">
                  ₹{formatPrice(order?.totalAmount || 0)}
                </p>
              </div>
            </div>

            {/* Payment Status */}
            {payment && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Payment Successful</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Paid via Razorpay • {payment.currency} {payment.amount?.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
          <h3 className="font-semibold text-slate-900 mb-4">What happens next?</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <p>You'll receive an email confirmation with your order details.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <p>Each seller will process their items from your order.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <p>Items from different sellers may ship separately with individual tracking.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-600">4</span>
              </div>
              <p>You'll get tracking details once each shipment is dispatched.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="flex-1 h-12 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl"
          >
            <Link to="/orders">
              <Package className="w-5 h-5 mr-2" />
              View My Orders
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 h-12 rounded-xl"
          >
            <Link to="/shop">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
