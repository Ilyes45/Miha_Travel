const Notification = require('../models/Notification');
const Reservation = require('../models/Reservation');
const { sendReservationNotif } = require('../utils/sendEmail');

// ─── CLIENT ────────────────────────────────────────────────

// créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const { type, voyage, hotel, dateDebut, dateFin, nombrePersonnes, telephone, prixTotal, message } = req.body;

    const newReservation = new Reservation({
      user: req.user._id,
      type,
      voyage: type === "voyage" ? voyage : null,
      hotel:  type === "hotel"  ? hotel  : null,
      dateDebut,
      dateFin,
      nombrePersonnes,
      telephone,
      prixTotal,
      message,
    });

    await newReservation.save();

    const populated = await newReservation.populate([
      { path: "user",   select: "nom email" },
      { path: "voyage", select: "title" },
      { path: "hotel",  select: "nom" },
    ]);

    // ── email ──
    sendReservationNotif(populated).catch((err) => console.log("EMAIL ERROR:", err.message));

    // ── notification DB ──
    await Notification.create({
      message: `Nouvelle réservation de ${populated.user?.nom} pour ${populated.voyage?.title || populated.hotel?.nom}`,
      type: "reservation",
      data: { reservationId: populated._id }
    });

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
        populate: { path: "destination" }
      })
      .populate({
        path: "hotel",
        populate: { path: "destination" }
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
      .populate("user",   "nom email")
      .populate("voyage", "title price")
      .populate("hotel",  "nom prix")
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
      { returnDocument: 'after' }
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

exports.getRevenuParMois = async (req, res) => {
  try {
    const data = await Reservation.aggregate([
      { $match: { statut: "confirmee" } },
      {
        $group: {
          _id: {
            year:  { $year:  "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenu:       { $sum: "$prixTotal" },
          reservations: { $sum: 1 },
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year:         "$_id.year",
          month:        "$_id.month",
          revenu:       1,
          reservations: 1,
        }
      }
    ]);

    const moisFr = [
      "", "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
      "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"
    ];

    const formatted = data.map(d => ({
      ...d,
      label: `${moisFr[d.month]} ${d.year}`,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};