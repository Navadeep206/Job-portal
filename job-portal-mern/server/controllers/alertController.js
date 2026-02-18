import JobAlert from "../models/JobAlert.js";

/* Create Job Alert */
export const createAlert = async (req, res, next) => {
    try {
        const { keywords, location, frequency } = req.body;

        // Limit alerts per user (e.g., 5 max)
        const count = await JobAlert.countDocuments({ user: req.user._id });
        if (count >= 5) {
            res.status(400);
            throw new Error("Maximum limit of 5 alerts reached.");
        }

        const alert = await JobAlert.create({
            user: req.user._id,
            keywords,
            location,
            frequency
        });

        res.status(201).json({
            success: true,
            alert,
            message: "Job alert created successfully"
        });
    } catch (error) {
        next(error);
    }
};

/* Get My Alerts */
export const getMyAlerts = async (req, res, next) => {
    try {
        const alerts = await JobAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: alerts.length,
            alerts
        });
    } catch (error) {
        next(error);
    }
};

/* Delete Job Alert */
export const deleteAlert = async (req, res, next) => {
    try {
        const alert = await JobAlert.findById(req.params.id);

        if (!alert) {
            res.status(404);
            throw new Error("Job alert not found");
        }

        if (alert.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("Not authorized to delete this alert");
        }

        await alert.deleteOne();

        res.json({
            success: true,
            message: "Job alert deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
