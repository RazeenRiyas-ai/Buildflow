'use client';

import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useFCM = () => {
    const { isSignedIn } = useAuth();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (!isSignedIn || !messaging) return;

        const requestPermissionAndGetToken = async () => {
            try {
                // Request permission
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    // Get token
                    // NOTE: VAPID Key should be added here ideally, but optional if configured in Firebase Console
                    const currentToken = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
                    });

                    if (currentToken) {
                        setToken(currentToken);
                        // Send token to backend
                        await api.put('/users/profile/fcm-token', { token: currentToken });
                        console.log('FCM Token registered and sent to backend.');
                    }
                }
            } catch (error) {
                console.error('An error occurred while retrieving token. ', error);
            }
        };

        requestPermissionAndGetToken();

        // Listen for foreground messages
        const unsubscribe = onMessage(messaging, (payload: any) => {
            console.log('Message received. ', payload);
            toast.info(payload.notification?.title || 'New Notification', {
                description: payload.notification?.body,
            });
        });

        return () => {
            unsubscribe();
        };
    }, [isSignedIn]);

    return { token };
};
