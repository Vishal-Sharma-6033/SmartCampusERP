import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


const uploadOnCloudinary= async (localFilepath)=>{
    try{
        if(!localFilepath) return null
        //U[load the file on cloudinary
        const response= await cloudinary.uploader.upload(localFilepath,{
            resource_type:'auto',
        })
        //file has been upload successfully
        console.log('File uploaded successfully on Cloudinary',response.url);
        return response;

    }
    catch(error){
        fs.unlinkSync(localFilepath); //delete the local file in case of error
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}


export  {uploadOnCloudinary}
