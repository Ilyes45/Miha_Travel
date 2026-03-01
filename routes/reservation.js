const express = require('express');
const router = express.Router();

const isauth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { createReservation, getMyReservations, cancelMyReservation, getAllReservations, updateStatut, deleteReservation } = require('../controllers/reservation');

// ─── CLIENT (connecté) ─────────────────────────────────────
router.post('/', isauth, createReservation);
router.get('/mes-reservations', isauth, getMyReservations);
router.put('/annuler/:id', isauth, cancelMyReservation);

// ─── ADMIN ─────────────────────────────────────────────────
router.get('/', isauth, isAdmin, getAllReservations);
router.put('/statut/:id', isauth, isAdmin, updateStatut);
router.delete('/:id', isauth, isAdmin, deleteReservation);

module.exports = router;