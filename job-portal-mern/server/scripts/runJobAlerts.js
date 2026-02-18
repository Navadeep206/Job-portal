import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Job from "../models/Job.js";
import sendEmail from "../utils/sendEmail.js";

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const runJobAlerts = async (targetEmail) => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // 1. Find jobs created in the last 24 hours
        const twentyFourHoursAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

        const jobs = await Job.find({
            createdAt: { $gte: twentyFourHoursAgo },
            status: "open"
        }).sort({ createdAt: -1 }).limit(10);

        console.log(`Found ${jobs.length} new jobs in the last 24 hours.`);

        if (jobs.length === 0) {
            console.log("No new jobs to report.");
            process.exit(0);
        }

        // 2. Construct Email Content
        const jobListHtml = jobs.map(job => `
            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <h3 style="margin: 0 0 5px 0;">${job.title}</h3>
                <p style="margin: 0 0 5px 0;"><strong>${job.company}</strong> - ${job.location}</p>
                <p style="margin: 0 0 5px 0;">💰 $${job.salary}</p>
                <p style="margin: 0;">${job.description.substring(0, 100)}...</p>
            </div>
        `).join("");

        const message = `
            <div style="font-family: Arial, sans-serif;">
                <h2>🚀 New Jobs Alert!</h2>
                <p>Here are the latest jobs posted in the last 24 hours:</p>
                ${jobListHtml}
                <br/>
                <a href="http://localhost:5174" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View All Jobs</a>
            </div>
        `;

        // 3. Send Email
        console.log(`Sending email to ${targetEmail}...`);
        await sendEmail({
            email: targetEmail,
            subject: `Job Alert: ${jobs.length} New Jobs Found`,
            message: message
        });

        console.log("Job alert email sent successfully!");

    } catch (error) {
        console.error("Error running job alerts:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

const email = process.argv[2] || "navadeepguduru02@gmail.com";
runJobAlerts(email);
