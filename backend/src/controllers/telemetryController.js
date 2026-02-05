const prisma = require('../config/prisma');

const logEvent = async (req, res) => {
    const { eventType, metadata } = req.body;
    const userId = req.user ? req.user.id : null;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    if (!eventType) {
        return res.status(400).json({ error: 'eventType is required' });
    }

    try {
        const event = await prisma.eventLog.create({
            data: {
                eventType,
                metadata: metadata || {},
                userId,
                ipAddress,
                userAgent
            }
        });

        res.status(201).json({ status: 'captured', eventId: event.id });
    } catch (error) {
        console.error('Telemetry Error:', error);
        res.status(200).json({ status: 'ignored', error: 'Internal logging error' });
    }
};

const getMetrics = async (req, res) => {
    try {
        // Business Metrics
        const usersCount = await prisma.user.count();
        const ordersCount = await prisma.order.count();

        // Active Orders (Pending, Accepted, Shipped)
        const activeOrders = await prisma.order.count({
            where: { status: { in: ['PENDING', 'ACCEPTED', 'SHIPPED'] } }
        });

        // Total Revenue (Sum of delivered orders)
        // Note: In a real app we'd use aggregate, but SQLite/adapters can be tricky with decimals in some versions.
        // Prisma aggregate is standard though.
        const header = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { in: ['DELIVERED'] } } // Only count recognized revenue
        });
        const totalRevenue = header._sum.totalAmount ? header._sum.totalAmount.toString() : '0';

        // Recent Activity
        const recentEvents = await prisma.eventLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, role: true } } }
        });

        console.log('Metrics calculated:', { usersCount, ordersCount, totalRevenue });

        res.json({
            stats: {
                totalUsers: usersCount,
                totalOrders: ordersCount,
                activeOrders,
                totalRevenue
            },
            recentEvents
        });
    } catch (err) {
        console.error("Metrics Error", err);
        res.status(500).json({ error: "Failed to load metrics" });
    }
};

module.exports = {
    logEvent,
    getMetrics
};
