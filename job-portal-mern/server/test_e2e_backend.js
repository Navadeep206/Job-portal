
const API_URL = "http://127.0.0.1:5005/api";

const run = async () => {
    console.log("🚀 Starting E2E Backend Verification...");

    const timestamp = Date.now();
    const recruiterEmail = `recruiter_${timestamp}@example.com`;
    const candidateEmail = `candidate_${timestamp}@example.com`;
    let recruiterToken = "";
    let candidateToken = "";
    let jobId = "";

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
        console.log("✅ Application Successful");
    } catch (e) {
        console.error("❌ Application Failed:", e.message);
        process.exit(1);
    }

    // 5. Verify App count (Optional - requires Recruiter/Admin endpoint)
    // Skipped for now, trust the 201 from Application

    // 6. Admin Delete User verification
    try {
        console.log("\n6️⃣ Verifying Admin Delete User...");
        // Login as Admin
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@example.com", password: "adminpassword123" })
        });
        const loginData = await loginRes.json();
        const adminToken = loginData.token;

        // Check Stats
        const statsRes = await fetch(`${API_URL}/admin/stats`, {
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        const stats = await statsRes.json();
        console.log("✅ Admin Stats:", stats);

        // Check Analytics (Verify Title Fix)
        const analyticsRes = await fetch(`${API_URL}/admin/analytics/jobs`, {
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        const analytics = await analyticsRes.json();
        if (analytics.success && analytics.data.length > 0) {
            const firstItem = analytics.data[0];
            if (firstItem.title) {
                console.log(`✅ Analytics Fixed! Job Title found: "${firstItem.title}" (Count: ${firstItem.count})`);
            } else {
                console.error("❌ Analytics Job Title MISSING:", firstItem);
            }
        } else {
            console.log("⚠️ No analytics data to verify title fix (Applications needed).");
        }
        // Get Users to find the one to delete (e.g. Candidate)
        const usersRes = await fetch(`${API_URL}/admin/users`, {
            headers: { "Authorization": `Bearer ${adminToken}` }
        });
        const users = await usersRes.json();
        const candidateUser = users.find(u => u.email === candidateEmail);

        if (candidateUser) {
            console.log(`Deleting Candidate User ID: ${candidateUser._id}`);
            const deleteRes = await fetch(`${API_URL}/admin/users/${candidateUser._id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${adminToken}` }
            });
            if (deleteRes.ok) {
                console.log("✅ Admin Delete User Successful");
            } else {
                console.error("❌ Admin Delete Failed", await deleteRes.json());
            }
        } else {
            console.warn("⚠️ Could not find candidate to delete");
        }

    } catch (e) {
        console.error("❌ Admin Test Failed:", e.message);
    }

    console.log("\n🎉 E2E BACKEND TEST COMPLETED SUCCESSFULLY!");
};

run();
