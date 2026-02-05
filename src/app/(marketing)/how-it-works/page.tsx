import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HowItWorksPage() {
    return (
        <div className="container py-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-bold mb-6">How Buildflow Works</h1>
                <p className="text-xl text-muted-foreground">
                    We connect the entire construction supply chain in one seamless platform.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">1</div>
                    <h3 className="text-xl font-bold">Order Materials</h3>
                    <p className="text-muted-foreground">
                        Contractors browse a vast catalog of verified suppliers. Compare prices, check availability, and place orders instantly.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">2</div>
                    <h3 className="text-xl font-bold">Smart Dispatch</h3>
                    <p className="text-muted-foreground">
                        Our algorithm assigns the delivery to the nearest available logistics partner for the fastest turnaround time.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">3</div>
                    <h3 className="text-xl font-bold">Track & Build</h3>
                    <p className="text-muted-foreground">
                        Monitor your materials in real-time. Receive them on-site and keep your project moving without delays.
                    </p>
                </div>
            </div>

            <div className="mt-20 text-center">
                <Link href="/login">
                    <Button size="lg">Get Started Now</Button>
                </Link>
            </div>
        </div>
    );
}
