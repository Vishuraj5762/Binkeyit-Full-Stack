import sendEmail from "../config/sendEmail.js"
import UserModel from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"
import generateAccessToken from "../utils/generateAccessToken.js"
import generateRefreshToken from "../utils/generateRefreshToken.js"
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"
import generateOtp from "../utils/generateOtp.js"
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js"
import jwt from 'jsonwebtoken'

export async function registerUserController(req,res){
    try {
        const {name,email,password}=req.body
        if(!name||!email||!password){
            return res.status(400).json({message:"provide name, email,password ",
                error:true,
                success:false
            })
        }

        const user=await UserModel.findOne({email})
        if(user){
            return res.json({message:"already register email ",
                error:true,
                success:false
            })
        }

        const salt=await bcryptjs.genSalt(10)
        const hashPassword=await bcryptjs.hash(password,salt)

        const payload={
            name,
            email,
            password:hashPassword
        }

        const newUser=new UserModel(payload)
        const save=await newUser.save()

        const verifyemailurl=`${process.env.FRONTEND_URL}/verify-email?code=${save._id}`
        const verifyEmail= await sendEmail({
            sendTo:email,
            subject:"Verify email from binkeyit",
            html:verifyEmailTemplate({
                name,
                url:verifyemailurl
            })
        })

     return res.json({
        message:"User register successfully",
        error:false,
        success:true,
        data:save
     })

    } catch (error) {
        return res.status(500).json({message:error.message||error,
            error:true,
            success:false
        })
    }
}
export async function verifyEmailController(req,res) {
    try {
        const {code}=req.body

        const user=await UserModel.findOne({_id:code})
        if(!user){
            return res.status(400).json({
                message:"Invalid code",
                error:true,
                success:false
            })
        }

        const updateUser=await UserModel.updateOne({_id:code},{verify_email:true})

        return res.json({message:"verify email done",success:true,error:false})
    } catch (error) {
        return res.status(500).json({message:error.message||error,
            error:true,
            success:true
        })
    }
}


// login controller

export async function loginController(req,res) {
    try {
        const {email,password}=req.body
        const user=await UserModel.findOne({email})

        if(!email||!password){
            return res.status(400).json({
                message:"provide email or password",
                error:true,
                success:false
            })
        }

        if(!user){
            return res.status(400).json({
                message:"user not register",
                error:true,
                success:false
            })
        }

        if(user.status!=="Active"){
            return res.status(400).json({
                message:"contact to admin",
                error:true,
                success:false
            })
        }

        const checkPassword=await bcryptjs.compare(password,user.password)
        if(!checkPassword){
            return res.status(400).json({
                message:"check your password",
                error:true,
                success:false
            })
        }
   const accesstoken=await generateAccessToken(user._id)
   const refreshtoken=await generateRefreshToken(user._id)

   const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
    last_login_date:new Date()
   })
   
//    const cookiesOption={
//     httpOnly:true,
//     secure:true,
//     samesite:"none"
//    }

 const cookiesOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // dev me false
      sameSite: "None", // correct key & case
      path: "/"         // sab routes pe kaam kare
    };
    res.cookie('accessToken',accesstoken,cookiesOption)
    res.cookie('refreshToken',refreshtoken,cookiesOption)


    return res.json({
        message:"Login Successfully",
        error:false,
        success:true,
        data:{
            accesstoken,
            refreshtoken
        }
    })
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

// logout controller

