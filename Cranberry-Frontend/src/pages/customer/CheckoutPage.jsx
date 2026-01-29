import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ChevronLeft, Shield, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ordersApi, paymentsApi } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';

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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form'); // form, processing, success, error
  const [error, setError] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    phone: '',
  });

  useEffect(() => {
    // Preload Razorpay script
    loadRazorpayScript();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone'];
    for (const field of required) {
      if (!formData[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const createOrderAndInitiatePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentStep('processing');
    setError(null);

    try {
      // Step 1: Create Order in Backend
      const shippingAddress = `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`;

      const orderData = {
        items: items.map(item => ({
          productId: item.productId || item.product?.id,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      const order = await ordersApi.create(orderData);
      setCreatedOrder(order);

      // Step 2: Create Razorpay Payment
      const paymentData = await paymentsApi.createPayment(order.id);

      // Step 3: Load Razorpay and open checkout
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway. Please refresh and try again.');
      }

      // Step 4: Open Razorpay Checkout
      const options = {
        key: paymentData.razorpayKey,
        amount: paymentData.amount * 100, // Amount in paise
        currency: paymentData.currency || 'INR',
        name: 'Cranberry Marketplace',
        description: `Order #${order.id}`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#0071E3',
        },
        handler: async function (response) {
          // Payment successful - verify on backend
          await handlePaymentSuccess(response, order.id);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentStep('form');
            toast.info('Payment cancelled. You can retry anytime.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', async function (response) {
        await handlePaymentFailure(response, paymentData.razorpayOrderId);
      });

      razorpay.open();
      setIsPaymentLoading(false);

    } catch (err) {
      console.error('Order/Payment creation failed:', err);
      setError(err.message || 'Failed to process order. Please try again.');
      setPaymentStep('error');
      setIsProcessing(false);
      toast.error(err.message || 'Order creation failed');
    }
  };

  const handlePaymentSuccess = async (response, orderId) => {
    setPaymentStep('processing');

    try {
      // Verify payment on backend
      await paymentsApi.verifyPayment(
        response.razorpay_order_id,
        response.razorpay_payment_id,
        response.razorpay_signature
      );

      // Clear cart
      await clearCart();

      setPaymentStep('success');
      toast.success('Payment successful! Order confirmed.');

      // Navigate to order confirmation
      setTimeout(() => {
        navigate('/order-confirmation', {
          state: {
            orderId,
            paymentId: response.razorpay_payment_id
          }
        });
      }, 1500);

    } catch (err) {
      console.error('Payment verification failed:', err);
      setError('Payment verification failed. Please contact support.');
      setPaymentStep('error');
      toast.error('Payment verification failed');
    }
  };

  const handlePaymentFailure = async (response, razorpayOrderId) => {
    try {
      await paymentsApi.markFailure(
        razorpayOrderId,
        response.error?.description || 'Payment failed'
      );
    } catch (err) {
      console.error('Failed to record payment failure:', err);
    }

    setError(response.error?.description || 'Payment failed. Please try again.');
    setPaymentStep('error');
    setIsProcessing(false);
    toast.error('Payment failed. Please try again.');
  };

  const handleRetryPayment = async () => {
    if (!createdOrder) {
      setPaymentStep('form');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');
    setError(null);

    try {
      const paymentData = await paymentsApi.retryPayment(createdOrder.id);

      const options = {
        key: paymentData.razorpayKey,
        amount: paymentData.amount * 100,
        currency: paymentData.currency || 'INR',
        name: 'Cranberry Marketplace',
        description: `Order #${createdOrder.id}`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#0071E3',
        },
        handler: async function (response) {
          await handlePaymentSuccess(response, createdOrder.id);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentStep('form');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async function (response) {
        await handlePaymentFailure(response, paymentData.razorpayOrderId);
      });
      razorpay.open();

    } catch (err) {
      console.error('Retry payment failed:', err);
      setError(err.message || 'Failed to retry payment');
      setPaymentStep('error');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (items.length === 0 && paymentStep !== 'success') {
      navigate('/cart');
    }
  }, [items.length, paymentStep, navigate]);

  if (items.length === 0 && paymentStep !== 'success') {
    return null;
  }

  // Success state
  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" data-testid="payment-success">
        <div className="bg-white rounded-2xl p-8 shadow-card text-center max-w-md mx-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-slate-500 mb-6">
            Your order has been confirmed. Redirecting to order details...
          </p>
          <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="checkout-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-slate-600 hover:text-[#0071E3] transition-colors mb-6"
          disabled={isProcessing}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </button>

        {/* Error alert */}
        {paymentStep === 'error' && error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-red-800">Payment Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <Button
              onClick={handleRetryPayment}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Retry Payment
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-[#0071E3] rounded-full flex items-center justify-center text-white font-medium">
                    1
                  </div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    Contact Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="mt-1"
                      data-testid="email-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="mt-1"
                      placeholder="+91 9876543210"
                      data-testid="phone-input"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-[#0071E3] rounded-full flex items-center justify-center text-white font-medium">
                    2
                  </div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    Shipping Address
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="mt-1"
                      data-testid="first-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="mt-1"
                      data-testid="last-name-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="mt-1"
                      data-testid="address-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      className="mt-1"
                      data-testid="city-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        disabled={isProcessing}
                        className="mt-1"
                        data-testid="state-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">PIN Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                        disabled={isProcessing}
                        className="mt-1"
                        data-testid="zip-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gradient-to-r from-[#0071E3]/10 to-[#34C759]/10 rounded-2xl p-6 border border-[#0071E3]/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-[#0071E3] rounded-full flex items-center justify-center text-white font-medium">
                    3
                  </div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    Secure Payment
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <Shield className="h-5 w-5 text-green-600" />
                  <p className="text-sm">
                    Payment is processed securely via <strong>Razorpay</strong>.
                    You'll be redirected to complete payment after clicking "Pay Now".
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <img src="https://cdn.razorpay.com/static/assets/logo/payment.svg" alt="Razorpay" className="h-6" />
                  <span className="text-xs text-slate-500">UPI • Cards • NetBanking • Wallets</span>
                </div>
              </div>

              {/* Submit button - mobile */}
              <div className="lg:hidden">
                <Button
                  onClick={createOrderAndInitiatePayment}
                  disabled={isProcessing}
                  className="w-full h-14 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-lg shadow-btn-primary"
                  data-testid="place-order-button-mobile"
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${(total * 83).toFixed(0)}`
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item.productId || item.product?.id || item.id} className="flex gap-3">
                    <div className="relative">
                      <img
                        src={item.product?.images?.[0] || item.product?.imageUrl || '/placeholder.png'}
                        alt={item.product?.name || item.productName}
                        className="w-16 h-16 object-cover rounded-lg bg-slate-50"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">
                        {item.product?.name || item.productName}
                      </p>
                      <p className="text-sm text-slate-500">
                        ₹{(((item.product?.price ?? item.price ?? 0) * 83 * item.quantity).toFixed(0))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{(subtotal * 83).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${(shipping * 83).toFixed(0)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (GST)</span>
                  <span>₹{(tax * 83).toFixed(0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold text-slate-900">
                  <span>Total</span>
                  <span>₹{(total * 83).toFixed(0)}</span>
                </div>
              </div>

              {/* Submit button - desktop */}
              <div className="hidden lg:block mt-6">
                <Button
                  onClick={createOrderAndInitiatePayment}
                  disabled={isProcessing}
                  className="w-full h-14 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-lg shadow-btn-primary"
                  data-testid="place-order-button"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Pay Now'
                  )}
                </Button>
              </div>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                <Shield className="h-3 w-3" />
                <span>Secured by Razorpay • 256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
