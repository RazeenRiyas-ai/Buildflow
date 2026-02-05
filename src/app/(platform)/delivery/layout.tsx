import { Sidebar } from '@/components/platform/Sidebar';

export default function DeliveryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { label: 'Available Jobs', href: '/delivery' },
        { label: 'My Deliveries', href: '/delivery/active' },
        { label: 'Earnings', href: '/delivery/earnings' },
    ];

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar items={navItems} role="Delivery Partner" username="Mike R." />
            <main className="flex-1 ml-[280px] p-8" style={{ marginLeft: '280px', padding: '2rem' }}>
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
