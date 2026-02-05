const prisma = require('../config/prisma');
const { getIo } = require('../socket');
const emailService = require('../services/emailService');

const createOrder = async (req, res) => {
    const { items, supplierId } = req.body; // items: [{ productId, quantity }]
    const customerId = req.user.id;

    if (!items || items.length === 0 || !supplierId) {
        return res.status(400).json({ error: 'Invalid order data' });
    }

    // Calculate total and verify products
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });

        totalAmount += Number(product.price) * item.quantity;
        orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
        });
    }

    // Transaction: Create Order + OrderItems
    const order = await prisma.order.create({
        data: {
            customerId,
            supplierId,
            totalAmount,
            status: 'PENDING',
            items: {
                create: orderItemsData
            }
        },
        include: { items: true }
    });

    // Log Event
    await prisma.eventLog.create({
        data: {
            userId: customerId,
            eventType: 'ORDER_PLACED',
            metadata: { orderId: order.id, total: totalAmount }
        }
    });

    // Send Email Confirmation (Async)
    const customer = await prisma.user.findUnique({ where: { id: customerId } });
    if (customer && customer.email) {
        emailService.sendOrderConfirmation(customer.email, {
            ...order,
            customerName: customer.name,
            total: totalAmount
        });
    }

    res.status(201).json(order);
};

const getOrders = async (req, res) => {
    const userId = req.user.id;
    const { role } = req.user;

    let where = {};
    if (role === 'CUSTOMER') where.customerId = userId;
    if (role === 'SUPPLIER') where.supplierId = userId;
    // ADMIN sees all, DELIVERY sees assigned (handled in separate endpoint usually, but can be added here)

    const orders = await prisma.order.findMany({
        where,
        include: {
            items: { include: { product: true } },
            customer: { select: { name: true } },
            supplier: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Authz logic
    if (userRole === 'SUPPLIER' && order.supplierId !== userId) return res.status(403).json({ error: 'Unauthorized' });
    if (userRole === 'CUSTOMER' && status === 'CANCELLED' && order.customerId !== userId) return res.status(403).json({ error: 'Unauthorized' });

    // Status transition logic could go here (e.g. can't cancel if shipped)

    const updated = await prisma.order.update({
        where: { id },
        data: { status }
    });

    // If status is accepted/shipped, we might want to trigger delivery creation logic
    if (status === 'ACCEPTED') {
        // Create Delivery record implicitly waiting for partner
        await prisma.delivery.create({
            data: {
                orderId: order.id,
                pickupAddress: 'Supplier Loc', // Should get from Supplier Profile
                dropoffAddress: 'Customer Loc', // Should get from Customer Profile
                status: 'SEARCHING'
            }
        }).catch(err => console.error("Auto-delivery creation failed", err));
    }

    await prisma.eventLog.create({
        data: {
            userId: userId,
            eventType: 'ORDER_STATUS_UPDATE',
            metadata: { orderId: id, oldStatus: order.status, newStatus: status }
        }
    });

    // Send Status Update Email (Async)
    const customer = await prisma.user.findUnique({ where: { id: order.customerId } });
    if (customer && customer.email) {
        emailService.sendOrderStatusUpdate(customer.email, order, status);
    }

    // Send Push Notification (Async)
    if (customer && customer.fcmToken) {
        require('../services/notificationService').sendPushNotification(
            customer.fcmToken,
            `Order ${status}`,
            `Your order #${order.id.slice(0, 8)} is now ${status}.`,
            { orderId: order.id, status }
        );
    }

    // Notify Customer
    try {
        const io = getIo();
        io.to(`order_${id}`).emit('order_status_updated', {
            orderId: id,
            status,
            message: `Order status updated to ${status}`
        });
    } catch (e) {
        console.error("Socket emit failed", e);
    }

    res.json(updated);
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};
