const Contact      = require("../models/Contact");
const Notification = require("../models/Notification");
const { sendContactMessage } = require("../utils/sendEmail");

exports.sendContact = async (req, res) => {
  try {
    const { nom, email, telephone, message } = req.body;
    if (!nom || !email || !message)
      return res.status(400).json({ msg: "Nom, email et message sont obligatoires" });

    const contact = await Contact.create({ nom, email, telephone, message });

    sendContactMessage({ nom, email, telephone, message }).catch((err) =>
      console.log("EMAIL CONTACT ERROR:", err.message)
    );

    await Notification.create({
      message: `Nouveau message de ${nom} (${email})`,
      type: "contact",
      data: { contactId: contact._id }
    });

    res.status(200).json({ msg: "Message envoyé avec succès" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur lors de l'envoi", error });
  }
};

exports.getMesMessages = async (req, res) => {
  try {
    const contacts = await Contact.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

exports.repondreContact = async (req, res) => {
  try {
    const { reponse } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Message non trouvé" });

    contact.reponseAdmin = reponse;
    contact.repondu      = true;
    contact.lu           = true;
    await contact.save();

    res.json({ msg: "Réponse enregistrée", contact });
  } catch (error) {
    res.status(500).json({ msg: "Erreur", error });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Message non trouvé" });

    if (req.user.role !== "admin" && contact.email !== req.user.email) {
      return res.status(403).json({ msg: "Non autorisé" });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ msg: "Message supprimé" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

exports.marquerLu = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { lu: true });
    res.json({ msg: "OK" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};