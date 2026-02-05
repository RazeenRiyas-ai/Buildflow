import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function SupplierDashboard() {
    const stats = [
        { label: 'Today Orders', value: '12', trend: '+20%' },
        { label: 'Pending Request', value: '4', trend: 'Urgent' },
        { label: 'Revenue (Today)', value: '$1,240', trend: '+5%' },
        { label: 'Low Stock Items', value: '2', trend: 'Alert' },
    ];

    const incomingOrders = [
        { id: '#8821', items: '50x Cement Bags', customer: 'John Doe', loc: 'Downtown', time: '5m ago' },
        { id: '#8822', items: '2000x Red Bricks', customer: 'Build Corp', loc: 'Westside', time: '12m ago' },
    ];

    return (
        <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Good Morning, ZamZam</h1>
                    <p className="text-muted">Here is what is happening with your store today.</p>
                </div>
                <Button>+ Add New Product</Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-6">
                            <div className="text-muted text-sm font-medium">{stat.label}</div>
                            <div className="text-2xl font-bold mt-2">{stat.value}</div>
                            <div className="text-xs text-primary mt-1">{stat.trend}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Active Area */}
            <div className="grid grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Incoming Orders */}
                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 className="text-xl font-bold">Incoming Orders</h2>
                    {incomingOrders.map((order) => (
                        <Card key={order.id} className="border-l-4 border-l-primary" style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--primary)' }}>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg">{order.id}</span>
                                        <Badge variant="warning">New</Badge>
                                    </div>
                                    <p className="font-medium mt-1">{order.items}</p>
                                    <p className="text-sm text-muted">{order.customer} • {order.loc}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button size="sm">Accept</Button>
                                    <Button size="sm" variant="outline" className="text-destructive border-destructive">Reject</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Quick Stock */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Stock Alerts</h2>
                    <Card>
                        <CardContent className="pt-6 space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="flex justify-between items-center">
                                <span>UltraTech Cement</span>
                                <Badge variant="destructive">Low (50 units)</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>River Sand</span>
                                <Badge variant="warning">Med (2 tons)</Badge>
                            </div>
                            <Button variant="outline" fullWidth>Manage Inventory</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
