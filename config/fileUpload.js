const cloudinaryPackage = require("cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
const cloudinary = cloudinaryPackage.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary,
<<<<<<< HEAD
  allowedFormats: ["jpg", "png", "jpeg", "JPEG"],
=======
  allowedFormats: ["jpg", "png","jpeg"],
>>>>>>> 47a2b2b14551b7c949316512774212d3b9bed3d3
  params: {
    folder: "Ecommerce-api",
  },
});

// Initialize Multer with the storage engine
const upload = multer({ storage });

module.exports = upload;
