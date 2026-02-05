const prisma = require('../config/prisma');

const getProfile = async (req, res) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Don't send password
    const { password, ...safeUser } = user;
    res.json(safeUser);
};

const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { address, city, phone, businessName, vehicleInfo } = req.body;

    // Upsert profile
    const profile = await prisma.profile.upsert({
        where: { userId },
        update: { address, city, phone, businessName, vehicleInfo },
        create: { userId, address, city, phone, businessName, vehicleInfo }
    });

    await prisma.eventLog.create({
        data: {
            userId,
            eventType: 'PROFILE_UPDATED'
        }
    });

    res.json(profile);
};

module.exports = {
    getProfile,
    updateProfile
};
