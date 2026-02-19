// 1- require express
const express = require('express');

const {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destination');
const isauth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// 2- const router
const router = express.Router();


// Public
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);

// Admin only
router.post('/', isauth, isAdmin, createDestination);
router.put('/:id', isauth, isAdmin, updateDestination);
router.delete('/:id', isauth, isAdmin, deleteDestination);

module.exports = router;