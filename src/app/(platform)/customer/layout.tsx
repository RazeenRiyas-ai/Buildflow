import { Sidebar } from '@/components/platform/Sidebar';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { label: 'Home', href: '/customer' },
        { label: 'My Orders', href: '/customer/orders' },
        { label: 'Profile', href: '/customer/profile' },
    ];

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar items={navItems} role="Customer" username="Alex Builder" />
            <main className="flex-1 ml-[280px] p-8" style={{ marginLeft: '280px', padding: '2rem' }}>
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
