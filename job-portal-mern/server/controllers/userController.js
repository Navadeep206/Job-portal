import User from "../models/User.js";

/* Toggle Saved Job */
export const toggleSavedJob = async (req, res, next) => {
    try {
        const { jobId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Check if job is already saved
        const isSaved = user.savedJobs.includes(jobId);

        if (isSaved) {
            // Remove job
            user.savedJobs = user.savedJobs.filter(
                (id) => id.toString() !== jobId.toString()
            );
            await user.save();
            res.json({ success: true, message: "Job removed from saved list", savedJobs: user.savedJobs });
        } else {
            // Add job
            user.savedJobs.push(jobId);
            await user.save();
            res.json({ success: true, message: "Job saved successfully", savedJobs: user.savedJobs });
        }

    } catch (error) {
        next(error);
    }
};

/* Get Saved Jobs */
export const getSavedJobs = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: "savedJobs",
            populate: {
                path: "postedBy",
                select: "name email"
            }
        });

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.json({
            success: true,
            savedJobs: user.savedJobs,
        });

    } catch (error) {
        next(error);
    }
};
