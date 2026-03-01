const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const HotelSchema = new Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: [String],
  etoiles: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  prix: {
    type: Number,
    required: true,
    min: 0,
  },
  adresse: {
    type: String,
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Hotel = model('Hotel', HotelSchema);
module.exports = Hotel;