const User = require('../models/userModel');

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profilePic: user.profilePic
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, profilePic } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user.id !== id) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own account' });
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.profilePic = profilePic || user.profilePic;

        const updatedUser = await user.save();

        res.json({
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profilePic: updatedUser.profilePic
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await User.deleteOne({ _id: id });

        if (req.user.id !== id) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own account' });
        }        

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserById, updateUser, deleteUser };
