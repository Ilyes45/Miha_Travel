const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type:    { type: String, default: "reservation" },
  lu:      { type: Boolean, default: false },
  data:    { type: Object },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);