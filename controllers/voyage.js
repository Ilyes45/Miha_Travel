const Voyage = require('../models/Voyage');

// GET all voyages
exports.getAllVoyages = async (req, res) => {
  try {
    const voyages = await Voyage.find().populate('destination');
    res.status(200).json(voyages);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};

// GET one voyage
exports.getVoyageById = async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id).populate('destination');
    if (!voyage) return res.status(404).json({ msg: 'Voyage non trouvé' });
    res.status(200).json(voyage);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};

// POST create voyage (admin only)
exports.createVoyage = async (req, res) => {
  try {
    const newVoyage = new Voyage(req.body);
    await newVoyage.save();
    res.status(201).json({ msg: 'Voyage créé avec succès', voyage: newVoyage });
  } catch (error) {
    res.status(400).json({ msg: 'Erreur lors de la création', error });
  }
};

// PUT update voyage (admin only)
exports.updateVoyage = async (req, res) => {
  try {
    const updated = await Voyage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Voyage non trouvé' });
    res.status(200).json({ msg: 'Voyage mis à jour', voyage: updated });
  } catch (error) {
    res.status(400).json({ msg: 'Erreur lors de la mise à jour', error });
  }
};

// DELETE voyage (admin only)
exports.deleteVoyage = async (req, res) => {
  try {
    const deleted = await Voyage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Voyage non trouvé' });
    res.status(200).json({ msg: 'Voyage supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};