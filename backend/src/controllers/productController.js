const prisma = require('../config/prisma');

const getProducts = async (req, res) => {
    const { category, search, supplierId } = req.query;

    const where = {};
    if (category) where.category = category;
    if (supplierId) where.supplierId = supplierId;
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
        where,
        include: { supplier: { select: { name: true, id: true } } }
    });

    // Log search event if parameter exists
    if (search) {
        // Fire and forget search log
        prisma.eventLog.create({
            data: {
                userId: req.user ? req.user.id : null,
                eventType: 'SEARCH',
                metadata: { query: search },
                ipAddress: req.ip
            }
        }).catch(console.error);
    }

    res.json(products);
};

const createProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const supplierId = req.user.id;

    if (!name || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await prisma.product.create({
        data: {
            name,
            description,
            price,
            category,
            stock: stock || 0,
            supplierId
        }
    });

    await prisma.eventLog.create({
        data: {
            userId: supplierId,
            eventType: 'PRODUCT_CREATED',
            metadata: { productId: product.id, name: product.name }
        }
    });

    res.status(201).json(product);
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { price, stock, description } = req.body;
    const supplierId = req.user.id;

    // Verify ownership
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.supplierId !== supplierId) return res.status(403).json({ error: 'Not authorized' });

    const updated = await prisma.product.update({
        where: { id },
        data: { price, stock, description }
    });

    res.json(updated);
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct
};
