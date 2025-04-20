const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel');

const verifyToken = async(req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
