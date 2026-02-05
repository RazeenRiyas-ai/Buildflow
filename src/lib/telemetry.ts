import { api } from './api';

class TelemetryService {
    private queue: any[] = [];
    private flushInterval: NodeJS.Timeout | null = null;
    private FLUSH_DELAY = 5000; // 5 seconds

    log(eventType: string, metadata: any = {}) {
        const event = {
            eventType,
            metadata,
            timestamp: new Date().toISOString(),
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        // For MVP, just fire and forget immediately to ensure capture
        // In prod, we'd batch this
        this.send(event);
    }

    private async send(event: any) {
        try {
            await api.post('/telemetry/event', event);
        } catch (err) {
            console.warn('Telemetry failed:', err);
        }
    }
}

export const telemetry = new TelemetryService();
