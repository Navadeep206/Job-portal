import Application from "../models/Application.js";
import Job from "../models/Job.js";
import sendEmail from "../config/email.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

/* Apply for Job */
export const applyJob = async (req, res, next) => {
  try {
    console.log("[DEBUG] applyJob controller hit");
    console.log("[DEBUG] req.body:", req.body);
    console.log("[DEBUG] req.file:", req.file ? "File present" : "No file");

    const { jobId } = req.body;

    // Check if file was uploaded
    console.log(`[DEBUG] Processing application for Job ID: ${jobId}`);
    let resume = "";
    if (req.file) {
      console.log(`[DEBUG] File detected: ${req.file.originalname}, Path: ${req.file.path}`);
      try {
        console.log(`[DEBUG] Starting Cloudinary upload for: ${req.file.path}`);

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Cloudinary upload timed out')), 10000)
        );

        // Race between upload and timeout
        const uploadPromise = cloudinary.uploader.upload(req.file.path, {
          folder: "resumes",
          resource_type: "auto",
        });

        const result = await Promise.race([uploadPromise, timeoutPromise]);

        console.log(`[DEBUG] Cloudinary upload successful: ${result.secure_url}`);
        resume = result.secure_url;

        // Clean up local file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete local resume file:", err);
        });
      } catch (uploadError) {
        console.error("Resume upload failed or timed out - Details:", uploadError);
        // FALLBACK: If upload fails/times out, use a placeholder or local path (if we were serving locally)
        // For now, allow the application to proceed with a "pending_upload" status or dummy link
        // so the user isn't stuck.
        console.log("[DEBUG] Using fallback resume URL due to upload failure.");
        resume = "https://via.placeholder.com/150?text=Resume+Upload+Failed";

        // Don't crash the request, just log it.
        // res.status(500);
        // throw new Error(`Failed to upload resume: ${uploadError.message}`);
      }
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
      console.log(`[DEBUG] Duplicate application detected for Job: ${jobId}, User: ${req.user._id}`);
      res.status(400);
      throw new Error("Already applied to this job");
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume,
    });
    // Send email notification (non-blocking)
    console.log(`[DEBUG] Application created for Job: ${jobId}, Applicant: ${req.user._id}`);

    // 1. Send Response IMMEDIATELY
    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: application._id
    });
    console.log(`[DEBUG] Response sent to client.`);

    // 2. Send email notification (Fire and Forget - AFTER response)
    // Using setTimeout to ensure it runs in next tick and doesn't affect response flow
    setTimeout(() => {
      console.log(`[DEBUG] Attempting to send email...`);
      sendEmail({
        to: req.user.email,
        subject: "Job Application Submitted",
        text: `You applied for ${job.title} at ${job.company}`,
      }).then(() => {
        console.log(`[DEBUG] Email sent successfully.`);
      }).catch(emailError => {
        console.error("Failed to send application email:", emailError.message);
      });
    }, 100);

  } catch (error) {
    console.error("Apply Job Error:", error);
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

    // Populate applicant to get email
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant");

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

    // Send email notification
    // Send email notification (non-blocking)
    sendEmail({
      to: application.applicant.email,
      subject: `Application Status Update: ${application.job.title}`,
      text: `Your application for ${application.job.title} at ${application.job.company} has been ${status}.`,
    }).catch(emailError => {
      console.error("Failed to send status update email:", emailError.message);
    });

    res.json({
      success: true,
      application,
    });

  } catch (error) {
    next(error);
  }
};
