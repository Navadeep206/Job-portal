
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5001/api';

console.log(`Testing Login against ${API_URL}...`);

const testLogin = async () => {
    try {
        console.log("Sending POST request...");
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'adminpassword123'
        });
        console.log("✅ Login Success!");
        console.log("Status:", res.status);
        console.log("Data:", res.data);
    } catch (err) {
        console.log("❌ Login Failed");
        if (err.response) {
            console.log("Status:", err.response.status);
            console.log("Data:", err.response.data);
        } else if (err.request) {
            console.log("No response received. Request:", err.request);
        } else {
            console.log("Error:", err.message);
        }
    }
};

testLogin();
