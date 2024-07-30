const { Router } = require("express");
const createPreferenceHandler = require("../../handlers/mercadoPagoHandlers/createPreferenceHandler.js");

const router = Router();

router.post("/createpreference", createPreferenceHandler);

module.exports = router;