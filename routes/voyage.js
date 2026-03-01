const express = require('express');

const {
  getAllVoyages,
  getVoyageById,
  createVoyage,
  updateVoyage,
  deleteVoyage,
} = require('../controllers/voyage');
const isauth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');


// 2- const router
const router = express.Router();


// Public
router.get('/', getAllVoyages);
router.get('/:id', getVoyageById);



// Admin only
router.post('/', isauth, isAdmin, createVoyage);
router.put('/:id', isauth, isAdmin, updateVoyage);
router.delete('/:id', isauth, isAdmin, deleteVoyage);

module.exports = router;