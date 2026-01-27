import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, Store, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { adminApi, vendorsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalVendors: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    pendingVendors: 0,
  });
  const [pendingVendors, setPendingVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, vendors] = await Promise.all([
        adminApi.getStats(),
        vendorsApi.getAll('pending'),
      ]);

      setStats(statsData);
      setPendingVendors(vendors);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      await vendorsApi.approve(vendorId);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to approve vendor:', error);
    }
  };

  const handleRejectVendor = async (vendorId) => {
    try {
      await vendorsApi.reject(vendorId);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to reject vendor:', error);
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600 bg-green-100', change: '+12.5%' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600 bg-blue-100', change: '+8.2%' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-purple-600 bg-purple-100', change: '+5.1%' },
    { title: 'Total Vendors', value: stats.totalVendors, icon: Store, color: 'text-orange-600 bg-orange-100', change: '+2.4%' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-pink-600 bg-pink-100', change: '+15.3%' },
    { title: 'Pending Vendors', value: stats.pendingVendors, icon: AlertCircle, color: 'text-yellow-600 bg-yellow-100', alert: true },
  ];

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of your Cranberry performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="font-display text-2xl font-bold text-slate-900 mt-1">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change} from last month
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Vendor Approvals */}
      {pendingVendors.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                  Pending Vendor Approvals
                </CardTitle>
                <CardDescription>
                  Review and approve new vendor applications
                </CardDescription>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">
                {pendingVendors.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  data-testid={`pending-vendor-${vendor.id}`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="w-12 h-12 rounded-xl bg-white"
                    />
                    <div>
                      <p className="font-medium text-slate-900">{vendor.name}</p>
                      <p className="text-sm text-slate-500">{vendor.email}</p>
                      <p className="text-xs text-slate-400">
                        Applied {new Date(vendor.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectVendor(vendor.id)}
                      className="text-red-600 hover:bg-red-50"
                      data-testid={`reject-vendor-${vendor.id}`}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproveVendor(vendor.id)}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid={`approve-vendor-${vendor.id}`}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New order placed', time: '2 minutes ago', icon: ShoppingCart },
                { action: 'Vendor application received', time: '1 hour ago', icon: Store },
                { action: 'Product approved', time: '3 hours ago', icon: Package },
                { action: 'New user registered', time: '5 hours ago', icon: Users },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.action}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Store className="h-6 w-6 mb-2" />
                <span>Manage Vendors</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Package className="h-6 w-6 mb-2" />
                <span>Review Products</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <ShoppingCart className="h-6 w-6 mb-2" />
                <span>View Orders</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Users className="h-6 w-6 mb-2" />
                <span>Manage Users</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
