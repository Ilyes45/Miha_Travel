const express = require('express');
const router = express.Router();
const {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotel');
const isauth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public
router.get('/', getAllHotels);
router.get('/:id', getHotelById);

// Admin only
router.post('/', isauth, isAdmin, createHotel);
router.put('/:id', isauth, isAdmin, updateHotel);
router.delete('/:id', isauth, isAdmin, deleteHotel);

module.exports = router;