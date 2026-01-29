import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, ChevronRight, Clock, Truck, CheckCircle, XCircle,
  CreditCard, RefreshCw, Loader2, Eye, AlertCircle
} from 'lucide-react';
import { ordersApi, paymentsApi, ORDER_STATUS_LABELS } from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderPayment, setOrderPayment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [retryingPayment, setRetryingPayment] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);

    try {
      const payment = await paymentsApi.getByOrderId(order.id);
      setOrderPayment(payment);
    } catch (error) {
      setOrderPayment(null);
    }
  };

  const handleRetryPayment = async (order) => {
    setRetryingPayment(order.id);

    try {
      // Retry payment
      const paymentData = await paymentsApi.retryPayment(order.id);

      // Load Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const options = {
        key: paymentData.razorpayKey,
        amount: paymentData.amount * 100,
        currency: paymentData.currency || 'INR',
        name: 'Cranberry Marketplace',
        description: `Order #${order.id}`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#0071E3',
        },
        handler: async function (response) {
          try {
            await paymentsApi.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            toast.success('Payment successful!');
            loadOrders();
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Retry payment failed:', error);
      toast.error(error.message || 'Failed to retry payment');
    } finally {
      setRetryingPayment(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await ordersApi.cancel(orderId);
      toast.success('Order cancelled successfully');
      loadOrders();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CREATED':
      case 'PAYMENT_PENDING':
        return <Clock className="h-4 w-4" />;
      case 'PAID':
      case 'PROCESSING':
        return <Package className="h-4 w-4" />;
      case 'SHIPPED':
        return <Truck className="h-4 w-4" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CREATED':
        return 'bg-slate-100 text-slate-700';
      case 'PAYMENT_PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-700';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const canRetryPayment = (status) => {
    return status === 'CREATED' || status === 'PAYMENT_PENDING';
  };

  const canCancel = (status) => {
    return status === 'CREATED' || status === 'PAYMENT_PENDING';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="orders-loading">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="orders-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900">
            My Orders
          </h1>
          <Button variant="outline" size="sm" onClick={loadOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-900 mb-2">
              No orders yet
            </h2>
            <p className="text-slate-500 mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-card overflow-hidden"
                data-testid={`order-${order.id}`}
              >
                {/* Order header */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Order placed</p>
                    <p className="font-medium text-slate-900">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="font-display font-bold text-slate-900">
                      ₹{((order.totalAmount || 0) * 83).toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Order #</p>
                    <p className="font-mono text-sm text-slate-900">{order.id}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                    {getStatusIcon(order.status)}
                    <span>{ORDER_STATUS_LABELS[order.status] || order.status}</span>
                  </Badge>
                </div>

                {/* Order items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items?.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <Link to={`/product/${item.product?.id}`}>
                          <img
                            src={item.product?.imageUrl || item.product?.images?.[0] || '/placeholder.png'}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded-lg bg-slate-50"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product?.id}`}
                            className="font-medium text-slate-900 hover:text-[#0071E3] transition-colors line-clamp-1"
                          >
                            {item.product?.name}
                          </Link>
                          <p className="text-sm text-slate-500">
                            Qty: {item.quantity} × ₹{((item.price / item.quantity) * 83).toFixed(0)}
                          </p>
                        </div>
                        <p className="font-medium text-slate-900">
                          ₹{(item.price * 83).toFixed(0)}
                        </p>
                      </div>
                    ))}
                    {order.items && order.items.length > 2 && (
                      <p className="text-sm text-slate-500">
                        + {order.items.length - 2} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Order actions */}
                <div className="px-6 py-4 bg-slate-50 flex flex-wrap justify-end gap-3">
                  {canRetryPayment(order.status) && (
                    <Button
                      size="sm"
                      onClick={() => handleRetryPayment(order)}
                      disabled={retryingPayment === order.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {retryingPayment === order.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-1" />
                      )}
                      Complete Payment
                    </Button>
                  )}
                  {canCancel(order.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                    className="border-[#0071E3] text-[#0071E3] hover:bg-blue-50"
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Track Order
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1`}>
                  {getStatusIcon(selectedOrder.status)}
                  {ORDER_STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                </Badge>
                <span className="text-2xl font-bold text-slate-900">
                  ₹{((selectedOrder.totalAmount || 0) * 83).toFixed(0)}
                </span>
              </div>

              {/* Pending Payment Alert */}
              {canRetryPayment(selectedOrder.status) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">Payment Pending</p>
                    <p className="text-sm text-yellow-600 mt-1">
                      Complete your payment to confirm this order.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleRetryPayment(selectedOrder)}
                    disabled={retryingPayment === selectedOrder.id}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {retryingPayment === selectedOrder.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Pay Now'
                    )}
                  </Button>
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Shipping Address</h4>
                <p className="text-sm text-slate-600">{selectedOrder.shippingAddress || 'Not specified'}</p>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                      <img
                        src={item.product?.imageUrl || item.product?.images?.[0] || '/placeholder.png'}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.product?.name}</p>
                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">₹{(item.price * 83).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              {orderPayment && (
                <>
                  <Separator />
                  <div className={`rounded-xl p-4 ${orderPayment.status === 'PAID'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-slate-50 border border-slate-200'
                    }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className={`h-5 w-5 ${orderPayment.status === 'PAID' ? 'text-green-600' : 'text-slate-600'
                        }`} />
                      <h4 className={`font-semibold ${orderPayment.status === 'PAID' ? 'text-green-800' : 'text-slate-800'
                        }`}>
                        Payment Details
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Status</p>
                        <p className={`font-medium ${orderPayment.status === 'PAID' ? 'text-green-700' : 'text-slate-700'
                          }`}>
                          {orderPayment.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Amount</p>
                        <p className="font-medium">₹{(orderPayment.amount * 83).toFixed(0)}</p>
                      </div>
                      {orderPayment.razorpayPaymentId && (
                        <div className="col-span-2">
                          <p className="text-slate-500">Transaction ID</p>
                          <p className="font-mono text-xs">{orderPayment.razorpayPaymentId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              {canCancel(selectedOrder.status) && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default OrdersPage;
