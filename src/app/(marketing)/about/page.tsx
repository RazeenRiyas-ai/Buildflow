import { Building, Globe, Zap, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container py-20">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-5xl font-bold mb-6" style={{ letterSpacing: '-0.02em', color: 'var(--foreground)' }}>About Buildflow</h1>
                <p className="text-2xl" style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                    Modernizing the construction industry, one delivery at a time.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div style={{ lineHeight: '1.8', color: 'var(--foreground)', fontSize: '1.1rem' }}>
                    <p className="mb-6">
                        We believe that sourcing construction materials should be as straightforward as ordering lunch. Founded in 2024, Buildflow emerged from a simple realization: the biggest bottleneck in construction isn't the building itself, but the opaque, slow, and fragmented logistics behind it.
                    </p>
                    <p>
                        By connecting Suppliers, Contractors, and Delivery Partners in a unified, real-time ecosystem, we eliminate friction. We provide transparent pricing, live tracking, and seamless financial tools to help everyone build faster and smarter.
                    </p>
                </div>
                <div style={{ backgroundColor: 'var(--muted)', padding: '3rem', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', opacity: '0.1', color: 'var(--primary)' }}>
                        <Building size={200} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4" style={{ position: 'relative' }}>Our Mission</h3>
                    <p style={{ color: 'var(--muted-foreground)', position: 'relative' }}>
                        To become the digital backbone of the global construction supply chain, empowering local businesses to operate with enterprise-level efficiency.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 mt-16 text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div style={{ padding: '2rem', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <Users size={32} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
                    <div className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>500+</div>
                    <div style={{ color: 'var(--muted-foreground)', fontWeight: '500' }}>Active Suppliers</div>
                </div>
                <div style={{ padding: '2rem', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <Globe size={32} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
                    <div className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>10k+</div>
                    <div style={{ color: 'var(--muted-foreground)', fontWeight: '500' }}>Orders Delivered</div>
                </div>
                <div style={{ padding: '2rem', backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <Zap size={32} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
                    <div className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>98%</div>
                    <div style={{ color: 'var(--muted-foreground)', fontWeight: '500' }}>On-Time Rate</div>
                </div>
            </div>
        </div>
    );
}
