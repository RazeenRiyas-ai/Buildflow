'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

type OrderStatus = 'PENDING' | 'ACCEPTED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REJECTED';

interface OrderItem {
    id: string;
    product: { name: string };
    quantity: number;
}

interface Order {
    id: string;
    items: OrderItem[];
    totalAmount: string;
    customer: { name: string };
    status: OrderStatus;
    createdAt: string;
}

export default function SupplierOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await api.get<Order[]>('/orders');
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: OrderStatus) => {
        try {
            await api.patch(`/orders/${id}/status`, { status });
            // Optimistic update or refetch
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update order status");
        }
    };

    const getBadgeVariant = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'ACCEPTED': return 'info';
            case 'SHIPPED': return 'info';
            case 'DELIVERED': return 'success';
            case 'REJECTED': return 'destructive';
            case 'CANCELLED': return 'destructive';
            default: return 'default';
        }
    };

    const formatItems = (items: OrderItem[]) => {
        if (!items || items.length === 0) return 'No items';
        return items.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <Button size="sm" variant="outline" onClick={fetchOrders} disabled={isLoading}>
                    Refresh
                </Button>
            </div>

            {isLoading ? (
                <div>Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-muted border-2 border-dashed p-8 text-center rounded-lg">
                    No orders found.
                </div>
            ) : (
                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map((order) => (
                        <Card key={order.id} className={order.status === 'REJECTED' || order.status === 'CANCELLED' ? 'opacity-50' : ''}>
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-lg">{order.id.substring(0, 8)}...</span>
                                        <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
                                    </div>
                                    <div className="font-medium text-lg">{formatItems(order.items)}</div>
                                    <div className="text-sm text-muted mt-1">
                                        {order.customer?.name || 'Unknown Customer'} • {formatTime(order.createdAt)}
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end gap-2">
                                    <div className="text-xl font-bold">${Number(order.totalAmount).toFixed(2)}</div>

                                    {order.status === 'PENDING' && (
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'ACCEPTED')}>
                                                Accept Order
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-destructive border-destructive"
                                                onClick={() => handleStatusUpdate(order.id, 'REJECTED')}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}

                                    {order.status === 'ACCEPTED' && (
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="outline" disabled>
                                                Waiting for Driver...
                                            </Button>
                                        </div>
                                    )}

                                    {order.status === 'REJECTED' && (
                                        <span className="text-sm text-destructive font-medium">Order Rejected</span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
