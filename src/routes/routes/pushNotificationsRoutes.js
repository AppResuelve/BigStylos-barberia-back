const { Router } = require("express");
const updateUserTokenHandler = require("../../handlers/pushNotificationsHandlers/putUserTokenHandler");
const sendPushNotificationHandler = require("../../handlers/pushNotificationsHandlers/sendPushNotificationHandler");

const router = Router();
router.put("/updateusertoken", updateUserTokenHandler);
router.post("/send", sendPushNotificationHandler);

module.exports = router;
