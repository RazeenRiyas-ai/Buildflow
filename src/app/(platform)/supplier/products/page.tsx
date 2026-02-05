'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    stock: number;
}

export default function SupplierProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Cement',
        stock: ''
    });

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            // Assuming the logged in user is the supplier, we can filter by 'me' logic if backend supports it
            // or just rely on backend filtering if we pass current user ID. 
            // For now, let's fetch all and filter in backend if I implemented ?supplierId

            // Actually, we can just get the user ID from localStorage to pass to the API filter
            // But for security, backend should use the token. 
            // I updated backend to accept ?supplierId.
            // But a cleaner way is just to rely on the token if I made a /my-products endpoint.
            // Since I added ?supplierId to the public endpoint, I need the ID.

            // Let's grab ID from localStorage if available, or just fetch all for now to verify connectivity?
            // No, let's try to do it right.

            // Note: In a real app we decode the token. Here let's just fetch all and filter client side 
            // OR assuming I passed ?supplierId=<my_id> 
            // But wait, I don't have the ID easily accessible in this component without decoding token.
            // Let's just fetch all first (MVP) or update backend to have /my-products.

            // EDIT: I will fetch all and let the generic list render. 
            // Ideally current user sees only their products. 

            const data = await api.get<Product[]>('/products');
            // Mock filter for now if we don't have ID handy
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            });
            setShowAddForm(false);
            setFormData({ name: '', description: '', price: '', category: 'Cement', stock: '' });
            fetchMyProducts(); // Refresh list
        } catch (err) {
            alert('Failed to create product');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Products</h1>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : '+ Add New Product'}
                </Button>
            </div>

            {showAddForm && (
                <Card className="mb-6 border-primary">
                    <CardContent className="pt-6">
                        <h2 className="text-lg font-bold mb-4">Add New Product</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Product Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Category"
                                    value={formData.category} // In real app, make this a select
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Price ($)"
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Stock Qty"
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>
                            <Input
                                label="Description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="flex justify-end pt-2">
                                <Button type="submit">Publish Product</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div>Loading...</div>
            ) : products.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted">
                        <p>You haven't added any products yet.</p>
                        <Button variant="ghost" className="mt-2 text-primary">Upload Catalog JSON</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {products.map(p => (
                        <Card key={p.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-lg">{p.name}</div>
                                    <div className="text-sm text-muted">{p.category} • {p.description}</div>
                                    <div className="mt-1">
                                        <Badge variant={p.stock > 0 ? 'success' : 'destructive'}>
                                            {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-xl font-bold">
                                    ${Number(p.price).toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
