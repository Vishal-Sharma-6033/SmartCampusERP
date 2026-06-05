import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload file
export const upload = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'auto', // handles image, video, pdf
  });

  // delete local temp file after upload
  fs.unlinkSync(filePath);

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

// delete file from cloudinary
export const deletes = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

const storageService = {
  upload,
  deletes,
};

export default storageService;