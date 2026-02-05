const { verifyToken } = require('@clerk/backend');
const prisma = require('../config/prisma');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY
        });

        const userId = decoded.sub;
        const email = decoded.email || '';
        const role = decoded.metadata?.role || 'CUSTOMER';
        const name = decoded.name || 'User';

        // Sync user to local DB
        try {
            await prisma.user.upsert({
                where: { id: userId },
                update: {
                    email,
                    name,
                    role
                },
                create: {
                    id: userId,
                    email,
                    name,
                    role,
                    password: 'clerk_managed' // Placeholder for schema compliance
                }
            });
        } catch (dbErr) {
            console.error('User Sync Error:', dbErr);
            // Don't block request if sync fails, but warn. 
            // In strict mode, we might want to error out.
        }

        req.user = {
            id: userId,
            email,
            role,
            name
        };

        next();
    } catch (err) {
        console.error('Clerk Verified Failed:', err.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token', details: err.message });
    }
};

const roleGuard = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleGuard };
