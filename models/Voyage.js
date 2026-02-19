// 1 - require mongoose
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// 2 - create schema
const VoyageSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  destination: {
    type: Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },

  // Infos hôtel intégrées
 

  departureDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },
  

  description: {
    type: String,
    trim: true,
  },
  images: [String],

  isFeatured: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });

// 3 - create model
const Voyage = model("Voyage", VoyageSchema);

// 4 - export du model
module.exports = Voyage;
