const jwt = require("jsonwebtoken");
const User = require("../models/User");


const isauth= async(req, res, next ) =>{
    try {
     // token header
     const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({ msg: "Not authorized  !!" });
        }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const foundUser = await User.findById({_id: decoded.id});
    if (!foundUser) {
        return res.status(401).json({ msg: "Not authorized  !!" });
    }
    req.user = foundUser;
    next();

    }catch (error) {
        res.status(401).json({ msg: "Not authorized  !!", error });
    }
};
module.exports =isauth;
    