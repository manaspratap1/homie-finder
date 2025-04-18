const cloudinary = require('cloudinary').v2;
const Flat = require('../models/flatModel');
const streamifier = require('streamifier'); 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const createFlat = async (req, res) => {
    const { hostelName,  address, city, landmark, capacity, rent, description } = req.body;
    console.log(req.files);

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
    }

    try {
        const imageUrls = [];

        const uploadToCloudinary = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'flats/images' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        for (const file of req.files) {
            const url = await uploadToCloudinary(file.buffer);
            imageUrls.push(url);
        }

        const flat = new Flat({
            owner: req.user.id,
            hostelName,
            address,
            city,
            landmark,
            capacity,
            rent,
            images: imageUrls,
            description
        });

        await flat.save();
        res.status(201).json({ message: 'Flat created successfully', flat });

    } catch (error) {
        res.status(500).json({ message: 'Error creating flat', error: error.message });
    }
};


const getAllFlats = async (req, res) => {
    try {
        const flats = await Flat.find().populate('owner', 'name phone');
        res.json(flats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFlatById = async (req, res) => {
    const { id } = req.params;
    try {
        const flat = await Flat.findById(id).populate('owner', 'name phone'); 
        if (!flat) {
            return res.status(404).json({ message: 'Flat not found' });
        }
        res.json(flat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFlat = async (req, res) => {
    const { id } = req.params;
    const { hostelName, address, city, landmark, capacity, rent, description } = req.body;

    try {
        const flat = await Flat.findById(id);

        if (!flat) {
            return res.status(404).json({ message: 'Flat not found' });
        }

        flat.hostelName = hostelName || flat.hostelName;
        flat.address = address || flat.address;
        flat.city = city || flat.city;
        flat.landmark = landmark || flat.landmark;
        flat.capacity = capacity || flat.capacity;
        flat.rent = rent || flat.rent;
        flat.description = description || flat.description;

        if (req.files && req.files.length > 0) {
            const imageUrls = [];

            const uploadToCloudinary = (fileBuffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'flats/images' },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        }
                    );
                    streamifier.createReadStream(fileBuffer).pipe(stream);
                });
            };

            for (const file of req.files) {
                const url = await uploadToCloudinary(file.buffer);
                imageUrls.push(url);
            }

            flat.images = imageUrls; 
        }

        await flat.save();
        res.json({ message: 'Flat updated successfully', flat });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFlat = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Flat.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Flat not found' });
        }

        res.json({ message: 'Flat deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFlat,
    getAllFlats,
    getFlatById,
    updateFlat,
    deleteFlat
};
