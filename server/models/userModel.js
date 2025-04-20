const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "https://www.w3schools.com/howto/img_avatar.png",
    },
});

const User = mongoose.model('User', userSchema);  // Register the 'User' model
module.exports = User;
