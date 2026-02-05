import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminOrdersPage() {
    const allOrders = [
        { id: '#ORD-9921', customer: 'Alex Builder', supplier: 'ZamZam Const', total: '$420.00', status: 'Delivered' },
        { id: '#ORD-9922', customer: 'City Infra', supplier: 'RedClay Inc', total: '$1,200.00', status: 'Processing' },
        { id: '#ORD-9923', customer: 'Metro Devs', supplier: 'SteelWorks', total: '$6,500.00', status: 'Cancelled' },
    ];

    return (
        <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 className="text-2xl font-bold">Platform Orders</h1>

            <Card>
                <CardContent className="p-0">
                    <div className="flex flex-col gap-0 divide-y">
                        {allOrders.map((order) => (
                            <div key={order.id} className="p-4 flex items-center justify-between hover:bg-muted/10">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold">{order.id}</span>
                                        <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Processing' ? 'info' : 'destructive'}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted">
                                        {order.customer} purchased from {order.supplier}
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <span className="font-bold">{order.total}</span>
                                    <Button size="sm" variant="outline">View Details</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
