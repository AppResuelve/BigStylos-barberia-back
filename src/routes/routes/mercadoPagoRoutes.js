const { Router } = require("express");
const createPreferenceHandler = require("../../handlers/mercadoPagoHandlers/createPreferenceHandler.js");
const getNotificationsHandler = require("../../handlers/mercadoPagoHandlers/getNotificationsHandler.js");

const router = Router();

router.post("/create_preference", createPreferenceHandler);
router.post("/mp_notifications", getNotificationsHandler);


module.exports = router;