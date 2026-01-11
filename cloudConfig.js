const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
    cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.CLOUD_API_KEY, 
        api_secret:process.env.CLOUD_API_SECRET,
    });
    console.log("✅ Cloudinary configured");
} else {
    console.warn("⚠️  Cloudinary not fully configured - some upload features may not work");
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderplace_DEV',
      allowedFormat: ["jpg", "png", "jpeg"],
      
    },
  });

  module.exports={
    cloudinary,
    storage,
  }