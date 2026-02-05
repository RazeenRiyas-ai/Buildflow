import { Sidebar } from '@/components/platform/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { label: 'Overview', href: '/admin' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Orders', href: '/admin/orders' },
        { label: 'Disputes', href: '/admin/disputes' },
        { label: 'Settings', href: '/admin/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar items={navItems} role="Super Admin" username="HQ Admin" />
            <main className="flex-1 ml-[280px] p-8" style={{ marginLeft: '280px', padding: '2rem' }}>
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
