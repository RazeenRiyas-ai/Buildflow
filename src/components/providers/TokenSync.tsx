'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { api } from '@/lib/api';

export function TokenSync() {
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        const syncToken = async () => {
            if (isSignedIn) {
                try {
                    // Get raw JWT from Clerk
                    const token = await getToken();
                    if (token) {
                        // 1. Save to LocalStorage for api.ts legacy support
                        localStorage.setItem('auth_token', token);

                        // 2. Update api client instance directly (if it has state)
                        api.setToken(token);
                    }
                } catch (err) {
                    console.error('Failed to sync token', err);
                }
            } else {
                // Clear on logout
                localStorage.removeItem('auth_token');
                api.setToken(null);
            }
        };

        syncToken();

        // Refresh token periodically (every 10 min)
        const interval = setInterval(syncToken, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [isSignedIn, getToken]);

    return null; // Headless component
}
