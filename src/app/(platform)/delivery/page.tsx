'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface DeliveryJob {
    id: string;
    orderId: string;
    pickupAddress: string;
    dropoffAddress: string;
    deliveryFee: string | number;
    order: {
        items: { product: { name: string } }[];
    };
    distanceKm?: number;
}

export default function DeliveryDashboard() {
    const router = useRouter();
    const [availableJobs, setAvailableJobs] = useState<DeliveryJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await api.get<DeliveryJob[]>('/delivery/available');
            setAvailableJobs(data);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptJob = async (id: string) => {
        try {
            await api.post(`/delivery/${id}/accept`, {});
            alert('Job Accepted! 🚚');
            router.push('/delivery/active');
        } catch (err) {
            console.error(err);
            alert('Failed to accept job');
        }
    };

    const handleIgnoreJob = (id: string) => {
        setAvailableJobs(prev => prev.filter(job => job.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Active Deliveries</h1>
                    <p className="text-muted">You are currently online and visible.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted">Today's Earnings</div>
                    <div className="text-2xl font-bold text-primary">$45.00</div>
                </div>
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden">
                <div className="bg-muted w-full h-[300px] flex items-center justify-center text-muted-foreground relative">
                    <span className="z-10 text-lg font-medium">Map View Area</span>
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full animate-pulse border-2 border-white shadow-lg"></div>
                    <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="p-4 bg-white border-t flex justify-between items-center">
                    <div className="font-medium text-sm">View Full Map</div>
                    <Link href="/delivery/active">
                        <Button size="sm" variant="outline">Go to Active Job</Button>
                    </Link>
                </div>
            </Card>

            <h2 className="text-xl font-bold mt-4">Available Jobs Near You</h2>
            {isLoading ? (
                <div className="py-8 text-center">Loading available jobs...</div>
            ) : availableJobs.length === 0 ? (
                <div className="text-center py-8 text-muted border-2 border-dashed rounded-lg">
                    No jobs available in your area right now.
                </div>
            ) : (
                <div className="grid gap-4">
                    {availableJobs.map((job) => (
                        <Card key={job.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-lg">{job.id.substring(0, 8)}...</span>
                                            <Badge variant="info">{job.distanceKm || 'Unknown'} km</Badge>
                                        </div>
                                        <div className="text-sm text-muted mb-2">
                                            {job.order.items.map(i => i.product.name).join(', ')}
                                        </div>
                                    </div>
                                    <div className="text-xl font-bold text-primary">
                                        ${Number(job.deliveryFee || 25.00).toFixed(2)}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-4 pl-4 border-l-2 border-dashed border-muted">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-secondary"></div>
                                        <p className="text-sm font-medium">Pick up: {job.pickupAddress}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary"></div>
                                        <p className="text-sm font-medium">Drop off: {job.dropoffAddress}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button fullWidth onClick={() => handleAcceptJob(job.id)}>Accept Job</Button>
                                    <Button variant="outline" fullWidth onClick={() => handleIgnoreJob(job.id)}>Ignore</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
