import mongoose from "mongoose";

const analyticsVisitorSchema = new mongoose.Schema({
    visitor_id: { type: String, required: true, unique: true },
    first_seen: { type: Date, default: Date.now },
    last_seen: { type: Date, default: Date.now },
    user_id: { type: String, default: null }, // Optional, linked to storefront auth
    fingerprint_hash: { type: String }        // Stored passively, no complex recovery
});

analyticsVisitorSchema.index({ last_seen: -1 });

const AnalyticsVisitor = mongoose.models.AnalyticsVisitor || mongoose.model("AnalyticsVisitor", analyticsVisitorSchema);

export default AnalyticsVisitor;