import Application from "../models/Application.js";
import Job from "../models/Job.js";
import sendEmail from "../config/email.js";


/* Apply for Job */
export const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    // Check if file was uploaded
    let resume = "";
    if (req.file) {
      resume = `/${req.file.path}`; // Store relative path
    } else if (req.body.resume) {
      resume = req.body.resume; // Fallback for old tests/links
    }



    if (!jobId || !resume) {
      res.status(400);
      throw new Error("Job and resume required");
    }

    const job = await Job.findById(jobId);

    if (!job || job.status === "closed") {
      res.status(404);
      throw new Error("Job not available");
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      res.status(400);
      throw new Error("Already applied to this job");
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume,
    });
    // Send email notification (non-blocking)
    try {
      await sendEmail({
        to: req.user.email,
        subject: "Job Application Submitted",
        text: `You applied for ${job.title} at ${job.company}`,
      });
    } catch (emailError) {
      console.error("Failed to send application email:", emailError.message);
    }

    res.status(201).json({
      success: true,
      application,
    });

  } catch (error) {
    next(error);
  }
};

/* Get My Applications (Candidate) */
export const getMyApplications = async (req, res, next) => {
  try {

    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    next(error);
  }
};

/* Get Applicants for a Job (Recruiter/Admin) */
export const getJobApplicants = async (req, res, next) => {
  try {

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    // Ownership check
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized");
    }

    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    next(error);
  }
};


/* Get All Applicants for Recruiter (across all their jobs) */
export const getRecruiterApplicants = async (req, res, next) => {
  try {
    // 1. Find all jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id title");

    if (!jobs.length) {
      return res.json({ success: true, applications: [] });
    }

    const jobIds = jobs.map(job => job._id);

    // 2. Find applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications // Frontend expects 'data'
    });

  } catch (error) {
    next(error);
  }
};

/* Update Application Status */
export const updateApplicationStatus = async (req, res, next) => {
  try {

    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("job");

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    // Ownership check
    if (
      application.job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized");
    }

    application.status = status;
    await application.save();

  } catch (error) {
    next(error);
  }
};
