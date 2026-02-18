
const User = require("../models/User");
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