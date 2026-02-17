
const API_URL = "http://127.0.0.1:5005/api";

const run = async () => {
    console.log("🚀 Starting Feature Verification (Job Management & Password Reset)...");

    const timestamp = Date.now();
    const recruiterEmail = `recruiter_feat_${timestamp}@example.com`;
    const password = "password123";
    let recruiterToken = "";
    let jobId = "";
    let userId = "";

    // 1. Register Recruiter
    try {
        console.log(`\n1️⃣ Registering Recruiter...`);
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Recruiter Feature Test",
                email: recruiterEmail,
                password: password,
                role: "recruiter"
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");
        recruiterToken = data.token;
        userId = data._id;
        console.log("✅ Recruiter Registered");
    } catch (e) {
        console.error("❌ Registration Failed:", e.message);
        process.exit(1);
    }

    // 2. Post Job
    try {
        console.log("\n2️⃣ Posting Job...");
        const res = await fetch(`${API_URL}/jobs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${recruiterToken}`
            },
            body: JSON.stringify({
                title: "Original Title",
                company: "Original Company",
                location: "Remote",
                description: "Original Description",
                requirements: "Original Requirements",
                // Fixes based on validation error
                experience: "Mid Level",
                salary: 100000,
                type: "Full-time", // Schema likely uses 'type' not 'jobType', or enum is Case Sensitive? 
                // Error said: `jobType: Full-time is not a valid enum value`. 
                // Wait, let's check Job.js first. 
                // But I can't wait for view_file result inside this thought block. 
                // I will use a placeholder or safe bet if I can.
                // Actually, I should wait for view_file. 
                // But I am doing "Parallel" tool calling? No, sequential is safer here.
                // I will wait for view_file in next turn. 
                // Oh, I can't. I must call replace_file_content now?
                // No, I can call view_file, then NEXT turn call replace.
                // So I will REMOVE this replace_file_content call to be safe.
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Job Post failed");
        jobId = data.job._id;
        console.log(`✅ Job Posted (ID: ${jobId})`);
    } catch (e) {
        console.error("❌ Job Posting Failed:", e.message);
        process.exit(1);
    }

    // 3. Edit Job (Recruiter)
    try {
        console.log("\n3️⃣ Editing Job...");
        const res = await fetch(`${API_URL}/jobs/${jobId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${recruiterToken}`
            },
            body: JSON.stringify({
                title: "Updated Title",
                company: "Updated Company"
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Job Edit failed");

        if (data.job.title === "Updated Title") {
            console.log("✅ Job Edited Successfully");
        } else {
            throw new Error("Job title did not update");
        }
    } catch (e) {
        console.error("❌ Job Editing Failed:", e.message);
    }

    // 4. Delete Job (Recruiter)
    try {
        console.log("\n4️⃣ Deleting Job...");
        const res = await fetch(`${API_URL}/jobs/${jobId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${recruiterToken}`
            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Job Delete failed");
        console.log("✅ Job Deleted Successfully");

        // Verify it's gone
        const checkRes = await fetch(`${API_URL}/jobs/${jobId}`);
        if (checkRes.status === 404) {
            console.log("✅ Verified: Job Not Found (404)");
        } else {
            console.error("⚠️ Warning: Job might still exist");
        }

    } catch (e) {
        console.error("❌ Job Deletion Failed:", e.message);
    }

    // 5. Test Forgot Password
    try {
        console.log("\n5️⃣ Testing Forgot Password...");
        // This relies on actual email sending. Since we might not want to spam or if creds are wrong,
        // we mainly check if the API accepts the request.
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: recruiterEmail })
        });
        const data = await res.json();

        if (res.ok) {
            console.log("✅ Forgot Password Request Sent (Email API responded 200)");
        } else {
            console.error("❌ Forgot Password Failed:", data.message);
            console.log("Note: This might fail if email credentials in .env are invalid.");
        }
    } catch (e) {
        console.error("❌ Forgot Password Error:", e.message);
    }

    console.log("\n🎉 Feature Verification Completed");
};

run();
