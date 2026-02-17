
import dotenv from 'dotenv';
import sendEmail from './utils/sendEmail.js';

dotenv.config();

const run = async () => {
    console.log("📧 Testing Email Sending...");
    console.log(`Using User: ${process.env.EMAIL_USER}`);
    // Don't log password

    try {
        await sendEmail({
            email: process.env.EMAIL_USER, // Send to self
            subject: "Test Email from Debug Script",
            message: "<h1>It works!</h1><p>This is a test email.</p>"
        });
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Email Failed:");
        console.error(error);

        // Analyze common errors
        if (error.code === 'EAUTH') {
            console.log("\n💡 TIP: Username and Password not accepted.");
            console.log("   - If using Gmail, you MUST use an 'App Password', not your login password.");
            console.log("   - Ensure 2-Step Verification is ON for your Google Account.");
            console.log("   - Go to: https://myaccount.google.com/apppasswords");
        }
    }
};

run();
