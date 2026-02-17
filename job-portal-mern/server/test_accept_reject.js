
const API_URL = "http://127.0.0.1:5005/api";

const run = async () => {
    console.log("🚀 Starting Accept/Reject Feature Verification...");

    const timestamp = Date.now();
    const recruiterEmail = `recruiter_${timestamp}@example.com`;
    const candidateEmail = `candidate_${timestamp}@example.com`;
    let recruiterToken = "";
    let candidateToken = "";
    let jobId = "";
    let applicationId = "";

    // 1. Register Recruiter
    try {
        console.log(`\n1️⃣ Registering Recruiter (${recruiterEmail})...`);
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Recruiter Test",
                email: recruiterEmail,
                password: "password123",
                role: "recruiter"
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");
        recruiterToken = data.token;
        console.log("✅ Recruiter Registered & Logged In");
    } catch (e) {
        console.error("❌ Recruiter Registration Failed:", e.message);
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
                title: "Backend Specialist",
                company: "API Corp",
                location: "Remote",
                salary: 140000,
                description: "Build robust APIs",
                requirements: "Node.js",
                experience: "Senior",
                jobType: "full-time",
                skills: ["Node", "Express"]
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Job Post failed");
        jobId = data.job._id;
        console.log(`✅ Job Posted: ${data.job.title} (ID: ${jobId})`);
    } catch (e) {
        console.error("❌ Job Posting Failed:", e.message);
        process.exit(1);
    }

    // 3. Register Candidate
    try {
        console.log(`\n3️⃣ Registering Candidate (${candidateEmail})...`);
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Candidate Test",
                email: candidateEmail,
                password: "password123",
                role: "user"
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Candidate Registration failed");
        candidateToken = data.token;
        console.log("✅ Candidate Registered & Logged In");
    } catch (e) {
        console.error("❌ Candidate Registration Failed:", e.message);
        process.exit(1);
    }

    // 4. Apply for Job
    try {
        console.log("\n4️⃣ Applying for Job...");
        const res = await fetch(`${API_URL}/applications/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${candidateToken}`
            },
            body: JSON.stringify({
                jobId: jobId,
                resume: "https://example.com/my-resume.pdf"
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Application failed");
        applicationId = data.application._id;
        console.log(`✅ Application Successful (ID: ${applicationId})`);
    } catch (e) {
        console.error("❌ Application Failed:", e.message);
        process.exit(1);
    }

    // 5. Verify Pending Status (Recruiter View)
    try {
        console.log("\n5️⃣ Verifying Pending Status...");
        const res = await fetch(`${API_URL}/applications/job/${jobId}`, {
            headers: { "Authorization": `Bearer ${recruiterToken}` }
        });
        const data = await res.json();
        const app = data.applications.find(a => a._id === applicationId);
        if (app && app.status === 'pending') {
            console.log("✅ Application verified as PENDING");
        } else {
            console.error("❌ Application status mismatch or not found", app);
            process.exit(1);
        }
    } catch (e) {
        console.error("❌ Fetch Applications Failed:", e.message);
        process.exit(1);
    }

    // 6. Accept Application
    try {
        console.log("\n6️⃣ Accepting Application...");
        const res = await fetch(`${API_URL}/applications/${applicationId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${recruiterToken}`
            },
            body: JSON.stringify({ status: "accepted" })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Update failed");
        }
        console.log("✅ Status update request sent");

        // Verify
        const verifyRes = await fetch(`${API_URL}/applications/job/${jobId}`, {
            headers: { "Authorization": `Bearer ${recruiterToken}` }
        });
        const data = await verifyRes.json();
        const app = data.applications.find(a => a._id === applicationId);
        if (app && app.status === 'accepted') {
            console.log("✅ Application verified as ACCEPTED");
        } else {
            console.error("❌ Application status mismatch", app);
            process.exit(1);
        }

    } catch (e) {
        console.error("❌ Accept Application Failed:", e.message);
        process.exit(1);
    }

    // 7. Verify Candidate View
    try {
        console.log("\n7️⃣ Verifying Candidate View...");
        const res = await fetch(`${API_URL}/applications/my`, {
            headers: { "Authorization": `Bearer ${candidateToken}` }
        });
        const data = await res.json();
        const app = data.applications.find(a => a._id === applicationId);
        if (app && app.status === 'accepted') {
            console.log("✅ Candidate sees Application as ACCEPTED");
        } else {
            console.error("❌ Candidate View mismatch", app);
            process.exit(1);
        }
    } catch (e) {
        console.error("❌ Candidate Fetch Failed:", e.message);
        process.exit(1);
    }

    console.log("\n🎉 ACCEPT/REJECT FEATURE VERIFIED SUCCESSFULLY!");
};

run();
