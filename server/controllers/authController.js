const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
dotenv = require('dotenv').config();

const registerUser = async (req, res) => {
    const { name, email, password, phone, profilePic } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            profilePic
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                profilePic: savedUser.profilePic
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profilePic: user.profilePic
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
