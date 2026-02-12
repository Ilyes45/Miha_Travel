// 1- require express
const express = require('express');
const { register, login } = require('../controllers/user');


// 2- const router

const router = express.Router();


// route user (login && registre )

// registre 
router.post('/register',register)

// login 

router.post('/login',login);


// 3- export 

module.exports = router;