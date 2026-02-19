// 1 - require mongoose

const mongoose = require('mongoose');

// 2 - create schema

const {Schema, model} = mongoose;

const DestinationSchema = new Schema({
    nom: {
      type: String,
      required: true,
      trim: true,
    },  
    paye: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    }}
    ,{ timestamps: true });

// 3 - create model

const Destination = model('Destination', DestinationSchema);
        
// 4 - export du model

module.exports = Destination;