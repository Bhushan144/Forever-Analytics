import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema({
    event_id: { type: String, required: true, unique: true },
    schema_version: { type: Number, default: 1 },
    visitor_id: { type: String, required: true },
    session_id: { type: String, required: true },
    event_type: { 
        type: String, 
        required: true,
        enum: ['page_view', 'click', 'product_view', 'add_to_cart', 'search']
    },
    page_url: { type: String, required: true }, // Root level for fast queries
    timestamp: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
});

// Performance Indexes (Crucial for the Dashboard)
analyticsEventSchema.index({ session_id: 1 });
analyticsEventSchema.index({ visitor_id: 1 });
analyticsEventSchema.index({ timestamp: -1 });
// Compound index for the Heatmap: "Find all clicks on /collection"
analyticsEventSchema.index({ page_url: 1, event_type: 1 });

const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", analyticsEventSchema);

export default AnalyticsEvent;