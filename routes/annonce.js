const express  = require('express');
const router   = express.Router();
const {
  getAnnoncesActives, getAllAnnonces,
  createAnnonce, updateAnnonce, deleteAnnonce
} = require('../controllers/annonce');
const isauth  = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Public
router.get('/', getAnnoncesActives);

// Admin
router.get('/all',    isauth, isAdmin, getAllAnnonces);
router.post('/',      isauth, isAdmin, createAnnonce);
router.put('/:id',    isauth, isAdmin, updateAnnonce);
router.delete('/:id', isauth, isAdmin, deleteAnnonce);

module.exports = router;