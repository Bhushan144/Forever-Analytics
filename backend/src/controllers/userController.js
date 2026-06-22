import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'

const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY })
}

const register = async (req, res) => {
    try {
        //get the details
        const { name, email, password } = req.body;

        //validate the email and password 
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "enter a valid email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "password must be atleast 8 character long" })
        }

        //check user already exist or not 
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(409).json({ success: false, message: "user already exist" })
        }

        //hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user in database 
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: "User"
        })
        const user = await newUser.save(); //now this user has _id in mongodb

        //now generate a token 
        const payload = {
            "_id": user._id,
            "role": user.role
        }
        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY })

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
        }

          const userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.cookie("token", token, options);

        return res.status(201).json({ success: true, message: "user registered successfully",user:userInfo })

    } catch (error) {
        console.log("Error during registration: ", error.message)
        res.status(500).json({ success: false, message: "an error occured on the server" })
    }
}

const login = async (req, res) => {
    try {
        //get the email and password from user 
        const { email, password } = req.body;

        //check whether the email and password are valid or not
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })
        }

        //check whether the user exist in database or not , if yes then first check password is matching or not then generate access token and send 
        //if no then send message invalid credential 
        const user = await userModel.findOne({ email });
        if (!user || user.role !== 'User') {
            return res.status(401).json({ success: false, message: "Invalid Credential" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Credential" })
        }

        const payload = {
            "_id": user._id,
            "role": user.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY })

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
        }
        res.cookie("token", token, options);

        const userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return res.status(200).json({ success: true, message: "login successfull.",user:userInfo })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while login", error: error.message })
    }
}

const verifyUser = async (req, res) => {
    try {
        const user = req.user;
        const userInfo = {
            '_id': user._id,
            'email': user.email,
            'role': user.role
        }
        return res.status(200).json({ success: true, message: "user is verified", user: userInfo });
    } catch (error) {
        return res.status(500).json({ success: false, message: "user verification failed" });
    }
}

const logout = async (req,res)=>{
    try {
        const options = {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production'
        }
        res.clearCookie('token',options).status(200).json({success:true,message:"logout successfully"})

    } catch (error) {
        res.status(500).json({success:false,message:"server error"})
    }
}


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await userModel.findOne({ email });
        if (!admin || admin.role !== "Admin") {
            return res.status(401).json({ success: false, message: "invalid credential" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "invalid credential" });
        }

        const payload = {
            "_id": admin._id,
            "role": admin.role
        }
        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY })

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
        }

        return res.cookie("token", token, options).status(200).json({ success: true, message: "admin login successfull." })

    } catch (error) {
        res.status(500).json({ success: false, message: "error while admin login." })
    }
}

const logoutAdmin = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }
        res.clearCookie('token', options).status(200).json({ success: true, message: "logout successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error' })
    }
}

const verifyAdmin = async (req, res) => {
    const userInfo = {
        _id: req.admin._id,
        email: req.admin.email,
        role: req.admin.role // The frontend needs this for UX
    };
    res.status(200).json({ success: true, message: "admin is authorized", admin: userInfo })
}

export { register, login, logout, verifyUser, adminLogin, verifyAdmin, logoutAdmin };