export async function logoutController(req,res) {
    try {
           const userid=req.userId   //comming from middleware



        const cookiesOption={
            httpOnly:true,
            secure:true,
            samesite:"none"
           }

        res.clearCookie("accessToken",cookiesOption)
        res.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken=await UserModel.findByIdAndUpdate(userid,{
            refresh_token:""
        })

        return res.json({
            message:"Logout successfully",
            error:false,
            success:true
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}


// upload user avtar

export async function uploadAvtar(req,res) {
    try {
        
           const userId=req.userId   //comming from auth middleware
           const image=req.file      //comming from multer middleware
           const upload=await uploadImageCloudinary(image)
       
       const updateUser=await UserModel.findByIdAndUpdate(userId,{
        avtar:upload.url
       })

        return res.json({
            message:"upload profile ",
            success:true,
            error:false,
            data:{
                _id:userId,
                avtar:upload.url
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

// update user details

export async function updateUserDetails(req,res) {
    try {
        const userId=req.userId   //comming from auth middleware
        const {name,email,mobile,password}=req.body

        let hashPassword=""
       if(password){
        const salt=await bcryptjs.genSalt(10)
        hashPassword=await bcryptjs.hash(password,salt)
       }

        const updateUser=await UserModel.updateOne({_id:userId},{
            ...(name&&{name:name}),
            ...(email&&{email:email}),
            ...(mobile&&{mobile:mobile}),
            ...(password&&{password:hashPassword})
        })

        return res.json({
            message:"updated user successfully",
            error:false,
            success:true,
            data:updateUser
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

// forgot password  not login

export async function forgotPasswordController(req,res) {
    try {
        const {email}=req.body
        const user=await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message:"email not available",
                error:true,
                success:false
            })
        }
const otp=generateOtp()

const expireTime=new Date()+60*60*1000   //1hr   multiply 1000 because it gives time in mili second
const update=await UserModel.findByIdAndUpdate(user._id,{
    forgot_password_otp:otp,
    forgot_pssword_expiry:new Date(expireTime).toISOString()    //toisostring convert in indian formate
})

await sendEmail({
    sendTo:email,
    subject:"forgot password from binkeyit",
    html:forgotPasswordTemplate({
        name:user.name,
        otp:otp
    })
})

        return res.json({
            message:"check your email",
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

// verify forgot password otp

export async function verifyForgotPasswordOtp(req,res) {
    try {
        const {email,otp}=req.body
        if(!email||!otp){
            return res.status(400).json({
                message:"provide required field",
                error:true,
                success:false
            })
        }

        const user=await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message:"email not available",
                error:true,
                success:false
            })
        }

        const currentTime=new Date().toISOString()

        if(user.forgot_pssword_expiry<currentTime){
            return res.status(400).json({
                message:"otp expire",
                error:true,
                success:false
            })
        }

        if(otp!==user.forgot_password_otp){
    return res.status(400).json({
        message:"invalid otp",
        error:true,
        success:false
    })
        }

        // if otp not expire and otp is matched then
        const updateUser=await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp:"",
            forgot_pssword_expiry:""
        })

        return res.json({
            message:"verify otp successfully",
            error:false,
            success:true
        })

        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

// reset the password

export async function resetPassword(req,res) {
    try {
        const {email,newPassword,confirmPassword}=req.body
        if(!email||!newPassword||!confirmPassword){
            return res.status(400).json({
                message:"provide required fields email,newPassword"
            })
        }

        const user=await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message:"email is not available",
                error:true,
                success:false
            })
        }

        if(newPassword!==confirmPassword){
            return res.status(400).json({
                message:"newpassword and confirmPassword must be same.",
                error:true,
                success:false
            })
        }

const salt=await bcryptjs.genSalt(10)
 const hashPassword=await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password:hashPassword
        })

        return res.json({
            message:"password updated successfully",
            error:false,
            success:true
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}


// refresh token controller

export async function refreshToken(req,res) {
    try {
        const refreshToken=req.cookies.refreshToken|| req?.headers?.authorization?.split(" ")[1]    // [bearer token]
         
          
        if(!refreshToken){
            return res.status(402).json({
                message:"Invalid token",
                error:true,
                success:false
            })
        }
       

        const verifyToken= await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return res.status(401).json({
                message:"token is expire",
                error:true,
                success:false
            })
        }
        console.log("verifyToken",verifyToken);
        
        const userId=verifyToken._id

        const newAccessToken = await generateAccessToken(userId)

        const cookiesOption={
            httpOnly:true,
            secure:true,
            samesite:"none"
           }

        res.cookie('accessToken',newAccessToken,cookiesOption)

        return res.json({
            message:"new access token generated",
            error:false,
            success:true,
            data:{
                accessToken:newAccessToken
            }
        })
        

        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

// get login user details

export async function userDetails(req,res) {
    try {
        const userId = req.userId

        console.log(userId)

        const user=await UserModel.findById(userId).select('-password -refresh_token')
        return res.json({
        message:'user details',
        data:user,
        error:false,
        success:true
        })
    } catch (error) {
         return res.status(500).json({
            message:"something is wrong",
            error:true,
            success:false
         })
    }
}
