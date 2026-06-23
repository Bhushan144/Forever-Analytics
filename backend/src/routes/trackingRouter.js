import express from 'express';
import { ingestEvents } from '../controllers/trackingController.js';

const trackingRouter = express.Router();

// Matches: POST /api/tracking/events
trackingRouter.post('/events', ingestEvents);

export default trackingRouter;