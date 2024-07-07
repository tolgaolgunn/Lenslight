import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

// Kullanıcı oluşturma fonksiyonu
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            succeeded: true,
            user,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            succeeded: false,
            message: 'Failed to create user',
            error: error.message,
        });
    }
};

// Kullanıcı giriş fonksiyonu
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
            return res.status(200).json({
                msg: 'Login successful',
            });
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

export { createUser, loginUser };
