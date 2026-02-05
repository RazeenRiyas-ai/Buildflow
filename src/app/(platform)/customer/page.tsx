'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import styles from './customer.module.css';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ChevronRight, Search } from 'lucide-react'; // Assuming we have or can use icons, if not fallback to text

interface Product {
    id: string;
    name: string;
    description?: string;
    price: string | number;
    category: string;
    stock: number;
    supplier?: { name: string; id: string };
    eta?: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function CustomerHome() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cart State
    const [cart, setCart] = useState<{ items: CartItem[], supplierId: string | null }>({ items: [], supplierId: null });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.get<Product[]>('/products');
                const mappedProducts = data.map(p => ({
                    ...p,
                    price: Number(p.price),
                    eta: ['25 mins', '45 mins', '1 hr', 'Same Day'][Math.floor(Math.random() * 4)]
                }));
                setProducts(mappedProducts);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        if (!product.supplier?.id) return;

        if (cart.supplierId && cart.supplierId !== product.supplier.id) {
            if (!confirm(`Switching suppliers? This will clear your cart from ${cart.items[0].product.supplier?.name}.`)) {
                return;
            }
            setCart({
                supplierId: product.supplier.id,
                items: [{ product, quantity: 1 }]
            });
            return;
        }

        setCart(prev => {
            const existing = prev.items.find(i => i.product.id === product.id);
            let newItems;
            if (existing) {
                newItems = prev.items.map(i =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                newItems = [...prev.items, { product, quantity: 1 }];
            }
            return {
                supplierId: product.supplier?.id || null,
                items: newItems
            };
        });
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategory(prev => prev === cat ? null : cat);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const cartTotal = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const goToCheckout = () => {
        // Pass cart data via query param or Context. 
        // For MVP simplicity, saving to localStorage is reliable.
        localStorage.setItem('bf_cart', JSON.stringify(cart));
        router.push('/customer/checkout');
    };

    return (
        <div className="pb-24"> {/* Padding bottom for smart bar */}
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Good Morning, Alex! 🏗️</h1>
                        <p className="text-sm text-muted">Ready to build something today?</p>
                    </div>
                    {/* Profile avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">A</div>
                </div>

                <div className="relative">
                    <Input
                        placeholder="Search for cement, steel, bricks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <span className="absolute left-3 top-2.5 text-muted-foreground">🔍</span>
                </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
                <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Categories</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {['Cement', 'Sand', 'Bricks', 'Steel', 'Aggregates', 'Pipes', 'Paint'].map(cat => (
                        <div
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`
                                cursor-pointer px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium
                                ${selectedCategory === cat
                                    ? 'bg-primary text-white shadow-md transform scale-105'
                                    : 'bg-white border border-gray-100 text-gray-600 hover:border-primary/50'}
                            `}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Popular Materials</h2>
            {isLoading ? (
                <div className="text-center py-12">Loading inventory...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No products found matching your search.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => {
                        const inCart = cart.items.find(i => i.product.id === product.id);
                        return (
                            <Card key={product.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-0 flex h-full">
                                    {/* Left: Image Placeholder */}
                                    <div className="w-1/3 bg-gray-100 flex items-center justify-center text-3xl rounded-l-lg">
                                        {product.category === 'Cement' ? '🧱' :
                                            product.category === 'Steel' ? '🏗️' :
                                                product.category === 'Sand' ? '🏜️' : '📦'}
                                    </div>

                                    {/* Right: Content */}
                                    <div className="w-2/3 p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-1">{product.supplier?.name}</p>
                                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                                🕒 {product.eta}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between items-end mt-3">
                                            <div className="text-lg font-bold text-gray-900">${Number(product.price).toFixed(2)}</div>
                                            <Button
                                                size="sm"
                                                className={`h-8 px-4 ${inCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock <= 0}
                                            >
                                                {inCart ? `Added (${inCart.quantity})` : 'ADD'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Smart Cart Bar */}
            {cartCount > 0 && (
                <div
                    onClick={goToCheckout}
                    className="fixed bottom-6 left-4 right-4 bg-[#1a1a1a] text-white p-4 rounded-xl shadow-2xl z-50 cursor-pointer hover:scale-[1.02] transition-transform flex justify-between items-center"
                    style={{ backdropFilter: 'blur(10px)' }}
                >
                    <div className="flex flex-col">
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{cartCount} ITEM{cartCount > 1 ? 'S' : ''}</div>
                        <div className="text-lg font-bold">Total: ${cartTotal.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-primary-foreground bg-primary px-4 py-2 rounded-lg">
                        View Cart <span className="text-xl">›</span>
                    </div>
                </div>
            )}
        </div>
    );
}
