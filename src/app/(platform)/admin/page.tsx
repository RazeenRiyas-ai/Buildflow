'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface PlatformStats {
    totalRevenue: string; // From aggregate
    totalOrders: number;
    activeOrders: number;
    totalUsers: number;
}

interface EventLog {
    id: string;
    eventType: string;
    userId: string;
    createdAt: string;
    user?: { name: string; role: string };
    metadata?: any;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<PlatformStats>({
        totalRevenue: '0',
        totalOrders: 0,
        activeOrders: 0,
        totalUsers: 0
    });
    const [recentEvents, setRecentEvents] = useState<EventLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Admin endpoint
                const data = await api.get<any>('/telemetry/metrics');

                // Set stats
                if (data.stats) {
                    setStats(data.stats);
                }

                // Set Logs
                if (data.recentEvents) {
                    setRecentEvents(data.recentEvents);
                }
            } catch (err) {
                console.error('Failed to load admin metrics', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const dashboardStats = [
        { label: 'Total Revenue', value: `$${Number(stats.totalRevenue).toLocaleString()}`, trend: 'Lifetime' },
        { label: 'Active Orders', value: stats.activeOrders, trend: 'In Progress' },
        { label: 'Total Orders', value: stats.totalOrders, trend: 'Lifetime' },
        { label: 'Total Users', value: stats.totalUsers, trend: 'All Roles' },
    ];

    const formatEvent = (event: EventLog) => {
        const time = new Date(event.createdAt).toLocaleTimeString();
        const user = event.user ? `${event.user.name} (${event.user.role})` : 'Anonymous';
        return {
            text: `${event.eventType} by ${user}`,
            subtext: `${time} • ${JSON.stringify(event.metadata)}`
        };
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Platform Overview</h1>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {dashboardStats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-6">
                            <div className="text-sm text-muted font-medium">{stat.label}</div>
                            <div className="text-3xl font-bold mt-2">{stat.value}</div>
                            <div className="text-xs text-primary mt-1">{stat.trend}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Approvals (Mock for now, or link to Users) */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">System Actions</h2>
                    </div>
                    <Card>
                        <CardContent className="p-4 grid gap-4">
                            <Button variant="outline" className="justify-start">Manage Users (Coming Soon)</Button>
                            <Button variant="outline" className="justify-start">Dispute Resolution (0 Open)</Button>
                            <Button variant="outline" className="justify-start">Platform Settings</Button>
                        </CardContent>
                    </Card>
                </section>

                {/* Live Activity Feed */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Live Activity</h2>
                    </div>
                    <Card className="h-full">
                        <CardContent className="pt-6">
                            {isLoading ? (
                                <div className="text-center text-muted">Loading live feed...</div>
                            ) : recentEvents.length === 0 ? (
                                <div className="text-center text-muted">No recent activity.</div>
                            ) : (
                                <div className="space-y-6">
                                    {recentEvents.map((event) => {
                                        const fmt = formatEvent(event);
                                        return (
                                            <div key={event.id} className="flex gap-4">
                                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium truncate">{fmt.text}</p>
                                                    <p className="text-xs text-muted truncate">{fmt.subtext}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
