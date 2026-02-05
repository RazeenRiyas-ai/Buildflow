import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SupplierEarningsPage() {
    return (
        <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Earnings & Payouts</h1>
                <Button variant="outline">Download Report</Button>
            </div>

            <div className="grid grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$12,450.00</div>
                        <p className="text-xs text-muted mt-1">+20% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <section className="mt-8">
                <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
                <Card>
                    <div className="divide-y">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                                <div>
                                    <div className="font-medium">Order Payment #ORD-882{i}</div>
                                    <div className="text-sm text-muted">Oct {20 + i}, 2024</div>
                                </div>
                                <div className="text-right font-bold text-success" style={{ color: 'green' }}>
                                    +$240.00
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
        </div>
    );
}
