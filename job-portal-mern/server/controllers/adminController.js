import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

/* Platform Stats */
export const getStats = async (req, res, next) => {
  try {

    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const applications = await Application.countDocuments();

    res.json({
      success: true,
      users,
      jobs,
      applications,
    });

  } catch (error) {
    next(error);
  }
};
/* Job Analytics */
export const jobAnalytics = async (req, res, next) => {
  try {

    const data = await Application.aggregate([
      {
        $group: {
          _id: "$job",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $project: {
          _id: 1,
          count: 1,
          title: "$jobDetails.title",
        },
      },
    ]);

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      return next(new Error("User not found"));
    }
  } catch (error) {
    next(error);
  }
};  