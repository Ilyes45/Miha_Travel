const Annonce = require('../models/Annonce');

// GET toutes les annonces actives (public)
exports.getAnnoncesActives = async (req, res) => {
  try {
    const annonces = await Annonce.find({ actif: true }).sort({ createdAt: -1 });
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

// GET toutes les annonces (admin)
exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find().sort({ createdAt: -1 });
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

// POST créer annonce (admin)
exports.createAnnonce = async (req, res) => {
  try {
    const annonce = new Annonce(req.body);
    await annonce.save();
    res.status(201).json({ msg: "Annonce créée", annonce });
  } catch (error) {
    res.status(400).json({ msg: "Erreur création", error });
  }
};

// PUT modifier annonce (admin)
exports.updateAnnonce = async (req, res) => {
  try {
    const updated = await Annonce.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Annonce non trouvée" });
    res.status(200).json({ msg: "Annonce mise à jour", annonce: updated });
  } catch (error) {
    res.status(400).json({ msg: "Erreur mise à jour", error });
  }
};

// DELETE supprimer annonce (admin)
exports.deleteAnnonce = async (req, res) => {
  try {
    const deleted = await Annonce.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Annonce non trouvée" });
    res.status(200).json({ msg: "Annonce supprimée" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};