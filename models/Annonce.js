const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({

  image:   { type: String, required: true }, // URL Cloudinary
  
  actif:   { type: Boolean, default: true },
}, { timestamps: true });
