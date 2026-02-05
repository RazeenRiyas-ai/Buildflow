'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';

interface ActiveJob {
    id: string;
    orderId: string;
    pickupAddress: string;
    dropoffAddress: string;
    status: string;
    deliveryFee: string | number;
    createdAt: string;
    order: {
        totalAmount: string;
        items: { product: { name: string } }[]
    }
}

export default function ActiveDeliveryPage() {
    const [job, setJob] = useState<ActiveJob | null>(null);
    const [pastJobs, setPastJobs] = useState<ActiveJob[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const simulationRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobs = await api.get<ActiveJob[]>('/delivery/my-jobs');
                const active = jobs.find(j => ['ASSIGNED', 'PICKED_UP'].includes(j.status));
                if (active) setJob(active);
                setPastJobs(jobs.filter(j => j.status === 'COMPLETED'));
            } catch (err) {
                console.error("Failed to load jobs", err);
            }
        };

        fetchJobs();
    }, []);

    const updateStatus = async (status: 'PICKED_UP' | 'COMPLETED') => {
        if (!job) return;
        try {
            await api.patch(`/delivery/${job.id}/status`, { status });
            setJob({ ...job, status });
            if (status === 'COMPLETED') {
                stopSimulation();
                alert('Great job! Delivery completed. 💵');
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Simulate GPS Movement
    const toggleSimulation = () => {
        if (isSimulating) {
            stopSimulation();
        } else {
            startSimulation();
        }
    };

    const startSimulation = () => {
        if (!job) return;
        setIsSimulating(true);
        const socket = getSocket();
        socket.emit('join_order', job.orderId);

        let progress = 0;
        simulationRef.current = setInterval(() => {
            progress += 0.01; // Mock movement
            if (progress > 1) progress = 0;

            // Mock Lat/Lng for demo (e.g. moving from Warehouse to Site)
            const lat = 40.7128 + (progress * 0.01);
            const lng = -74.0060 + (progress * 0.01);

            socket.emit('update_location', {
                orderId: job.orderId,
                lat,
                lng,
                status: 'MOVING'
            });
            console.log('Emitting location:', lat, lng);
        }, 3000); // Every 3 seconds
    };

    const stopSimulation = () => {
        if (simulationRef.current) clearInterval(simulationRef.current);
        setIsSimulating(false);
    };

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-2xl font-bold mb-4">Current Delivery</h1>
                {!job ? (
                    <Card className="border-dashed p-8 text-center text-muted">
                        <p>No active delivery.</p>
                        <Button variant="link" onClick={() => window.location.href = '/delivery'}>Find a Job</Button>
                    </Card>
                ) : (
                    <Card className="border-primary shadow-lg">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">Order #{job.orderId.slice(0, 8)}</h2>
                                    <p className="text-sm text-muted">{job.order.items.length} Items • ${Number(job.order.totalAmount).toFixed(2)}</p>
                                </div>
                                <Badge className="bg-primary text-white animate-pulse">{job.status}</Badge>
                            </div>

                            <div className="space-y-8 border-l-2 border-dashed border-gray-300 ml-2 pl-6 relative py-2">
                                <div className="relative">
                                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ${job.status === 'ASSIGNED' ? 'bg-primary animate-pulse' : 'bg-green-500'}`}></div>
                                    <h3 className="font-bold text-sm">Pickup</h3>
                                    <p className="text-sm text-gray-600">{job.pickupAddress}</p>
                                </div>
                                <div className="relative">
                                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${job.status === 'PICKED_UP' ? 'border-primary bg-primary animate-pulse' : 'border-gray-400 bg-white'}`}></div>
                                    <h3 className="font-bold text-sm">Dropoff</h3>
                                    <p className="text-sm text-gray-600">{job.dropoffAddress}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {job.status === 'ASSIGNED' && (
                                    <Button onClick={() => updateStatus('PICKED_UP')} className="w-full col-span-2">
                                        Confirm Pickup
                                    </Button>
                                )}
                                {job.status === 'PICKED_UP' && (
                                    <Button onClick={() => updateStatus('COMPLETED')} variant="success" className="w-full col-span-2">
                                        Confirm Delivery
                                    </Button>
                                )}

                                <Button
                                    variant={isSimulating ? "destructive" : "secondary"}
                                    onClick={toggleSimulation}
                                    className="col-span-2"
                                >
                                    {isSimulating ? "Stop GPS Broadcast" : "Start GPS Simulation"}
                                </Button>
                            </div>
                            {isSimulating && <div className="text-xs text-center text-green-600 font-mono animate-pulse">📡 Broadcasting location updates...</div>}
                        </CardContent>
                    </Card>
                )}
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">Past Deliveries</h2>
                <div className="space-y-4">
                    {pastJobs.map((j) => (
                        <Card key={j.id}>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-bold">{j.id.substring(0, 8)}...</div>
                                    <div className="text-sm text-muted">{j.pickupAddress} ➔ {j.dropoffAddress}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-success">
                                        ${Number(j.deliveryFee || 25.00).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-muted">
                                        {new Date(j.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
