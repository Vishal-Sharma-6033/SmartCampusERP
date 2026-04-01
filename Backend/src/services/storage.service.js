import cloudinary from 'cloudinary';
cloudinary.v2;
import fs from 'fs'

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload file
 export const upload = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "auto", // image, video, pdf sab handle karega
  });

  // local file delete
  fs.unlinkSync(filePath);

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

// delete file
 export const deletes = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};


const storageService = {
  upload,
  deletes,
  
  }


export default storageService;