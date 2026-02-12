
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin2 = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "admin2@example.com";
        const password = "password123";

        // Check if exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.log(`User ${email} already exists. Updating password...`);
            existing.password = await bcrypt.hash(password, 10);
            existing.role = 'admin'; // Ensure role is admin
            await existing.save();
            console.log("Updated.");
        } else {
            console.log(`Creating new admin ${email}...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = new User({
                name: "Admin Two",
                email,
                password: hashedPassword,
                role: "admin"
            });
            await newAdmin.save();
            console.log("Created.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1); // Exit with error code so I can detect failure
    }
};

createAdmin2();
