
const router = require("express").Router();
const { getNotifications, markAllRead, markOneRead } = require("../controllers/notification");
const isauth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");




router.get("/",isauth, isAdmin, getNotifications);
router.put("/read-all",isauth, isAdmin, markAllRead);
router.put("/read/:id",isauth, isAdmin, markOneRead);

module.exports = router;