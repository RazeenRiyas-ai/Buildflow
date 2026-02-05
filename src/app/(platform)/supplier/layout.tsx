import { Sidebar } from '@/components/platform/Sidebar';

export default function SupplierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { label: 'Dashboard', href: '/supplier' },
        { label: 'Products', href: '/supplier/products' },
        { label: 'Orders', href: '/supplier/orders' },
        { label: 'Earnings', href: '/supplier/earnings' },
    ];

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar items={navItems} role="Supplier" username="ZamZam Const." />
            <main className="flex-1 ml-[280px] p-8" style={{ marginLeft: '280px', padding: '2rem' }}>
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
