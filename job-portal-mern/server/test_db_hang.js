
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const run = async () => {
    console.log("🧪 Testing Direct DB User Creation...");

    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        const email = `debug_user_${Date.now()}@example.com`;
        console.log(`Creating user ${email}...`);

        // This triggers the pre-save hook
        const user = await User.create({
            name: "Debug User",
            email: email,
            password: "password123",
            role: "user"
        });

        console.log("✅ User created successfully:", user._id);
        console.log("Exiting...");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

run();
