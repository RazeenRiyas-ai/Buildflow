'use client';

import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

interface MapProps {
    initialViewState?: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    markers?: Array<{
        latitude: number;
        longitude: number;
        color?: string;
        label?: string;
    }>;
    directions?: any; // google.maps.DirectionsResult
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const DEFAULT_CENTER = {
    lat: 40.7128,
    lng: -74.0060
};

const containerStyle = {
    width: '100%',
    height: '100%'
};

export function Map({ initialViewState, markers = [], directions, className, style, children }: MapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

    // MOCK MODE: Check for mock key or missing key
    const isMock = !apiKey || apiKey.includes('Mock');

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: isMock ? '' : apiKey,
        libraries: ['places', 'geometry'] // Pre-load common libs
    });

    const center = useMemo(() => ({
        lat: initialViewState?.latitude || DEFAULT_CENTER.lat,
        lng: initialViewState?.longitude || DEFAULT_CENTER.lng
    }), [initialViewState]);

    if (isMock) {
        return (
            <div className={`relative overflow-hidden bg-[#e8eaed] ${className}`} style={style}>
                {/* Simulated Google Maps Grid Background */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Google Maps (Simulated Mode)
                        </span>
                        <p className="text-[10px] text-gray-500 mt-1">Real API Key required for live rendering</p>
                    </div>
                </div>

                {/* Render Mock Markers */}
                {markers.map((marker, idx) => (
                    <div
                        key={idx}
                        className="absolute transform -translate-x-1/2 -translate-y-full"
                        style={{
                            left: '50%',
                            top: '50%'
                        }}
                    >
                        <MapPin
                            size={40}
                            className={`drop-shadow-lg text-red-600 fill-red-600`}
                        />
                        {marker.label && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap z-10">
                                {marker.label}
                            </div>
                        )}
                    </div>
                ))}
                {children}
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={`relative flex items-center justify-center bg-gray-100 ${className}`} style={style}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} style={style}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={initialViewState?.zoom || 13}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {directions && <DirectionsRenderer directions={directions} />}

                {markers.map((marker, idx) => (
                    <Marker
                        key={idx}
                        position={{ lat: marker.latitude, lng: marker.longitude }}
                        label={marker.label ? { text: marker.label, color: 'black', fontWeight: 'bold', fontSize: '12px', className: 'bg-white px-1 rounded shadow-sm relative -top-8' } : undefined}
                    />
                ))}
                {children}
            </GoogleMap>
        </div>
    );
}
