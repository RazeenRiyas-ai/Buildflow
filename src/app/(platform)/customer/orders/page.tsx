'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Star, Truck, CheckCircle, Package, MapPin, Phone, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Map } from '@/components/ui/Map';

interface Order {
    id: string;
    totalAmount: string;
    status: string;
    createdAt: string;
    supplier: { name: string };
    items: {
        quantity: number;
        product: { name: string; price: string };
    }[];
}

interface TrackingUpdate {
    lat: number;
    lng: number;
    status: string;
}

export default function CustomerOrdersPage() {
    const { getToken } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [trackingInfo, setTrackingInfo] = useState<Record<string, TrackingUpdate>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                const data = await api.get<Order[]>('/orders', { token: token || undefined });
                setOrders(data);

                // Join Socket Rooms for Active Orders
                const socket = getSocket();
                const active = data.filter(o => ['ACCEPTED', 'SHIPPED'].includes(o.status));
                active.forEach(order => {
                    socket.emit('join_order', order.id);
                });

                // Listen for location updates
                socket.on('location_update', (data: TrackingUpdate & { orderId?: string }) => {
                    const shippedOrder = active.find(o => o.status === 'SHIPPED');
                    if (shippedOrder) {
                        setTrackingInfo(prev => ({
                            ...prev,
                            [shippedOrder.id]: data
                        }));
                    }
                });

                // Listen for Status Updates (Toasts)
                socket.on('order_status_updated', (data: { orderId: string, status: string, message: string }) => {
                    console.log("Status Update Received:", data);
                    toast.success(data.message, {
                        description: `Order #${data.orderId.slice(0, 8)} is now ${data.status}`,
                        duration: 5000,
                    });

                    // Refresh orders to update badge status
                    fetchOrders();
                });

            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();

        return () => {
            getSocket().off('location_update');
            getSocket().off('order_status_updated');
        };
    }, []);

    const activeOrders = orders.filter(o => ['PENDING', 'ACCEPTED', 'SHIPPED'].includes(o.status));
    const pastOrders = orders.filter(o => ['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(o.status));

    // Determine Map View State based on first active shipped order or default
    const shippedOrder = activeOrders.find(o => o.status === 'SHIPPED');
    const liveLoc = shippedOrder ? trackingInfo[shippedOrder.id] : null;

    const mapViewState = liveLoc ? {
        latitude: liveLoc.lat,
        longitude: liveLoc.lng,
        zoom: 14 // Zoom in when tracking
    } : {
        latitude: 40.7128,
        longitude: -74.0060, // Default NYC
        zoom: 13
    };

    const mapMarkers = liveLoc ? [{
        latitude: liveLoc.lat,
        longitude: liveLoc.lng,
        label: "Your Driver",
        color: "#2563eb" // Primary Blue
    }] : [];

    return (
        <div className="min-h-screen bg-gray-50 pb-24 relative overflow-hidden">

            {/* Full Screen Map Background */}
            <div className="fixed inset-0 z-0">
                <Map
                    initialViewState={mapViewState}
                    markers={mapMarkers}
                    className="h-full w-full"
                />
                {/* Map Overlay Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none"></div>
            </div>

            <div className="relative z-10 px-4 pt-6 max-w-lg mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6 drop-shadow-sm pointer-events-none">My Orders</h1>

                {/* Active Orders - Premium Tracking Card */}
                {activeOrders.length > 0 && (
                    <div className="space-y-6">
                        {activeOrders.map(order => {
                            const isLive = trackingInfo[order.id];
                            const status = order.status;
                            const progress = status === 'PENDING' ? 10 : status === 'ACCEPTED' ? 30 : status === 'SHIPPED' ? 70 : 100;

                            return (
                                <div key={order.id} className="relative group">
                                    {/* Glassmorphism Card */}
                                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">

                                        {/* Header: Status & ETA */}
                                        <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                                        {isLive ? 'Arriving in 15 mins' : 'Order Placed'}
                                                    </h2>
                                                    <p className="text-sm font-medium text-gray-500 mt-1">
                                                        {isLive ? 'Driver is on the way' : 'Waiting for confirmation'}
                                                    </p>
                                                </div>
                                                <div className="animate-pulse">
                                                    <Badge className="bg-primary text-white text-xs px-3 py-1 shadow-lg shadow-primary/30 rounded-full uppercase tracking-wider">
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-6 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span>Confirmed</span>
                                                <span>Packed</span>
                                                <span>On Way</span>
                                                <span>Delivered</span>
                                            </div>
                                        </div>

                                        {/* Driver Profile Section */}
                                        <div className="px-6 py-4 border-t border-gray-100 bg-white/50">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-full bg-gray-200 border-2 border-white shadow-md overflow-hidden">
                                                        <img src="https://i.pravatar.cc/150?u=driver" alt="Driver" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] p-1 rounded-full border border-white">
                                                        <ShieldCheck size={10} />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900">Anirudh (Valet)</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                            Vaccinated
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-medium">4.9 <Star size={10} className="inline text-yellow-400 fill-yellow-400" /></span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" className="rounded-full w-10 h-10 border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors p-0 flex items-center justify-center">
                                                        <Phone size={18} />
                                                    </Button>
                                                    <Button variant="outline" className="rounded-full w-10 h-10 border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors p-0 flex items-center justify-center">
                                                        <MessageSquare size={18} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items Snippet */}
                                        <div className="bg-gray-50/50 p-4 border-t border-dashed border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm text-lg">
                                                    🧱
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-gray-700 uppercase">Order Details</p>
                                                    <p className="text-sm text-gray-600">{order.items.length} items from <span className="font-semibold text-gray-900">{order.supplier.name}</span></p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">${Number(order.totalAmount).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic Island Pill (simulated) */}
                                    {isLive && (
                                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-700">
                                            <div className="relative w-2 h-2">
                                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
                                                <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
                                            </div>
                                            <span className="text-xs font-medium">Live Activity: Driver nearby</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Past Orders - Minimal List */}
                {pastOrders.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Past Orders</h2>
                        <div className="grid gap-4">
                            {pastOrders.map(order => (
                                <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-center md:justify-between hover:shadow-md transition-shadow relative z-20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl grayscale opacity-70">
                                            📦
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{order.supplier.name}</h3>
                                            <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-0.5">
                                                <CheckCircle size={10} /> Delivered
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right mt-2 md:mt-0">
                                        <p className="font-bold text-gray-900 text-sm">${Number(order.totalAmount).toFixed(2)}</p>
                                        <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-primary mt-1 hover:bg-primary/5">Reorder</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
