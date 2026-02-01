import { useState, useEffect } from 'react';
import {
    Package, Clock, Truck, CheckCircle, XCircle,
    Filter, Search, RefreshCw, ChevronDown, Eye,
    IndianRupee, TrendingUp, AlertCircle, Loader2,
    CreditCard, Sparkles
} from 'lucide-react';
import { ordersApi, paymentsApi, aiApi, ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { Skeleton } from '../../components/ui/skeleton';
import { toast } from 'sonner';
import { formatPrice, getItemImage } from '../../lib/utils';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [aiInsights, setAiInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderPayment, setOrderPayment] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, [statusFilter, dateFilter]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Load orders
            let ordersData;
            if (statusFilter !== 'all' || dateFilter !== 'all') {
                const filterParams = {};
                if (statusFilter !== 'all') filterParams.status = statusFilter;
                if (dateFilter !== 'all') {
                    const today = new Date();
                    if (dateFilter === 'today') {
                        filterParams.startDate = today.toISOString().split('T')[0];
                        filterParams.endDate = today.toISOString().split('T')[0];
                    } else if (dateFilter === 'week') {
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        filterParams.startDate = weekAgo.toISOString().split('T')[0];
                        filterParams.endDate = today.toISOString().split('T')[0];
                    } else if (dateFilter === 'month') {
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        filterParams.startDate = monthAgo.toISOString().split('T')[0];
                        filterParams.endDate = today.toISOString().split('T')[0];
                    }
                }
                ordersData = await ordersApi.getFiltered(filterParams);
            } else {
                ordersData = await ordersApi.getAllAdmin();
            }
            // Defensive: ensure orders is always an array
            if (Array.isArray(ordersData)) {
                setOrders(ordersData);
            } else {
                setOrders([]);
            }

            // Load statistics
            const stats = await ordersApi.getStatistics();
            setStatistics(stats);
        } catch (error) {
            console.error('Failed to load orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const loadAiInsights = async () => {
        setIsLoadingInsights(true);
        try {
            const insights = await aiApi.getOrderInsights();
            setAiInsights(insights);
            toast.success('AI insights generated!');
        } catch (error) {
            console.error('Failed to load AI insights:', error);
            toast.error('Failed to generate AI insights');
        } finally {
            setIsLoadingInsights(false);
        }
    };

    const handleViewOrder = async (order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);

        // Load payment info
        try {
            const payment = await paymentsApi.getByOrderId(order.id);
            setOrderPayment(payment);
        } catch (error) {
            setOrderPayment(null);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await ordersApi.updateStatus(orderId, newStatus);
            toast.success(`Order status updated to ${ORDER_STATUS_LABELS[newStatus]}`);
            loadData();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error(error.message || 'Failed to update order status');
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

    const filteredOrders = orders.filter(order => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                order.id?.toString().includes(query) ||
                order.user?.name?.toLowerCase().includes(query) ||
                order.user?.email?.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const statCards = statistics ? [
        {
            title: 'Total Revenue',
            value: `₹${formatPrice(statistics.totalRevenue)}`,
            icon: IndianRupee,
            color: 'text-green-600 bg-green-100'
        },
        {
            title: 'Total Orders',
            value: statistics.totalOrders,
            icon: Package,
            color: 'text-blue-600 bg-blue-100'
        },
        {
            title: 'Pending',
            value: statistics.pendingOrders,
            icon: Clock,
            color: 'text-yellow-600 bg-yellow-100',
            alert: statistics.pendingOrders > 5
        },
        {
            title: 'Delivered',
            value: statistics.deliveredOrders,
            icon: CheckCircle,
            color: 'text-emerald-600 bg-emerald-100'
        },
    ] : [];

    return (
        <div className="space-y-8" data-testid="admin-orders">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-900">
                        Order Management
                    </h1>
                    <p className="text-slate-500 mt-1">
                        View and manage all customer orders
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={loadData}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={loadAiInsights}
                        disabled={isLoadingInsights}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {isLoadingInsights ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        AI Insights
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            {statistics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <Card key={stat.title}>
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
            )}

            {/* AI Insights Panel */}
            {aiInsights && (
                <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            AI-Powered Order Insights
                        </CardTitle>
                        <CardDescription>{aiInsights.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {aiInsights.insights?.slice(0, 3).map((insight, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl ${insight.type === 'POSITIVE' ? 'bg-green-100 border-green-200' :
                                        insight.type === 'WARNING' ? 'bg-yellow-100 border-yellow-200' :
                                            insight.type === 'ACTION_REQUIRED' ? 'bg-red-100 border-red-200' :
                                                'bg-blue-100 border-blue-200'
                                        } border`}
                                >
                                    <p className="font-semibold text-slate-900 text-sm">{insight.title}</p>
                                    <p className="text-xs text-slate-600 mt-1">{insight.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Top Products */}
                        {aiInsights.topProducts?.length > 0 && (
                            <div className="mt-6">
                                <p className="font-semibold text-slate-900 mb-3">Top Selling Products</p>
                                <div className="flex flex-wrap gap-2">
                                    {aiInsights.topProducts.map((product, index) => (
                                        <Badge key={index} variant="outline" className="bg-white">
                                            {product.productName} (₹{formatPrice(product.revenue)})
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by order ID, customer name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="Date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">Last 7 Days</SelectItem>
                                <SelectItem value="month">Last 30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} className="h-16 rounded-xl" />
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No orders found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Order ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Items</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Total</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-4 px-4">
                                                <span className="font-mono font-medium text-slate-900">#{order.id}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">{order.user?.name || 'Guest'}</p>
                                                    <p className="text-xs text-slate-500">{order.user?.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-slate-600">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-slate-600">
                                                {order.items?.length || 0} items
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-semibold text-slate-900">
                                                    ₹{formatPrice(order.totalAmount)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                                                    {getStatusIcon(order.status)}
                                                    <span>{ORDER_STATUS_LABELS[order.status] || order.status}</span>
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewOrder(order)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                    {/* Quick Status Actions for Admin */}
                                                    {order.status === 'PAID' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                                                            onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                                                        >
                                                            <Package className="h-3 w-3 mr-1" />
                                                            Process
                                                        </Button>
                                                    )}
                                                    {order.status === 'PROCESSING' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-purple-600 hover:bg-purple-700 h-8 text-xs"
                                                            onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                                                        >
                                                            <Truck className="h-3 w-3 mr-1" />
                                                            Ship
                                                        </Button>
                                                    )}
                                                    {order.status === 'SHIPPED' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                                                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                                                        >
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Deliver
                                                        </Button>
                                                    )}
                                                    {/* Full Status Dropdown for more control */}
                                                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                                        <Select
                                                            value={order.status}
                                                            onValueChange={(value) => handleUpdateStatus(order.id, value)}
                                                        >
                                                            <SelectTrigger className="w-8 h-8 p-0">
                                                                <ChevronDown className="h-4 w-4" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                                                                    <SelectItem key={key} value={key} className="text-xs">
                                                                        {label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
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
                                    {ORDER_STATUS_LABELS[selectedOrder.status]}
                                </Badge>
                                <span className="text-2xl font-bold text-slate-900">
                                    ₹{formatPrice(selectedOrder.totalAmount)}
                                </span>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-slate-50 rounded-xl p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Customer</h4>
                                <p className="text-sm text-slate-600">{selectedOrder.user?.name}</p>
                                <p className="text-sm text-slate-500">{selectedOrder.user?.email}</p>
                                <p className="text-sm text-slate-500 mt-2">{selectedOrder.shippingAddress}</p>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-3">Order Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getItemImage(item)}
                                                    alt={item.product?.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <p className="font-medium text-slate-900">{item.product?.name}</p>
                                                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-semibold">₹{formatPrice(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Info */}
                            {orderPayment && (
                                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="h-5 w-5 text-green-600" />
                                        <h4 className="font-semibold text-green-800">Payment Details</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-slate-500">Status</p>
                                            <p className="font-medium text-green-700">{orderPayment.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Amount</p>
                                            <p className="font-medium">₹{formatPrice(orderPayment.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Razorpay Order ID</p>
                                            <p className="font-mono text-xs">{orderPayment.razorpayOrderId}</p>
                                        </div>
                                        {orderPayment.razorpayPaymentId && (
                                            <div>
                                                <p className="text-slate-500">Payment ID</p>
                                                <p className="font-mono text-xs">{orderPayment.razorpayPaymentId}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminOrders;
