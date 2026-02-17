
const API_URL = "http://localhost:5005/api/auth";

const run = async () => {
    console.log("🔐 Testing Authentication Flow...");

    // Unique email every time to avoid "User already exists"
    const email = `test_user_${Date.now()}@example.com`;
    const password = "password123";
    const name = "Auth Tester";

    // 1. Register
    try {
        console.log(`\n1️⃣ Testing Registration (${email})...`);
        const regRes = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role: "user" })
        });

        const regData = await regRes.json();

        if (regRes.ok) {
            console.log("✅ Registration Successful!");
            console.log("   Token:", regData.token ? "Received" : "Missing");
        } else {
            console.error("❌ Registration Failed:", regRes.status, regData);
            process.exit(1);
        }

    } catch (e) {
        console.error("❌ Registration Network Error:", e.message);
        process.exit(1);
    }

    // 2. Login
    try {
        console.log(`\n2️⃣ Testing Login...`);
        const loginRes = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
            console.log("✅ Login Successful!");
            console.log("   Token:", loginData.token ? "Received" : "Missing");
            console.log("   User:", loginData.name);
        } else {
            console.error("❌ Login Failed:", loginRes.status, loginData);
        }

    } catch (e) {
        console.error("❌ Login Network Error:", e.message);
    }
};

run();
