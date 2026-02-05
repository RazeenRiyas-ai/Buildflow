import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DeliveryEarningsPage() {
    return (
        <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Earnings</h1>
                <span>Payout Day: <strong>Friday</strong></span>
            </div>

            <Card className="bg-primary text-primary-foreground" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
                <CardContent className="pt-6 text-center">
                    <div className="text-sm opacity-80 mb-1">Total Earned This Week</div>
                    <div className="text-4xl font-bold">$345.50</div>
                    <Button variant="ghost" className="mt-4 bg-white/20 hover:bg-white/30 text-white border-none">View Breakdown</Button>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <Card>
                    <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex justify-between mb-2">
                            <span className="text-muted">Completed Trips</span>
                            <span className="font-bold">14</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-muted">Online Hours</span>
                            <span className="font-bold">24h 10m</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">Customer Rating</span>
                            <span className="font-bold text-primary">4.9 ★</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Recent Payouts</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="flex justify-between items-center pb-2 border-b last:border-0">
                                <div>
                                    <div className="font-medium">Direct Deposit</div>
                                    <div className="text-xs text-muted">Oct {25 - i * 7}, 2024</div>
                                </div>
                                <div className="font-bold">$420.00</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
