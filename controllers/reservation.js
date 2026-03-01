const Reservation = require('../models/Reservation');

// ─── CLIENT ────────────────────────────────────────────────

// créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const { type, voyage, hotel, dateDebut, dateFin, nombrePersonnes, telephone,prixTotal, message } = req.body;

    const newReservation = new Reservation({
      user: req.user._id,
      type,
      voyage: type === "voyage" ? voyage : null,
      hotel: type === "hotel" ? hotel : null,
      dateDebut,
      dateFin,
      nombrePersonnes,
      telephone,
      prixTotal,
      message,
    });

    await newReservation.save();
    const populated = await newReservation.populate([
      { path: "voyage" },
      { path: "hotel" },
    ]);

    res.status(201).json({ msg: "Réservation créée avec succès", reservation: populated });
  } catch (error) {
    res.status(400).json({ msg: "Erreur lors de la création", error });
  }
};

// mes réservations (client connecté)
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate({
        path: "voyage",
        populate: { path: "destination" }  // ← populate imbriqué
      })
      .populate({
        path: "hotel",
        populate: { path: "destination" }  // ← populate imbriqué
      })
      .sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

// annuler ma réservation
exports.cancelMyReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, user: req.user._id });
    if (!reservation) return res.status(404).json({ msg: "Réservation non trouvée" });
    if (reservation.statut === "confirmee") {
      return res.status(400).json({ msg: "Impossible d'annuler une réservation confirmée" });
    }
    reservation.statut = "annulee";
    await reservation.save();
    res.status(200).json({ msg: "Réservation annulée", reservation });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

// ─── ADMIN ─────────────────────────────────────────────────

// toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "nom email")
      .populate("voyage", "title price")
      .populate("hotel", "nom prix")
      .sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

// changer statut (admin)
exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    ).populate("user", "nom email").populate("voyage").populate("hotel");

    if (!reservation) return res.status(404).json({ msg: "Réservation non trouvée" });
    res.status(200).json({ msg: "Statut mis à jour", reservation });
  } catch (error) {
    res.status(400).json({ msg: "Erreur", error });
  }
};

// supprimer (admin)
exports.deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Réservation non trouvée" });
    res.status(200).json({ msg: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};