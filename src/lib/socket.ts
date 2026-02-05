import { io, Socket } from 'socket.io-client';

// Use environment variable or default to localhost:3001
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

console.log('Connecting socket to:', SOCKET_URL);

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnectionAttempts: 5
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket?.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }
    return socket;
};
