const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');
const { authMiddleware, roleGuard } = require('../middlewares/auth');

// Public endpoint for frontend to dump events
// We might want optional auth here, but often telemetry happens before login (e.g. landing page visits)
// For this MVP, we allow public ingestion but attach user info if header exists.
const optionalAuth = (req, res, next) => {
    // Attempt auth but don't block if failed
    try {
        authMiddleware(req, res, () => next());
    } catch {
        next();
    }
};

router.post('/event', authMiddleware, telemetryController.logEvent); // Let's simplify: require auth for now or make a separate public endpoint? 
// Re-thinking: "Data Driven" means tracking *everything*. Landing page visitors are anon.
// Let's make a separate public wrapper or use the optional logic manually.

router.post('/collect', (req, res, next) => {
    // Custom wrapper to extract user from token if present, but proceed otherwise
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Logic to decode without verifying strictness or reusing middleware that doesn't 401
        // For simplicity in this step, we'll just forward to controller. 
        // Controller checks req.user which is set by authMiddleware. 
        // We need a middleware that Decodes-But-Does-Not-Throw.
    }
    next();
}, telemetryController.logEvent);

// Admin only metrics
router.get('/metrics', authMiddleware, roleGuard(['ADMIN']), telemetryController.getMetrics);

module.exports = router;
