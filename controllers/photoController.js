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
            image_id:result.public_id,
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
        let isOwner = false;

        if (res.locals.user) {
            isOwner = photo.user.equals(res.locals.user._id);
        }   
        res.status(200).render("photo",{
            photo,
            link:'photos',
            isOwner,
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

const deletePhoto=async(req,res)=>{
    try {
        const photo=await Photo.findById(req.params.id);

        const photoId= photo.image_id;
        await cloudinary.uploader.destroy(photoId);
        await Photo.findOneAndDelete({_id:req.params.id});

        res.status(200).redirect("/users/dashboard");
        
    } catch (error) {
        console.log('Error deleting photo:',error);
        res.status(500).json({
            succeeded:false,
            message:'Failed to delete photo',
            error:error.message,
        })
    }
}

const updatePhoto= async(req,res)=>{
    try {
        const photo= await Photo.findById(req.params.id);

        if(req.files){//if a new photo is selected
            const photoId=photo.image_id;
            await cloudinary.uploader.destroy(photoId);
            const result= await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                {
                    use_filename:true,
                    folder:"lenslight"
                }
            );

            photo.url=result.secure_url;
            photo.image_id=result.public_id;

            fs.unlinkSync(req.files.image.tempFilePath);

        }

        photo.name=req.body.name;
        photo.description=req.body.description;
        photo.save();

        res.status(200).redirect(`/photos/${req.params.id}`);

    } catch (error) {
        console.log('Error updating photo:',error);
        res.status(500).json({
            succeeded:false,
            message:'Failed to update photo',
            error:error.message,
        })
    }
}

export { createPhoto,getAllPhotos,getAPhotos,deletePhoto,updatePhoto };
