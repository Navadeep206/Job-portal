import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        const fs = await import('fs');
        const path = await import('path');
        const logFile = path.resolve('upload_debug.txt');
        const log = (msg) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] CONFIG: ${msg}\n`);

        log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
        log(`API Key present: ${!!process.env.CLOUDINARY_API_KEY}`);

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log("Cloudinary Connected");
        log("Cloudinary Configured");
    } catch (error) {
        console.error("Cloudinary Connection Error", error);
    }
};

export default connectCloudinary;
