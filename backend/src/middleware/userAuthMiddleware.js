import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'


const userAuth = async (req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({success:false,message:"Not Authorized,login Again,please"})
        }
        const decodedToken = await jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await userModel.findOne({'_id':decodedToken._id});

        if(!user || decodedToken.role !=="User"){
            return res.json({success:false,message:"Not Authorized,login Again"})
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Authentication failed. Please login again." });
    }
}

export default userAuth;