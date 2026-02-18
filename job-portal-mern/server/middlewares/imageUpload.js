import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf/; // Added pdf
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Images (jpg, jpeg, png) and PDFs only!"));
    }
}

const fileUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Increased to 5MB for resumes
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export default fileUpload;

