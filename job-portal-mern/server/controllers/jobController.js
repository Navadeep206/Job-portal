import Job from "../models/Job.js";

/* Create Job */
export const createJob = async (req, res, next) => {
  try {

    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      job,
    });

  } catch (error) {
    next(error);
  }
};

/* Get All Jobs (Search + Filter + Pagination) */
export const getJobs = async (req, res, next) => {
  try {

    const {
      keyword,
      location,
      jobType,
      minSalary,
      page = 1,
      limit = 10,
    } = req.query;

    let query = { status: "open" };

    /* Search */
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
      ];
    }

    /* Filters */
    if (location) {
      query.location = location;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (minSalary) {
      query.salary = { $gte: Number(minSalary) };
    }

    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      jobs,
    });

  } catch (error) {
    next(error);
  }
};

/* Get Single Job */
export const getJobById = async (req, res, next) => {
  try {

    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    res.json({
      success: true,
      job,
    });

  } catch (error) {
    next(error);
  }
};
/* Get My Jobs */
export const getMyJobs = async (req, res, next) => {
  try {

    const jobs = await Job.find({
      postedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });

  } catch (error) {
    next(error);
  }
};


/* Update Job */
export const updateJob = async (req, res, next) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    /* Only Owner/Admin */
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not allowed");
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      job: updatedJob,
    });

  } catch (error) {
    next(error);
  }
};

/* Delete Job */
export const deleteJob = async (req, res, next) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    /* Only Owner/Admin */
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not allowed");
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted",
    });

  } catch (error) {
    next(error);
  }
};
