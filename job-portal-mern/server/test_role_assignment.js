
const API_URL = "http://127.0.0.1:5005/api";

const run = async () => {
    const timestamp = Date.now();
    const email = `test_recruiter_${timestamp}@example.com`;
    const password = "password123";

    console.log(`Testing Registration for: ${email}`);

    // 1. Register
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Recruiter",
                email,
                password,
                role: "recruiter"
            })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Registration Failed:", data);
            process.exit(1);
        }

        console.log("Registration Response User Role:", data.role);
        if (data.role !== "recruiter") {
            console.error("❌ FAILED: Returned role is", data.role);
            process.exit(1);
        }

    } catch (e) {
        console.error("Network Error during Register:", e);
        process.exit(1);
    }

    // 2. Login
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        console.log("Login Response User Role:", data.role);
        if (data.role === "recruiter") {
            console.log("✅ SUCCESS: Role is correctly 'recruiter'");
        } else {
            console.error("❌ FAILED: Login role is", data.role);
        }

    } catch (e) {
        console.error("Network Error during Login:", e);
    }
};

run();
