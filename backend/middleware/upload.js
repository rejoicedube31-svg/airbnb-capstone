const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "uploads");

/**
 * Multer saves uploaded files to backend/uploads/
 * Why: Admin "create listing" can upload photos; we store the file path in MongoDB.
 */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const unique = `${Date.now()}-${safeName}`;
    cb(null, unique);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
