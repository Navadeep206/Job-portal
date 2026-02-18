import mongoose from "mongoose";

const jobAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    keywords: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly"],
        default: "daily"
    },
    lastSent: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const JobAlert = mongoose.model("JobAlert", jobAlertSchema);

export default JobAlert;
