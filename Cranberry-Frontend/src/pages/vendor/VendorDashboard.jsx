import { useState, useEffect } from 'react';
import { Package, ShoppingCart, IndianRupee, TrendingUp, Eye, MoreHorizontal, AlertCircle } from 'lucide-react';
import { vendorApi, ordersApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { formatPrice, getProductImage } from '../../lib/utils';

import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    status: 'approved',
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isNotVendor, setIsNotVendor] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get vendor dashboard stats from backend
      const dashboardData = await vendorApi.getDashboard();

      // Get vendor orders
      const orders = await ordersApi.getVendorOrders();

      setStats({
        totalProducts: dashboardData?.totalProducts || 0,
        totalOrders: dashboardData?.totalOrders || 0,
        totalRevenue: dashboardData?.totalRevenue || 0,
        pendingOrders: dashboardData?.pendingOrders || 0,
        status: dashboardData?.vendorStatus || 'approved',
      });

      setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);

      // Get vendor products for top products
      const products = await vendorApi.getProducts();
      setTopProducts(Array.isArray(products) ? products.slice(0, 5) : []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setErrorMsg(error.message || 'Failed to load dashboard data');
      if (error.response && error.response.status === 404) {
        setIsNotVendor(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isNotVendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4" data-testid="vendor-registration-prompt">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Package className="h-8 w-8 text-[#0071E3]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
          Become a Vendor
        </h2>
        <p className="text-slate-500 max-w-md mb-8">
          You haven't set up your vendor profile yet. Register your shop to start selling on Cranberry Marketplace.
        </p>
        <Button
          onClick={() => window.location.href = '/vendor/register'}
          className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-[#0071E3]/25"
        >
          Register Shop
        </Button>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600 bg-blue-100' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-green-600 bg-green-100' },
    { title: 'Revenue', value: `₹${formatPrice(stats.totalRevenue)}`, icon: IndianRupee, color: 'text-purple-600 bg-purple-100' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: TrendingUp, color: 'text-orange-600 bg-orange-100' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8" data-testid="vendor-dashboard">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Error Banner */}
      {errorMsg && !isNotVendor && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-900">Error Loading Dashboard</h3>
            <p className="text-sm text-red-700 mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Verification Banner */}
      {stats.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-900">Verification Pending</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your vendor account is currently pending approval. You can add products, but they won't be visible in the marketplace until an administrator approves your account.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={`stat-${stat.title}-${index}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="font-display text-2xl font-bold text-slate-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/vendor/orders')}>View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No orders yet</p>
              ) : (
                recentOrders.map((order, index) => (
                  <div key={order.id || order.orderId || `order-${index}`} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">#{order.id || order.orderId}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">₹{formatPrice(order.totalAmount || order.vendorSubtotal || 0)}</p>
                      <Badge className={getStatusColor(order.status || order.orderStatus)}>
                        {order.status || order.orderStatus}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No products yet</p>
              ) : (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.stock} in stock</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">₹{formatPrice(product.price)}</p>
                      <div className="flex items-center text-sm text-yellow-600">
                        <span>★ {product.rating}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
