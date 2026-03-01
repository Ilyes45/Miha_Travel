
const User = require("../models/User");
const Reservation = require('../models/Reservation');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async(req , res ) =>{
    try {
        const { nom, email, motDePasse, telephone } = req.body;

          // 1️⃣ vérifier si email existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // 2️⃣ hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(motDePasse, saltRounds);

    // 3️⃣ créer user
    const newUser = new User({...req.body, motDePasse: hashedPassword });

    await newUser.save();

    // ceration du token 

     const token = jwt.sign(
      {
        id: newUser._id,

      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }

    );

      res.status(200).json({ msg: "User registered successfully...",user: newUser, token });

  } catch (error) {
    res.status(400).json({ msg: "Can not register user", error });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // check if user exists

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ msg: "Invalid credentials !!!" });
    }

    const checkPassword = await bcrypt.compare(motDePasse, foundUser.motDePasse);
    if (!checkPassword) {
      return res.status(400).json({ msg: "Invalid credentials !!!" });
    }

    // ceration du token 

     const token = jwt.sign(
      {
        id: foundUser._id,

      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }

    );

    res.status(200).json({msg: "Login successful...", user: foundUser, token });

  } catch (error) {
    res.status(400).json({ msg: "Login error", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "client" }, "nom email createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    const usersWithCount = await Promise.all(
      users.map(async (u) => {
        const count = await Reservation.countDocuments({ user: u._id });
        return { ...u.toObject(), reservationCount: count };
      })
    );

    res.status(200).json(usersWithCount);
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error });
  }
};

// UPDATE profile (client connecté)
exports.updateProfile = async (req, res) => {
  try {
    const { motDePasse, role, ...rest } = req.body; // empêcher de changer role ou password ici

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      rest,
      { new: true, runValidators: true }
    );

    res.status(200).json({ msg: 'Profil mis à jour', user: updated });
  } catch (error) {
    res.status(400).json({ msg: 'Erreur lors de la mise à jour', error });
  }
};

// DELETE user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    res.status(200).json({ msg: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};
// DELETE son propre compte (client connecté)
exports.deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ msg: 'Compte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur', error });
  }
};
