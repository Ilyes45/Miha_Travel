const router = require("express").Router();
const {
  sendContact, getMesMessages, getAllContacts,
  repondreContact, deleteContact, marquerLu
} = require("../controllers/contact");
const isauth  = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.post("/",              sendContact);
router.get("/mes-messages",   isauth, getMesMessages);
router.get("/",               isauth, isAdmin, getAllContacts);
router.put("/repondre/:id",   isauth, isAdmin, repondreContact);
router.put("/lu/:id",         isauth, isAdmin, marquerLu);
router.delete("/:id",         isauth, deleteContact);

module.exports = router;