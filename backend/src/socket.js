const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // Allow all for MVP, restrict in Prod
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Join a specific room for an order (Driver or Customer)
        socket.on('join_order', (orderId) => {
            socket.join(`order_${orderId}`);
            console.log(`Socket ${socket.id} joined order_${orderId}`);
        });

        // Driver sends location update
        socket.on('update_location', ({ orderId, lat, lng, status }) => {
            // Broadcast to everyone in that order room (Client)
            io.to(`order_${orderId}`).emit('location_update', { lat, lng, status });
            console.log(`Location update for ${orderId}: ${lat}, ${lng}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIo };
