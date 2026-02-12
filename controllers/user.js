
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async(req , res ) =>{
    try {
        const {nom,email,motDePasse} = req.body;
          // 1️⃣ vérifier si email existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // 2️⃣ hash password
    //const saltRounds = 10;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(motDePasse, salt);

    // 3️⃣ créer user
    // const newUser = new User({...req.body, motDePasse: hashedPassword });
    const newUser = new User({
      nom,
      email,
      motDePasse: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({ msg: "User registered successfully" });

  } catch (error) {
    res.status(400).json({ msg: "Can not register user", error });
  }
};


exports.login = async (req,res)=>{
    res.send("login route");
};