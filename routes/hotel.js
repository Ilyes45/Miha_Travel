const express = require('express');
const router  = express.Router();
const {
  getAllHotels, getHotelById,
  createHotel, updateHotel,
  deleteHotel, setPromotion,
} = require('../controllers/hotel');
const isauth  = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/',    getAllHotels);
router.get('/:id', getHotelById);

router.post('/',              isauth, isAdmin, createHotel);
router.put('/promotion/:id',  isauth, isAdmin, setPromotion);  // ← AVANT /:id
router.put('/:id',            isauth, isAdmin, updateHotel);
router.delete('/:id',         isauth, isAdmin, deleteHotel);

module.exports = router;