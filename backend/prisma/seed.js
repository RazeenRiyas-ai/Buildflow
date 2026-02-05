const prisma = require('../src/config/prisma');
const bcrypt = require('bcrypt');

async function main() {
    console.log('🌱 Starting seed...');

    // consistent password for all test users
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const customer = await prisma.user.upsert({
        where: { email: 'customer@demo.com' },
        update: {},
        create: {
            email: 'customer@demo.com',
            name: 'Alex Builder',
            password,
            role: 'CUSTOMER',
            profile: {
                create: {
                    address: '123 Construction Site, Downtown',
                    city: 'Metropolis',
                    phone: '+1 555-0101'
                }
            }
        }
    });

    const supplier = await prisma.user.upsert({
        where: { email: 'supplier@demo.com' },
        update: {},
        create: {
            email: 'supplier@demo.com',
            name: 'Mega Materials Ltd',
            password,
            role: 'SUPPLIER',
            profile: {
                create: {
                    address: 'Industrial Zone, Sector 4',
                    city: 'Metropolis',
                    businessName: 'Mega Materials',
                    phone: '+1 555-0202'
                }
            }
        }
    });

    const delivery = await prisma.user.upsert({
        where: { email: 'driver@demo.com' },
        update: {},
        create: {
            email: 'driver@demo.com',
            name: 'Fast Logistics',
            password,
            role: 'DELIVERY',
            profile: {
                create: {
                    vehicleInfo: 'Ford Transit - XL 2024',
                    city: 'Metropolis',
                    phone: '+1 555-0303'
                }
            }
        }
    });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@buildflow.com' },
        update: {},
        create: {
            email: 'admin@buildflow.com',
            name: 'System Admin',
            password,
            role: 'ADMIN'
        }
    });

    console.log('✅ Users created');

    // 2. Create Products
    const productsData = [
        { name: 'UltraTech Cement (50kg)', price: 8.50, category: 'Cement', stock: 500, description: 'Premium grade cement for all construction needs.' },
        { name: 'River Sand (1 Ton)', price: 45.00, category: 'Sand', stock: 100, description: 'High quality river sand, washed and filtered.' },
        { name: 'Red Bricks (1000pc)', price: 220.00, category: 'Bricks', stock: 50, description: 'Kiln fired red clay bricks.' },
        { name: 'TMT Steel Bars (12mm)', price: 650.00, category: 'Steel', stock: 200, description: 'High strength reinforcement bars.' },
        { name: 'Gravel 20mm (1 Ton)', price: 35.00, category: 'Aggregates', stock: 150, description: 'Coarse aggregate for concrete.' },
        { name: 'White Cement (25kg)', price: 12.00, category: 'Cement', stock: 300, description: 'Decorative white cement.' },
        { name: 'Exterior Paint (20L)', price: 85.00, category: 'Paint', stock: 80, description: 'Weather proof exterior emulsion.' },
        { name: 'PVC Pipes 4inch (6m)', price: 18.00, category: 'Pipes', stock: 400, description: 'Durable plumbing pipes.' }
    ];

    for (const p of productsData) {
        await prisma.product.create({
            data: {
                ...p,
                supplierId: supplier.id
            }
        });
    }

    console.log('✅ Products seeded');

    // 3. Create Orders (Demo history)
    // Active Order (Pending)
    const product1 = await prisma.product.findFirst({ where: { name: { contains: 'Cement' } } });

    await prisma.order.create({
        data: {
            customerId: customer.id,
            supplierId: supplier.id,
            totalAmount: 425.00, // 50 * 8.5
            status: 'PENDING',
            items: {
                create: [
                    { productId: product1.id, quantity: 50, price: 8.50 }
                ]
            }
        }
    });

    // Completed Order
    const product2 = await prisma.product.findFirst({ where: { name: { contains: 'Sand' } } });
    const completedOrder = await prisma.order.create({
        data: {
            customerId: customer.id,
            supplierId: supplier.id,
            totalAmount: 450.00,
            status: 'DELIVERED',
            createdAt: new Date(Date.now() - 86400000), // Yesterday
            items: {
                create: [
                    { productId: product2.id, quantity: 10, price: 45.00 }
                ]
            }
        }
    });

    await prisma.delivery.create({
        data: {
            orderId: completedOrder.id,
            partnerId: delivery.id,
            status: 'COMPLETED',
            pickupAddress: 'Industrial Zone',
            dropoffAddress: '123 Construction Site',
            deliveryFee: 50.00,
            startedAt: new Date(Date.now() - 80000000),
            completedAt: new Date(Date.now() - 78000000)
        }
    });

    console.log('✅ Orders Seeding Complete. Ready for startup scale! 🚀');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
