import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminDisputesPage() {
    return (
        <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 className="text-2xl font-bold">Dispute Resolution</h1>

            <div className="grid gap-4" style={{ display: 'grid', gap: '1rem' }}>
                <Card className="border-l-4 border-l-destructive" style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--destructive)' }}>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="destructive">Urgent</Badge>
                                    <span className="text-sm text-muted">Opened 2 hours ago</span>
                                </div>
                                <h3 className="text-lg font-bold">Order #ORD-7721: Items damaged on arrival</h3>
                                <p className="text-muted mt-1">Customer claims 20% of bricks were broken. Photos attached.</p>
                            </div>
                            <Button>Resolve</Button>
                        </div>
                        <div className="bg-muted p-3 rounded text-sm flex gap-8">
                            <span><strong>Customer:</strong> Alex Builder</span>
                            <span><strong>Partner:</strong> Mike R.</span>
                            <span><strong>Amount At Risk:</strong> $120.00</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="opacity-75">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">Resolved</Badge>
                                    <span className="text-sm text-muted">Closed yesterday</span>
                                </div>
                                <h3 className="text-lg font-bold">Order #ORD-6610: Late delivery refund request</h3>
                            </div>
                            <Button variant="outline" disabled>Closed</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
