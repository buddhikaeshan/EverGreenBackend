import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//login user
const loginUser = async (req, res) => {
    const{email,password}=req.body;
    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User Doesn't exist"})
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"Invalid Password"})
        }

        const token=createToken(user._id)
        return res.json({success:true,token})
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"})
 
    }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register
const register = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User Already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Pleace Enter Valid Email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password at least 8 characters" })
        }

        //encrypt password
        const salt = await bcrypt.genSalt(10)
        const hashedpass = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedpass
        })
        const user = await newUser.save()
        const token= createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export { loginUser, register };