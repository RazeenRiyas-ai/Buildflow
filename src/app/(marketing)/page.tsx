import { Hero } from '@/components/marketing/Hero';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export default function LandingPage() {
    return (
        <>
            <Hero />

            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="mb-4">Everything you need to build</h2>
                        <p className="text-muted">Streamlined specifically for the construction industry.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <Card hoverable>
                            <CardHeader>
                                <CardTitle>For Customers</CardTitle>
                                <CardDescription> Contractors & Builders</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Access a vast network of verified suppliers. Compare prices, track orders in real-time, and manage invoices all in one place.
                            </CardContent>
                        </Card>

                        <Card hoverable>
                            <CardHeader>
                                <CardTitle>For Suppliers</CardTitle>
                                <CardDescription>Material Providers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Expand your reach and streamline operations. Receive digital orders, manage inventory, and get paid faster.
                            </CardContent>
                        </Card>

                        <Card hoverable>
                            <CardHeader>
                                <CardTitle>Deployment</CardTitle>
                                <CardDescription>Logistics Partners</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Optimize your fleet. Get optimized routes, proof of delivery tools, and instant assignments for your drivers.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
}
