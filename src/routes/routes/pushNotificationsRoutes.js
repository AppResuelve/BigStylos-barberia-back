const { Router } = require("express");
const sendPushNotificationHandler = require("../../handlers/pushNotificationsHandlers/sendPushNotificationHandler");
const updateUserTokenHandler = require("../../handlers/pushNotificationsHandlers/putUserTokenHandler");

const router = Router();
router.put("/updateusertoken", updateUserTokenHandler);
router.post("/send", sendPushNotificationHandler);

module.exports = router;
