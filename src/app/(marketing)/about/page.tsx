export default function AboutPage() {
    return (
        <div className="container py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">About Buildflow</h1>

                <div className="prose prose-lg text-muted-foreground">
                    <p className="text-xl mb-6">
                        Buildflow is on a mission to modernize the construction industry. We believe that sourcing materials should be as easy as ordering lunch.
                    </p>

                    <p className="mb-6">
                        Founded in 2024, we realized that the biggest bottleneck in construction wasn't the building itself, but the logistics of getting materials to the site. Delays, opaque pricing, and lack of coordination were the norm.
                    </p>

                    <p className="mb-6">
                        We built a platform that brings transparency and efficiency to the process. By connecting Suppliers, Customers, and Delivery Partners in a unified ecosystem, we eliminate friction and help you build faster.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
                    <div className="p-6 bg-muted rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-2">500+</div>
                        <div className="text-sm">Active Suppliers</div>
                    </div>
                    <div className="p-6 bg-muted rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-2">10k+</div>
                        <div className="text-sm">Orders Delivered</div>
                    </div>
                    <div className="p-6 bg-muted rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-2">98%</div>
                        <div className="text-sm">On-Time Rate</div>
                    </div>
                    <div className="p-6 bg-muted rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                        <div className="text-sm">Support</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
