// 1- require express
const express = require('express');
const { register, login } = require('../controllers/user');
const { registerValidation, validation, loginValidation } = require('../middleware/validation');
const isauth = require('../middleware/auth');

// 2- const router

const router = express.Router();


// route user (login && registre )

// registre 
router.post('/register', registerValidation(), validation, register)
// login 

router.post('/login', loginValidation(), validation, login);

// current user

router.get('/current', isauth, (req, res) => {
  res.send(req.user );
});

// 3- export 

module.exports = router;