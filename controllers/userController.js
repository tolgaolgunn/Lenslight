import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Photo from '../models/photoModel.js';

dotenv.config();

// Create a User
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        // Yanıt gönderiyoruz
        res.status(201).json({ user: user._id });
        // Not: res.redirect("/login"); bu noktada kullanılamaz
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
            res.cookie('jsonwebtoken', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // 1 gün
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

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({ _id: { $ne: res.locals.user._id } });
      res.status(200).render('users', {
        users,
        link: 'users',
      });
    } catch (error) {
      res.status(500).json({
        succeded: false,
        error,
      });
    }
  };
  
  const getAUser = async (req, res) => {
    try {
      const user = await User.findById({ _id: req.params.id });  
      const photos = await Photo.find({ user: user._id });
      res.status(200).render('user', {
        user,
        photos,
        link: 'users',
      });
    } catch (error) {
      res.status(500).json({
        succeded: false,
        error,
      });
    }
  };
const getDashboardPage = async (req, res) => {
    const photos = await Photo.find({ user: res.locals.user._id });
    res.render("dashboard", {
        link: 'dashboard',
        photos
    });
}

export { createUser, loginUser, getDashboardPage, getAllUsers, getAUser };
