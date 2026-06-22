import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const adminAuth = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({success:false,message:"Not Authorized,login Again,please"})
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);

        const admin = await userModel.findOne({_id:decodedToken._id})
        if(!admin || decodedToken.role !=="Admin"){
            return res.json({success:false,message:"Not Authorized,login Again"})
        }

        req.admin = admin;
        
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Authentication failed. Please login again." });
    }
}

export default adminAuth;