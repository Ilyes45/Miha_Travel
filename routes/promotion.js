const express = require('express');
const { getPromotions } = require('../controllers/promotion');

const router  = express.Router();


router.get('/', getPromotions);

module.exports = router;