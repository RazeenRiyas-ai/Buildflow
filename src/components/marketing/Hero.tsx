'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './hero.module.css';
import { useAuth, useUser } from '@clerk/nextjs';

export function Hero() {
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const role = (user?.publicMetadata?.role as string) || 'CUSTOMER';
    const routes: Record<string, string> = {
        'CUSTOMER': '/customer',
        'SUPPLIER': '/supplier',
        'DELIVERY': '/delivery',
        'ADMIN': '/admin'
    };
    const dashboardLink = routes[role] || '/customer';

    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>
                    Build Faster with <br />
                    <span className={styles.highlight}>Buildflow</span>
                </h1>
                <p className={styles.subtitle}>
                    The operating system for modern construction. Connect with top suppliers,
                    track deliveries in real-time, and manage your projects from one platform.
                </p>
                <div className={styles.actions}>
                    <Button href={isSignedIn ? dashboardLink : "/login"} size="lg">
                        {isSignedIn ? "Go to Dashboard" : "Start Building"}
                    </Button>
                    <Button href="/how-it-works" variant="outline" size="lg">Learn More</Button>
                </div>
            </div>
        </section>
    );
}
