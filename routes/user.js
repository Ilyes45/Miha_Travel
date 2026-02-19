// 1- require express
const express = require('express');
const { register, login, updateProfile, deleteUser, deleteMyAccount } = require('../controllers/user');
const { registerValidation, validation, loginValidation } = require('../middleware/validation');
const isauth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

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


// modifier son propre profil (client connecté)
router.put('/profile', isauth, updateProfile);

// supprimer son propre compte (client connecté)
router.delete('/profile', isauth, deleteMyAccount);

// supprimer un user par id (admin seulement)
router.delete('/:id', isauth, isAdmin, deleteUser);

// 3- export 

module.exports = router;