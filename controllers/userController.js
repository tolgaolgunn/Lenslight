import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Create a User
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({user:user_id});
        res.redirect("/login");
    } catch (error) {
        let errors2 = {};
    
        if (error.code === 11000) {
            errors2.email = "Email already exists";
        }
    
        if (error.name === 'ValidationError') {
            Object.keys(error.errors).forEach((key) => {
                errors2[key] = error.errors[key].message;
            });
        }
    
        res.status(400).json({ errors2 });
    }
    
    
    
};

// Login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                succeeded: false,
                error: 'User not found',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.cookie('jsonwebtoken',token,{
                httpOnly:true,
                maxAge:1000*60*60*24, //for 1 day
            });

            res.redirect("/users/dashboard");
        } else {
            return res.status(401).json({
                msg: 'Password is incorrect',
            });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({
            succeeded: false,
            message: 'Failed to login user',
            error: error.message,
        });
    }
};

const createToken=(userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'1d'})
}

const getDashboardPage = (req,res)=>{
    res.render("dashboard",{
        link:'dashboard'
    });
}

export { createUser, loginUser,getDashboardPage };
