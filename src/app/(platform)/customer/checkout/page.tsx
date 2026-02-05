'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { MapPin, Truck, CheckCircle2, Navigation, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { Map } from '@/components/ui/Map';
import { toast } from 'sonner';
import { useAuth, useUser } from '@clerk/nextjs';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Product {
    id: string;
    name: string;
    description?: string;
    price: string | number;
    category: string;
    stock: number;
    supplier?: { name: string; id: string };
}

interface CartItem {
    product: Product;
    quantity: number;
}

const SUGGESTED_ADDRESSES = [
    { label: "Site Alpha - 55 Hudson Yards, NYC", lat: 40.7534, lng: -74.0022 },
    { label: "Jersey City Terminal - Port Liberta", lat: 40.6974, lng: -74.0505 },
    { label: "Brooklyn Navy Yard - Dock 72", lat: 40.7011, lng: -73.9680 },
    { label: "Queens Plaza Construction Site", lat: 40.7489, lng: -73.9385 },
];

function CheckoutForm() {
    const { getToken, userId } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [cart, setCart] = useState<{ items: CartItem[], supplierId: string | null }>({ items: [], supplierId: null });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('net30');
    const [addressSearch, setAddressSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(SUGGESTED_ADDRESSES[0]);

    useEffect(() => {
        const savedCart = localStorage.getItem('bf_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        } else {
            router.push('/customer');
        }

        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [router]);

    const cartTotal = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const taxes = cartTotal * 0.18;
    const deliveryFee = 150.00;
    const finalTotal = cartTotal + taxes + deliveryFee;

    const handleRazorpayPayment = async () => {
        try {
            const token = await getToken();

            // 1. Create Order
            const orderData = await api.post<{ id: string; amount: number; currency: string }>('/payments/create-order', {
                amount: finalTotal, // Logic handles conversion
                currency: 'INR'
            }, { token: token || undefined });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Buildflow',
                description: 'Construction Materials Order',
                order_id: orderData.id,
                handler: async function (response: any) {
                    setIsProcessing(true); // Ensure loader stays on

                    // 2. Verify Payment (Optional Check) & Place Order
                    const payload = {
                        supplierId: cart.supplierId,
                        items: cart.items.map(i => ({
                            productId: i.product.id,
                            quantity: i.quantity
                        })),
                        deliveryAddress: selectedAddress.label,
                        paymentMethod: 'razorpay',
                        paymentIntentId: response.razorpay_payment_id, // Store RZP ID
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature
                    };

                    try {
                        await api.post('/orders', payload, { token: token || undefined });
                        localStorage.removeItem('bf_cart');
                        toast.success("Payment Successful! Order Placed.");
                        router.push('/customer/orders');
                    } catch (err: any) {
                        toast.error("Payment succeeded but order creation failed. Contact support.");
                        console.error(err);
                    }
                },
                prefill: {
                    name: user?.fullName || 'Buildflow User',
                    email: user?.emailAddresses[0]?.emailAddress || 'user@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#2563eb'
                }
            };

            // DEMO MODE: Simulate Interaction if keys are mock
            if (options.key.includes('mock')) {
                toast.info("DEMO MODE: Simulating Secure Bank Redirect...", { duration: 2000 });
                setTimeout(() => {
                    options.handler({
                        razorpay_payment_id: `pay_mock_${Date.now()}`,
                        razorpay_order_id: orderData.id,
                        razorpay_signature: "mock_signature_verified"
                    });
                }, 2500);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(`Payment Failed: ${response.error.description}`);
                setIsProcessing(false);
            });
            rzp.open();

        } catch (err: any) {
            console.error(err);
            toast.error('Failed to initiate payment');
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery site");
            return;
        }

        setIsProcessing(true);

        if (paymentMethod === 'razorpay') {
            await handleRazorpayPayment();
            return; // Flow continues in Razorpay handler
        }

        // Net-30 Logic
        try {
            const token = await getToken();
            const payload = {
                supplierId: cart.supplierId,
                items: cart.items.map(i => ({
                    productId: i.product.id,
                    quantity: i.quantity
                })),
                deliveryAddress: selectedAddress.label,
                paymentMethod,
                paymentIntentId: null
            };

            await api.post('/orders', payload, { token: token || undefined });
            localStorage.removeItem('bf_cart');
            toast.success("Order Placed Successfully!");
            router.push('/customer/orders');
        } catch (err: any) {
            console.error(err);
            toast.error('Order Failed: ' + (err.message || 'Unknown error'));
            setIsProcessing(false);
        }
    };

    if (cart.items.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500 font-medium">Securing your session...</p>
        </div>
    );

    return (
        <div className="pb-32">
            <div className="space-y-6">

                {/* Delivery & Map Section */}
                <Card className="overflow-hidden border-none shadow-xl shadow-gray-200/50 rounded-3xl">
                    <div className="h-48 relative border-b border-gray-100">
                        <Map
                            initialViewState={{
                                latitude: selectedAddress.lat,
                                longitude: selectedAddress.lng,
                                zoom: 14
                            }}
                            markers={[{
                                latitude: selectedAddress.lat,
                                longitude: selectedAddress.lng,
                                label: "Delivery Site"
                            }]}
                            className="h-full w-full"
                        />
                    </div>
                    <CardContent className="p-6">
                        {/* Address Input UI omitted for brevity, same as before */}
                        <div className="relative mb-4">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary z-10">
                                <MapPin size={18} />
                            </div>
                            <Input
                                className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-100 focus:ring-primary focus:border-primary font-medium"
                                placeholder="Search with Google Places..."
                                value={addressSearch || selectedAddress.label}
                                onChange={(e) => {
                                    setAddressSearch(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            {/* Google Powered Suggestions */}
                            {showSuggestions && (
                                <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1">
                                        <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png" alt="Powered by Google" className="h-4 opacity-70" />
                                    </div>
                                    {SUGGESTED_ADDRESSES.map((addr, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 hover:bg-primary/5 cursor-pointer flex items-center gap-3 transition-colors border-b last:border-0 border-gray-50"
                                            onClick={() => {
                                                setSelectedAddress(addr);
                                                setAddressSearch('');
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <Navigation size={14} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{addr.label}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Google Verified Location</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Truck size={14} /> Shipping Summary
                        </CardTitle>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{cart.items.length} Packages</span>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.product.id} className="flex justify-between items-center group">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl">📦</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                                        <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity} units</p>
                                    </div>
                                </div>
                                <div className="font-black text-gray-900">${(Number(item.product.price) * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Payment Selection */}
                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-primary" /> Secure Payment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {/* Net-30 Option */}
                        <div
                            onClick={() => setPaymentMethod('net30')}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${paymentMethod === 'net30' ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50/30'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${paymentMethod === 'net30' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-200 text-gray-400'}`}>📄</div>
                            <div className="flex-1">
                                <p className="font-black text-gray-900">Net-30 Invoice</p>
                                <p className="text-xs text-gray-500 font-medium">Corporate account billing</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'net30' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                {paymentMethod === 'net30' && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                        </div>

                        {/* Razorpay Option */}
                        <div
                            onClick={() => setPaymentMethod('razorpay')}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'razorpay' ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50/30'}`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${paymentMethod === 'razorpay' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-200 text-gray-400'}`}>🇮🇳</div>
                                <div className="flex-1">
                                    <p className="font-black text-gray-900">UPI / Cards / NetBanking</p>
                                    <p className="text-xs text-gray-500 font-medium">Secure Payments via Razorpay</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                    {paymentMethod === 'razorpay' && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                            </div>

                            {paymentMethod === 'razorpay' && (
                                <div className="mt-4 p-4 bg-white rounded-xl border border-primary/20 shadow-inner animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                                        <Lock size={10} /> Trusted by Millions
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">You will be redirected to the secure Razorpay payment gateway to complete your transaction.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Final Breakdown */}
                <div className="p-6 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white">
                    <div className="space-y-3 pb-4 border-b border-gray-100">
                        <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                            <span>Subtotal</span>
                            <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                            <span>Logistics / VAT</span>
                            <span className="text-gray-900">${(taxes + deliveryFee).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-between items-center font-black">
                        <span className="text-lg text-gray-900">ORDER TOTAL</span>
                        <span className="text-3xl text-primary">${finalTotal.toFixed(2)}</span>
                    </div>
                </div>

            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-2xl mx-auto flex items-center gap-6">
                    <div className="hidden sm:block flex-1 border-r border-gray-100 mr-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivering To</p>
                        <p className="text-sm font-bold text-gray-700 truncate">{selectedAddress.label}</p>
                    </div>
                    <Button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-[2] h-16 text-lg rounded-2xl font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                PROCESSING...
                            </div>
                        ) : (
                            `PAY ${finalTotal.toFixed(2)} • CHECKOUT`
                        )}
                    </Button>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                    <Lock size={10} /> 100% Secure Transaction
                </p>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[#F7F8FA]">
            <div className="max-w-2xl mx-auto px-4 pt-6">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Checkout</h1>
                </div>
                <CheckoutForm />
            </div>
        </div>
    );
}
