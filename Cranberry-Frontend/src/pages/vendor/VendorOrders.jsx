import { useState, useEffect } from 'react';
import { ordersApi } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Package, Truck, CheckCircle, Clock, AlertCircle, User, IndianRupee, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice, getItemImage } from '../../lib/utils';

/**
 * VendorOrders - Displays orders containing vendor's products with ITEM-LEVEL status tracking
 * 
 * Each item can have its own status independent of other items in the order.
 * If a customer buys from multiple vendors, each vendor updates their own items' status.
 */
const VendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [updatingItemId, setUpdatingItemId] = useState(null);

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

    // Update individual item status
    const handleItemStatusUpdate = async (orderId, itemId, newStatus, productName) => {
        try {
            setUpdatingItemId(itemId);
            await ordersApi.updateVendorItemStatus(itemId, newStatus);

            // Update local state - update the specific item's status
            setOrders(orders.map(order => {
                if (order.orderId === orderId) {
                    return {
                        ...order,
                        items: order.items.map(item =>
                            item.itemId === itemId
                                ? { ...item, itemStatus: newStatus }
                                : item
                        )
                    };
                }
                return order;
            }));

            toast.success(`"${productName}" status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update item status:', error);
            toast.error(error.message || 'Failed to update item status');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'PENDING':
                return 'PROCESSING';
            case 'PROCESSING':
                return 'SHIPPED';
            case 'SHIPPED':
                return 'DELIVERED';
            default:
                return null;
        }
    };

    const canUpdateItemStatus = (status) => {
        return ['PENDING', 'PROCESSING', 'SHIPPED'].includes(status);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CREATED': return 'bg-slate-100 text-slate-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'PAID': return 'bg-emerald-100 text-emerald-700';
            case 'PROCESSING': return 'bg-blue-100 text-blue-700';
            case 'SHIPPED': return 'bg-purple-100 text-purple-700';
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status, size = 3) => {
        const sizeClass = size === 3 ? 'w-3 h-3' : 'w-4 h-4';
        switch (status) {
            case 'CREATED':
            case 'PENDING':
                return <Clock className={sizeClass} />;
            case 'PAID':
            case 'PROCESSING':
                return <Package className={sizeClass} />;
            case 'SHIPPED':
                return <Truck className={sizeClass} />;
            case 'DELIVERED':
                return <CheckCircle className={sizeClass} />;
            default:
                return <Package className={sizeClass} />;
        }
    };

    const getNextStatusLabel = (currentStatus) => {
        switch (currentStatus) {
            case 'PENDING':
                return 'Start Processing';
            case 'PROCESSING':
                return 'Mark Shipped';
            case 'SHIPPED':
                return 'Mark Delivered';
            default:
                return null;
        }
    };

    const getNextStatusButtonColor = (currentStatus) => {
        switch (currentStatus) {
            case 'PENDING':
                return 'bg-blue-600 hover:bg-blue-700';
            case 'PROCESSING':
                return 'bg-purple-600 hover:bg-purple-700';
            case 'SHIPPED':
                return 'bg-green-600 hover:bg-green-700';
            default:
                return '';
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
                    <h1 className="font-display text-3xl font-bold text-slate-900">Your Product Orders</h1>
                    <p className="text-slate-500 mt-1">Manage individual item fulfillment status</p>
                </div>
                <Button onClick={loadOrders} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-blue-900">Item-Level Status Tracking</p>
                    <p className="text-sm text-blue-700 mt-1">
                        Update the status of each item independently. When customers buy from multiple vendors,
                        each vendor manages their own items' fulfillment status separately.
                    </p>
                </div>
            </div>

            {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Orders</span>
                        <Badge variant="outline" className="font-normal">
                            {orders.length} order{orders.length !== 1 ? 's' : ''}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No orders found for your products yet.</p>
                                <p className="text-sm text-slate-400 mt-1">Orders will appear here when customers purchase your products.</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.orderId} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors">
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                                #{order.orderId}
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'N/A'}
                                                    {order.orderDate && ` • ${new Date(order.orderDate).toLocaleTimeString('en-IN')}`}
                                                </p>
                                                <p className="font-medium text-slate-900 flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {order.customerName || 'Customer'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-slate-900 flex items-center">
                                                    <IndianRupee className="w-4 h-4" />
                                                    {formatPrice(order.vendorSubtotal || 0)}
                                                </span>
                                                <span className="text-xs text-slate-500">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                                            </div>
                                            <Badge className={`${getStatusColor(order.orderStatus)} flex items-center gap-1`}>
                                                {getStatusIcon(order.orderStatus)}
                                                Order: {order.orderStatus}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Items List with Individual Status */}
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">
                                            Your Products - Update Each Item's Status
                                        </p>
                                        <div className="space-y-3">
                                            {order.items?.map((item, idx) => {
                                                const itemStatus = item.itemStatus || 'PENDING';
                                                const nextStatus = getNextStatus(itemStatus);
                                                const canUpdate = canUpdateItemStatus(itemStatus);

                                                return (
                                                    <div key={item.itemId || idx} className="bg-white rounded-lg p-3 border border-slate-200">
                                                        <div className="flex items-start gap-3">
                                                            <img
                                                                src={item.productImage || '/placeholder.png'}
                                                                alt={item.productName}
                                                                className="w-14 h-14 rounded-lg bg-white object-cover border border-slate-200"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div>
                                                                        <span className="font-medium text-slate-900 block">{item.productName}</span>
                                                                        <div className="text-slate-500 text-xs mt-0.5">
                                                                            ₹{formatPrice(item.unitPrice)} × {item.quantity} =
                                                                            <span className="font-semibold text-slate-700"> ₹{formatPrice(item.totalPrice)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <Badge className={`${getStatusColor(itemStatus)} flex items-center gap-1 text-xs shrink-0`}>
                                                                        {getStatusIcon(itemStatus, 3)}
                                                                        {itemStatus}
                                                                    </Badge>
                                                                </div>

                                                                {/* Item Status Action */}
                                                                <div className="mt-2 flex items-center justify-between">
                                                                    {canUpdate ? (
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => handleItemStatusUpdate(order.orderId, item.itemId, nextStatus, item.productName)}
                                                                            disabled={updatingItemId === item.itemId}
                                                                            className={`text-xs h-7 ${getNextStatusButtonColor(itemStatus)}`}
                                                                        >
                                                                            {updatingItemId === item.itemId ? (
                                                                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                                            ) : (
                                                                                <ArrowRight className="w-3 h-3 mr-1" />
                                                                            )}
                                                                            {getNextStatusLabel(itemStatus)}
                                                                        </Button>
                                                                    ) : itemStatus === 'DELIVERED' ? (
                                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                                            <CheckCircle className="w-3 h-3" />
                                                                            Delivered Successfully
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-xs text-slate-400">
                                                                            Status: {itemStatus}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Order Footer */}
                                    {order.trackingNumber && (
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <span className="text-sm text-slate-500 flex items-center gap-1">
                                                <Truck className="w-3 h-3" />
                                                Tracking: {order.trackingNumber}
                                            </span>
                                        </div>
                                    )}
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
