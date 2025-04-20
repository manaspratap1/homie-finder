const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads');
const verifyToken  = require('../middlewares/authMiddleware');
const { createFlat, getAllFlats, getFlatById, updateFlat, deleteFlat, getMyFlats } = require('../controllers/flatController');

router.post('/create', verifyToken,upload.array('images', 5), createFlat);

router.get('/', getAllFlats);

router.get('/my', verifyToken, getMyFlats);

router.get('/:id', getFlatById);

router.put('/:id', verifyToken, updateFlat);

router.delete('/:id', verifyToken, deleteFlat);

module.exports = router;