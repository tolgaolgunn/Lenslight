import Photo from "../models/photoModel.js";
import { v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


const createPhoto = async (req, res) => {
    const result= await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename:true,
            folder:"lenslight"
        }
    );

    fs.unlinkSync(req.files.image.tempFilePath);

    try {
        await Photo.create({
            name:req.body.name,
            description:req.body.description,
            user:res.locals.user._id,
            url:result.secure_url,
        });
        res.status(201).redirect("/users/dashboard");
    } catch (error) {
        console.error('Error creating photo:', error);
        res.status(500).json({
            succeeded: false,
            message: 'Failed to create photo',
            error: error.message,
        });
    }
};

const getAllPhotos=async(req,res)=>{
    try {
        const photos  = res.locals.user 
        ? await Photo.find({ user: { $ne: res.locals.user._id } })
        : await Photo.find({})
        res.status(200).render("photos",{
            photos,
            link:'photos',
        });   
    } catch (error) {
        console.log('Error finding photo:',error);
        res.status(500).json({
            succeeded:false,
            message:'Failed to find photo',
            error:error.message,
        });
    }
}

const getAPhotos=async(req,res)=>{
    try {
        const photo=await Photo.findById({_id:req.params.id}).populate("user");
        res.status(200).render("photo",{
            photo,
            link:'photos',
        });
    } catch (error) {
        console.log('Error finding photo:',error);
        res.status(500).json({
            succeeded:false,
            message:'Failed to find photo',
            error:error.message,
        });
    }
}

export { createPhoto,getAllPhotos,getAPhotos };
