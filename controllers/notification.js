const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(50);
    const unread = await Notification.countDocuments({ lu: false });
    res.json({ notifs, unread });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ lu: false }, { lu: true });
    res.json({ message: "OK" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markOneRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { lu: true });
    res.json({ message: "OK" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};