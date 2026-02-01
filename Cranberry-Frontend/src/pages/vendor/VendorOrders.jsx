import { useState, useEffect } from 'react';
import { ordersApi, ORDER_STATUSES } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const VendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            let data = await ordersApi.getVendorOrders();

            // Handle wrapped response (if interceptor didn't unwrap it)
            if (data && data.data && Array.isArray(data.data)) {
                data = data.data;
            }

            // Defensive check: ensure data is an array
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.warn('Received non-array data for orders:', data);
                setOrders([]);
            }
            setErrorMsg(null);
        } catch (error) {
            console.error('Failed to load orders:', error);
            setErrorMsg('Failed to load orders. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            await ordersApi.updateStatus(orderId, newStatus);

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'PROCESSING': return 'bg-blue-100 text-blue-700';
            case 'SHIPPED': return 'bg-purple-100 text-purple-700';
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-900">Orders</h1>
                    <p className="text-slate-500 mt-1">Manage and track your customer orders</p>
                </div>
                <Button onClick={loadOrders} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">No orders found.</p>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                                #{order.id}
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN')} • {new Date(order.createdAt).toLocaleTimeString('en-IN')}
                                                </p>
                                                <p className="font-medium text-slate-900">
                                                    Customer: {order.user?.name || 'Unknown'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-slate-900">₹{order.totalAmount ? (order.totalAmount * 83).toFixed(2) : '0.00'}</span>
                                                <span className="text-xs text-slate-500">{order.items?.length || 0} items</span>
                                            </div>
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="bg-slate-50 rounded-lg p-3 mb-4">
                                        <div className="space-y-2">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <img
                                                        src={item.product?.imageUrl || '/placeholder.png'}
                                                        alt={item.product?.name}
                                                        className="w-8 h-8 rounded bg-white object-cover border border-slate-200"
                                                    />
                                                    <div className="flex-1 text-sm">
                                                        <span className="font-medium text-slate-900">{item.product?.name}</span>
                                                        <span className="text-slate-500"> x {item.quantity}</span>
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900">₹{(item.price * 83).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <div className="text-sm text-slate-500">
                                            Update Status:
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {['PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                                                <Button
                                                    key={status}
                                                    size="sm"
                                                    variant={order.status === status ? "default" : "outline"}
                                                    disabled={order.status === status || updatingId === order.id}
                                                    onClick={() => handleStatusUpdate(order.id, status)}
                                                    className={order.status === status ? 'bg-green-600 hover:bg-green-700' : ''}
                                                >
                                                    {status === 'PROCESSING' && <Package className="w-3 h-3 mr-1" />}
                                                    {status === 'SHIPPED' && <Truck className="w-3 h-3 mr-1" />}
                                                    {status === 'DELIVERED' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorOrders;
