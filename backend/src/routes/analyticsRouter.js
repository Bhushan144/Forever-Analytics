import express from 'express';
import { 
    getOverviewMetrics, 
    getSessions, 
    getSessionJourney, 
    getProductAnalytics, 
    getSearchAnalytics, 
    getHeatmapData 
} from '../controllers/analyticsController.js';
import adminAuth from '../middleware/adminAuthMiddleware.js'; // Protect these routes!

const analyticsRouter = express.Router();

// Apply the existing Admin Auth middleware so public users can't view your data
analyticsRouter.use(adminAuth);

analyticsRouter.get('/overview', getOverviewMetrics);
analyticsRouter.get('/sessions', getSessions);
analyticsRouter.get('/sessions/:sessionId', getSessionJourney); // Lazy load journey
analyticsRouter.get('/products', getProductAnalytics);
analyticsRouter.get('/search', getSearchAnalytics);
analyticsRouter.get('/heatmap', getHeatmapData);

export default analyticsRouter;