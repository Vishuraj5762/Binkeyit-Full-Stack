import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"

const uploadImageController =async(req,res)=>{
    try {
        const imagefile=req.file
       
        
        const uploadImage=await uploadImageCloudinary(imagefile)
        return res.json({
            message:"upload done",
            data:uploadImage,
            success:true,
            error:false
        })
        
    } catch (error) {
        res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

export default uploadImageController