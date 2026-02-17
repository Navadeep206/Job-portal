import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}/api`;

const testSavedJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        // Use fetch for API calls
        const fetchAPI = async (url, options = {}) => {
            const res = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Request failed');
            return { data };
        };

        const job = await Job.findOne({ status: 'open' });
        if (!job) {
            console.log("No open job found.");
            process.exit(1);
        }
        console.log(`Testing with job: ${job.title} (${job._id})`);

        const testEmail = `testuser_${Date.now()}@example.com`;
        const testPass = '123456';

        console.log("Registering test user...");
        let token;
        try {
            const { data } = await fetchAPI(`${API_URL}/auth/register`, {
                method: 'POST',
                body: JSON.stringify({
                    name: "Test User",
                    email: testEmail,
                    password: testPass,
                    role: "user"
                })
            });
            token = data.token;
            console.log("Registered successfully.");
        } catch (e) {
            console.error("Registration failed:", e.message);
            process.exit(1);
        }

        // Toggle Save (Adding)
        console.log("Toggling Save (Adding)...");
        await fetchAPI(`${API_URL}/users/saved-jobs`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ jobId: job._id })
        });
        console.log("Job saved.");

        // Get Saved Jobs
        console.log("Fetching Saved Jobs...");
        const { data: savedData1 } = await fetchAPI(`${API_URL}/users/saved-jobs`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Saved Jobs Count:", savedData1.savedJobs.length);
        if (savedData1.savedJobs.length > 0 && savedData1.savedJobs[0]._id === job._id.toString()) {
            console.log("SUCCESS: Job found in saved list.");
        } else {
            console.log("FAILURE: Job not found in saved list.");
        }

        // Toggle Save (Removing)
        console.log("Toggling Save (Removing)...");
        await fetchAPI(`${API_URL}/users/saved-jobs`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ jobId: job._id })
        });
        console.log("Job removed.");

        // Verify Removal
        const { data: savedData2 } = await fetchAPI(`${API_URL}/users/saved-jobs`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Saved Jobs Count (after removal):", savedData2.savedJobs.length);

        // Cleanup
        await User.deleteOne({ email: testEmail });
        console.log("Cleanup complete.");

    } catch (error) {
        console.error("Test Failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

testSavedJobs();
