const {check, validationResult} = require("express-validator");

exports.registerValidation=() => [
    check("nom","nom est obligatoire !!").not().isEmpty(),
    check("email","email est obligatoire !!").isEmail(),
    check("motDePasse","password est obligatoire !!").isLength({min:6}),
]

exports.loginValidation=() => [
    check("email","email est obligatoire !!").isEmail(),
    check("motDePasse","password est obligatoire !!").isLength({min:6}),
]

exports.validation = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next();
}
