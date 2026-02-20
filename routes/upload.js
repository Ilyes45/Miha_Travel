const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const isauth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.post('/', isauth, isAdmin, upload.single('image'), (req, res) => {
  try {
    res.status(200).json({
      url: req.file.path,          // ← URL cloudinary automatique
      public_id: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ msg: 'Erreur upload', error });
  }
});

module.exports = router;