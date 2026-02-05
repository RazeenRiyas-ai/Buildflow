import { Navbar } from '@/components/marketing/Navbar';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t py-8 bg-muted">
                <div className="container text-center text-sm text-muted">
                    &copy; {new Date().getFullYear()} Buildflow. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
