const express = require('express');
const router  = express.Router();
const {
  getAllVoyages, getVoyageById,
  createVoyage, updateVoyage,
  deleteVoyage, setPromotion,
} = require('../controllers/voyage');
const isauth  = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/',    getAllVoyages);
router.get('/:id', getVoyageById);

router.post('/',               isauth, isAdmin, createVoyage);
router.put('/promotion/:id',   isauth, isAdmin, setPromotion);  // ← AVANT /:id
router.put('/:id',             isauth, isAdmin, updateVoyage);
router.delete('/:id',          isauth, isAdmin, deleteVoyage);

module.exports = router;