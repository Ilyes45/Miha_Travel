// 1 - require mongoose

const mongoose = require('mongoose');

// 2 - create schema

const {Schema, model} = mongoose;

const UserSchema = new Schema({
         nom: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    motDePasse: {
      type: String,
      required: true,
    },
   
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },

    preferences: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 3 - creation du model 

const User=model("User",UserSchema);
    
// 4 - export du model

module.exports = User;