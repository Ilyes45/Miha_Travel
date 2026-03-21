const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  nom:          { type: String, required: true },
  email:        { type: String, required: true },
  telephone:    { type: String },
  message:      { type: String, required: true },
  lu:           { type: Boolean, default: false },
  repondu:      { type: Boolean, default: false },
  reponseAdmin: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);