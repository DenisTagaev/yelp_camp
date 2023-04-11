const cloudinary = require("cloudinary").v2,
  { CloudinaryStorage } = require("multer-storage-cloudinary");
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
});

module.exports = {
    cloudinary,
    storage
};