
const verifyAdminLogin = async () => {
    try {
        console.log("Attempting Admin Login...");
        const response = await fetch('http://localhost:5005/api/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log("Login Status:", response.status);

        if (response.ok && data.user && data.user.role === 'admin') {
            console.log("User Role:", data.user.role);
            console.log("✅ Admin Login Successful!");
        } else {
            console.log("❌ Admin Login Failed or Incorrect Role");
            console.log("Error Data:", data);
        }
    } catch (error) {
        console.error("❌ Login Error:", error.message);
    }
};

verifyAdminLogin();
