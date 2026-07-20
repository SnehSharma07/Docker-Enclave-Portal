import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";

const uploadDirectory = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

/*
|--------------------------------------------------------------------------
| Allowed Image Types
|--------------------------------------------------------------------------
*/

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/*
|--------------------------------------------------------------------------
| Storage Engine (Local Disk)
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `contact-${uniqueSuffix}${extension}`);
  },
});

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error("Only JPG, PNG, and WebP images are allowed.");
    error.statusCode = 400;

    return cb(error);
  }

  cb(null, true);
};

/*
|--------------------------------------------------------------------------
| Multer Instance
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/*
|--------------------------------------------------------------------------
| Helper: Delete Image From Disk
|--------------------------------------------------------------------------
*/

export const deleteImageFile = (filename) => {
  if (!filename) return;

  const filePath = path.join(uploadDirectory, filename);

  fs.unlink(filePath, (err) => {
    // Silently ignore missing files - nothing else to do.
    if (err && err.code !== "ENOENT") {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete image file: ${filename}`, err.message);
    }
  });
};

export { uploadDirectory };

export default upload;
