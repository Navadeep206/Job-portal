
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "admin2@example.com";
        const password = "password123";

        // Find user
        const user = await User.findOne({ email });

        if (user) {
            console.log(`Found user ${email}.`);
            // We set the password via direct update to bypass potential hooks if we wanted, 
            // but since we fixed the hook, let's just use the standard way but ensure we provide PLAIN password 
            // and let the model hash it.

            // Wait, if I provide plain password, the hook hashes it.
            // If I provide hashed, the hook (now fixed) ignores it.

            // Let's rely on the hook.
            user.password = password; // Plain text
            await user.save();
            console.log("Password reset (letting hook hash it).");
        } else {
            console.log("User not found.");
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

resetAdmin();
