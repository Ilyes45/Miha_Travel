const Hotel = require('../models/Hotel');
const Voyage = require('../models/Voyage');

exports.getPromotions = async (req, res) => {
  try {
    const today = new Date();
    const voyages = await Voyage.find({
      "promotion.actif": true,
      "promotion.dateExpiration": { $gte: today }
    }).populate("destination");

    const hotels = await Hotel.find({
      "promotion.actif": true,
      "promotion.dateExpiration": { $gte: today }
    }).populate("destination");

    res.status(200).json({ voyages, hotels });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};