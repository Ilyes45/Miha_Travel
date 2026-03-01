const Hotel = require('../models/Hotel');

exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('destination');
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('destination');
    if (!hotel) return res.status(404).json({ msg: 'Hotel non trouvé' });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res.status(201).json({ msg: 'Hotel créé avec succès', hotel: newHotel });
  } catch (error) {
    res.status(400).json({ msg: 'Erreur lors de la création', error });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const updated = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Hotel non trouvé' });
    res.status(200).json({ msg: 'Hotel mis à jour', hotel: updated });
  } catch (error) {
    res.status(400).json({ msg: 'Erreur lors de la mise à jour', error });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const deleted = await Hotel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Hotel non trouvé' });
    res.status(200).json({ msg: 'Hotel supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};