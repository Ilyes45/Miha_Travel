const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ReservationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["voyage", "hotel"],
    required: true,
  },
  voyage: {
    type: Schema.Types.ObjectId,
    ref: "Voyage",
    default: null,
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    default: null,
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
  nombrePersonnes: {
    type: Number,
    required: true,
    min: 1,
  },
  telephone: {
    type: String,
    required: true,
    trim: true,
  },
  prixTotal: {
    type: Number,
    required: true,
  },
  statut: {
    type: String,
    enum: ["en_attente", "confirmee", "annulee"],
    default: "en_attente",
  },
  message: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const Reservation = model('Reservation', ReservationSchema);
module.exports = Reservation;