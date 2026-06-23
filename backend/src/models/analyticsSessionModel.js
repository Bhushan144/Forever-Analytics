import mongoose from "mongoose";

const analyticsSessionSchema = new mongoose.Schema({
    session_id: { type: String, required: true, unique: true },
    visitor_id: { type: String, required: true },
    
    // Time tracking
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    last_activity: { type: Date, required: true },
    
    // Pre-aggregated counters
    event_count: { type: Number, default: 0 },
    page_view_count: { type: Number, default: 0 },
    click_count: { type: Number, default: 0 },
    product_view_count: { type: Number, default: 0 },
    add_to_cart_count: { type: Number, default: 0 },
    search_count: { type: Number, default: 0 }
});

// Indexes for fast lookups during ingestion
analyticsSessionSchema.index({ visitor_id: 1 });
analyticsSessionSchema.index({ session_id: 1 });
// Index for sorting sessions by newest in the dashboard
analyticsSessionSchema.index({ start_time: -1 });

const AnalyticsSession = mongoose.models.AnalyticsSession || mongoose.model("AnalyticsSession", analyticsSessionSchema);

export default AnalyticsSession;