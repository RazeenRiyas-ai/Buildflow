import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ShoppingCart, Truck, CheckCircle, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
    return (
        <div className="container py-20">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em', color: 'var(--foreground)' }}>How Buildflow Works</h1>
                <p className="text-xl" style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                    We connect the entire construction supply chain in one seamless platform. From ordering to final delivery, we handle the logistics so you can focus on building.
                </p>
            </div>

            <div className="grid gap-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Step 1 */}
                <div style={{ padding: '2rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', opacity: '0.05' }}>
                        <ShoppingCart size={120} />
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>1</div>
                    <h3 className="text-2xl font-bold mb-4">Order Materials</h3>
                    <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                        Contractors browse a vast catalog of verified suppliers. Compare prices, check real-time availability, and place orders instantly using flexible payment terms like Net 30 or standard cards.
                    </p>
                </div>

                {/* Step 2 */}
                <div style={{ padding: '2rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', opacity: '0.05' }}>
                        <Truck size={120} />
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>2</div>
                    <h3 className="text-2xl font-bold mb-4">Smart Dispatch</h3>
                    <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                        Once an order is accepted, our algorithm immediately pings nearby logistics partners. The most optimized driver accepts the job, providing transparent ETAs and live tracking.
                    </p>
                </div>

                {/* Step 3 */}
                <div style={{ padding: '2rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', opacity: '0.05' }}>
                        <CheckCircle size={120} />
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>3</div>
                    <h3 className="text-2xl font-bold mb-4">Track & Build</h3>
                    <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                        Monitor your materials in real-time via our live map. Receive instant push notifications upon drop-off, approve delivery with digital signatures, and keep your project moving without delays.
                    </p>
                </div>
            </div>

            <div className="mt-24 text-center p-12" style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius)' }}>
                <h2 className="text-3xl font-bold mb-4 text-white">Ready to streamline your site?</h2>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                    Join hundreds of contractors and suppliers who are building the future with Buildflow.
                </p>
                <Link href="/login">
                    <Button size="lg" variant="secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', color: 'var(--primary)' }}>
                        Get Started Now <ArrowRight size={18} />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
