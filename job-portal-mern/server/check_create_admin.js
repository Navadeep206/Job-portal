
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const checkCreateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const admin = await User.findOne({ role: 'admin' });
        const plainPassword = "password123";

        if (admin) {
            console.log(`Admin exists: ${admin.email}. Updating password to plain text (will be hashed by hook)...`);
            admin.password = plainPassword;
            await admin.save();
            console.log("Admin password updated.");
        } else {
            console.log("No admin found. Creating one...");
            // For new user, create accepts plain text and save hook will hash it
            const newAdmin = await User.create({
                name: "Admin User",
                email: "admin@example.com",
                password: plainPassword,
                role: "admin"
            });
            console.log(`Admin created: ${newAdmin.email}`);
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkCreateAdmin();
