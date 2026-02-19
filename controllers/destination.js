const Destination = require('../models/Destination');


// GET all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};

// GET one destination
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ msg: 'Destination non trouvée' });
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};

// POST create destination (admin only)
exports.createDestination = async (req, res) => {
  try {
    console.log("req.body :", req.body); // ← ajoute ça
    const newDestination = new Destination(req.body);
    await newDestination.save();
    res.status(201).json({ msg: 'Destination créée avec succès', destination: newDestination });
  } catch (error) {
    res.status(400).json({ msg: 'Erreur lors de la création', error });
  }
};

// PUT update destination (admin only)
exports.updateDestination = async (req, res) => {
  try {
    const updated = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Destination non trouvée' });
    res.status(200).json({ msg: 'Destination mise à jour', destination: updated });
  } catch (error) {
    res.status(400).json({ msg: 'Erreur lors de la mise à jour', error });
  }
};

// DELETE destination (admin only)
exports.deleteDestination = async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Destination non trouvée' });
    res.status(200).json({ msg: 'Destination supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};