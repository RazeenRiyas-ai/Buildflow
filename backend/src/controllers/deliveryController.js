const prisma = require('../config/prisma');
const { getIo } = require('../socket');

const getAvailableDeliveries = async (req, res) => {
    // Delivery partners see orders that are "SEARCHING" for a driver
    const deliveries = await prisma.delivery.findMany({
        where: { status: 'SEARCHING' },
        include: {
            order: {
                include: {
                    supplier: { select: { name: true, profile: { select: { address: true } } } },
                    customer: { select: { name: true, profile: { select: { address: true } } } },
                    items: { include: { product: true } }
                }
            }
        }
    });
    res.json(deliveries);
};

const getMyDeliveries = async (req, res) => {
    const partnerId = req.user.id;
    const deliveries = await prisma.delivery.findMany({
        where: { partnerId },
        include: { order: true },
        orderBy: { updatedAt: 'desc' }
    });
    res.json(deliveries);
};

const acceptDelivery = async (req, res) => {
    const { id } = req.params;
    const partnerId = req.user.id;

    // Transaction logic could be better (check if already taken)
    const delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) return res.status(404).json({ error: 'Delivery job not found' });
    if (delivery.status !== 'SEARCHING') return res.status(400).json({ error: 'Job already taken' });

    const updated = await prisma.delivery.update({
        where: { id },
        data: {
            partnerId,
            status: 'ASSIGNED',
            startedAt: new Date()
        }
    });

    await prisma.eventLog.create({
        data: {
            userId: partnerId,
            eventType: 'DELIVERY_ACCEPTED',
            metadata: { deliveryId: id, orderId: delivery.orderId }
        }
    });

    res.json(updated);
};

const updateDeliveryStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // PICKED_UP, DELIVERED
    const partnerId = req.user.id;

    const delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    if (delivery.partnerId !== partnerId) return res.status(403).json({ error: 'Unauthorized' });

    const data = { status };
    if (status === 'COMPLETED') {
        data.completedAt = new Date();
        // Also update Order status
        await prisma.order.update({
            where: { id: delivery.orderId },
            data: { status: 'DELIVERED' }
        });
    } else if (status === 'PICKED_UP') {
        await prisma.order.update({
            where: { id: delivery.orderId },
            data: { status: 'SHIPPED' } // In transit
        });
    }

    const updated = await prisma.delivery.update({
        where: { id },
        data
    });

    await prisma.eventLog.create({
        data: {
            userId: partnerId,
            eventType: 'DELIVERY_UPDATE',
            metadata: { deliveryId: id, status }
        }
    });

    // Notify Customer about status change
    try {
        const io = getIo();
        let message = `Driver update: ${status}`;
        if (status === 'PICKED_UP') message = 'Driver has picked up your order!';
        if (status === 'COMPLETED') message = 'Order Delivered! 📦';

        io.to(`order_${delivery.orderId}`).emit('order_status_updated', {
            orderId: delivery.orderId,
            status: status === 'COMPLETED' ? 'DELIVERED' : 'SHIPPED',
            message
        });
    } catch (e) {
        console.error("Socket emit failed", e);
    }

    res.json(updated);
};

module.exports = {
    getAvailableDeliveries,
    getMyDeliveries,
    acceptDelivery,
    updateDeliveryStatus
};
