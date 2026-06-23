import AnalyticsEvent from '../models/analyticsEventModel.js';
import AnalyticsSession from '../models/analyticsSessionModel.js';
import AnalyticsVisitor from '../models/analyticsVisitorModel.js';
import crypto from 'crypto';

export const ingestEvents = async (req, res) => {

    if (!req.body || !req.body.events) {
        return res.status(400).json({ success: false, message: "Invalid or missing JSON payload" });
    }

    try {
        const { events } = req.body;

        //  Validation: Ignore empty batches
        if (!events || !Array.isArray(events) || events.length === 0) {
            return res.status(200).json({ success: true, message: "Empty batch" });
        }

        // Assume batch comes from the same visitor
        const visitorId = events[0].visitor_id; //events is the array of events sent from the frontend SDK
        const fingerprintHash = events[0].fingerprint_hash;
        const now = new Date();

        //  Manage Visitor Identity (Upsert: Update if exists, Create if new)
        await AnalyticsVisitor.findOneAndUpdate(
            { visitor_id: visitorId },
            {
                $setOnInsert: { first_seen: now },
                $set: { last_seen: now, fingerprint_hash: fingerprintHash }
            },
            { upsert: true, new: true }
        );

        // Session Stitching Logic
        // Find the most recent session for this visitor
        let activeSession = await AnalyticsSession.findOne({ visitor_id: visitorId })
            .sort({ last_activity: -1 });

        const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

        // If no session exists OR the last activity was over 30 mins ago, start a new one
        if (!activeSession || (now.getTime() - activeSession.last_activity.getTime()) > SESSION_TIMEOUT_MS) {
            activeSession = new AnalyticsSession({
                session_id: 'sess_' + crypto.randomUUID().replace(/-/g, ''),
                visitor_id: visitorId,
                start_time: now,
                end_time: now,
                last_activity: now,
                event_count: 0,
                page_view_count: 0,
                click_count: 0,
                product_view_count: 0,
                add_to_cart_count: 0,
                search_count: 0
            });
        }

        //  Process the Batch & Increment Session Counters
        let pageViews = 0, clicks = 0, productViews = 0, addToCarts = 0, searches = 0;

        const eventsToInsert = events.map(ev => {
            // Tally up the event types
            if (ev.event_type === 'page_view') pageViews++;
            if (ev.event_type === 'click') clicks++;
            if (ev.event_type === 'product_view') productViews++;
            if (ev.event_type === 'add_to_cart') addToCarts++;
            if (ev.event_type === 'search') searches++;

            return {
                event_id: ev.event_id,
                schema_version: ev.schema_version,
                visitor_id: ev.visitor_id,
                session_id: activeSession.session_id, // Strictly assign backend's session_id
                event_type: ev.event_type,
                page_url: ev.page_url,
                timestamp: ev.timestamp || now,
                metadata: ev.metadata
            };
        });

        //  Update the active session summaries
        activeSession.last_activity = now;
        activeSession.end_time = now;
        activeSession.event_count += events.length;
        activeSession.page_view_count += pageViews;
        activeSession.click_count += clicks;
        activeSession.product_view_count += productViews;
        activeSession.add_to_cart_count += addToCarts;
        activeSession.search_count += searches;

        //  Execute DB Writes concurrently for maximum performance
        await Promise.all([
            activeSession.save(),
            AnalyticsEvent.insertMany(eventsToInsert)
        ]);

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Analytics Ingestion Error:", error);
        // Return 500 so the frontend SDK knows to put the events back in the queue
        return res.status(500).json({ success: false, message: "Ingestion failed" });
    }
};