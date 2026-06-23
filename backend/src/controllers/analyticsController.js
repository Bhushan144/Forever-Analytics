import AnalyticsSession from '../models/analyticsSessionModel.js';
import AnalyticsEvent from '../models/analyticsEventModel.js';
import AnalyticsVisitor from '../models/analyticsVisitorModel.js';

//OVERVIEW API (Metrics for top cards)
export const getOverviewMetrics = async (req, res) => {
    try {
        const totalVisitors = await AnalyticsVisitor.countDocuments();
        
        // Fast aggregation using our pre-calculated session summaries!
        const sessionStats = await AnalyticsSession.aggregate([
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    totalPageViews: { $sum: "$page_view_count" },
                    totalClicks: { $sum: "$click_count" },
                    // Dynamically calculate Average Duration in milliseconds
                    avgDurationMs: { $avg: { $subtract: ["$end_time", "$start_time"] } }
                }
            }
        ]);

        const stats = sessionStats[0] || { totalSessions: 0, totalPageViews: 0, totalClicks: 0, avgDurationMs: 0 };
        // Convert MS to seconds for the frontend (safely handle null from empty aggregation)
        stats.avgDurationSeconds = Math.round((stats.avgDurationMs || 0) / 1000); 

        res.json({ success: true, totalVisitors, ...stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// SESSIONS API (Lazy-loaded table)
export const getSessions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const sessions = await AnalyticsSession.find()
            .sort({ start_time: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(); // .lean() makes it plain JSON for faster processing

        // Dynamically append duration (end_time - start_time) before sending
        const formattedSessions = sessions.map(session => ({
            ...session,
            session_duration_seconds: Math.round((new Date(session.end_time) - new Date(session.start_time)) / 1000)
        }));

        res.json({ success: true, sessions: formattedSessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  SESSION JOURNEY API (Expand row to see exact timeline)
export const getSessionJourney = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const events = await AnalyticsEvent.find({ session_id: sessionId })
            .sort({ timestamp: 1 }); // Order chronologically: oldest to newest
            
        res.json({ success: true, journey: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PRODUCT ANALYTICS API (Most Viewed, Most Added, Conversion)
export const getProductAnalytics = async (req, res) => {
    try {
        const productStats = await AnalyticsEvent.aggregate([
            // Only look at product funnel events
            { $match: { event_type: { $in: ['product_view', 'add_to_cart'] } } },
            // Group by the product ID
            { 
                $group: {
                    _id: "$metadata.product_id",
                    productName: { $first: "$metadata.product_name" }, // Grab name from first occurrence
                    views: { $sum: { $cond: [{ $eq: ["$event_type", "product_view"] }, 1, 0] } },
                    carts: { $sum: { $cond: [{ $eq: ["$event_type", "add_to_cart"] }, 1, 0] } }
                } 
            },
            // Calculate View -> Cart Conversion Rate natively in MongoDB
            {
                $project: {
                    productName: 1,
                    views: 1,
                    carts: 1,
                    conversionRate: {
                        $cond: [ { $eq: ["$views", 0] }, 0, { $multiply: [{ $divide: ["$carts", "$views"] }, 100] } ]
                    }
                }
            },
            { $sort: { views: -1 } }, // Sort by most viewed
            { $limit: 20 }
        ]);

        res.json({ success: true, products: productStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  SEARCH ANALYTICS API (Top queries)
export const getSearchAnalytics = async (req, res) => {
    try {
        const topSearches = await AnalyticsEvent.aggregate([
            { $match: { event_type: 'search' } },
            { $group: { _id: "$metadata.search_query", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.json({ success: true, topSearches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  HEATMAP API (Canvas coordinates)
export const getHeatmapData = async (req, res) => {
    try {
        const { page_url } = req.query;
        if (!page_url) return res.status(400).json({ success: false, message: "page_url required" });

        // Uses our { page_url: 1, event_type: 1 } compound index perfectly!
        const clicks = await AnalyticsEvent.find({ 
            event_type: 'click', 
            page_url: page_url 
        }).select('metadata.x_percent metadata.y_percent -_id'); // Only return what the canvas needs

        res.json({ success: true, count: clicks.length, clicks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};