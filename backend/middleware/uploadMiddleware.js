import multer from "multer";
import cloudinaryStorage from "multer-storage-cloudinary";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024;

const storage = cloudinaryStorage({
  cloudinary,
  folder: "smart-city-complaints",
  allowedFormats: allowedExtensions,
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 40);

    cb(null, `complaint-${Date.now()}-${safeName}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const extension = file.originalname.split(".").pop()?.toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only jpg, jpeg, png, and webp image files are allowed"));
};

export const uploadComplaintImage = (req, res, next) => {
  if (!isCloudinaryConfigured()) {
    const localUpload = multer({
      storage: multer.memoryStorage(),
      fileFilter,
      limits: {
        fileSize: maxFileSize
      }
    }).single("image");

    return localUpload(req, res, (error) => {
      if (error) {
        res.status(error instanceof multer.MulterError ? 400 : 500);
        return next(new Error(error.message || "Image upload failed"));
      }

      if (req.file) {
        res.status(500);
        return next(new Error("Cloudinary is not configured. Add Cloudinary environment variables."));
      }

      next();
    });
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize
    }
  }).single("image");

  upload(req, res, (error) => {
    if (!error) {
      return next();
    }

    res.status(400);

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return next(new Error("Image size must be 5MB or less"));
    }

    next(new Error(error.message || "Image upload failed"));
  });
};
