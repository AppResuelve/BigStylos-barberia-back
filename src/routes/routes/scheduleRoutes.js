const { Router } = require("express");
const updateScheduleHandler = require("../../handlers/scheduleHandlers/updateScheduleHandler");
const getScheduleHandler = require("../../handlers/scheduleHandlers/getScheduleHandler");
const getNoWorkDaysHandler = require("../../handlers/scheduleHandlers/getNoWorkDaysHandler");
const updateNoWorkHandler = require("../../handlers/scheduleHandlers/updateNoWorkHandler");
const updateNoWorkCancelTurnHandler = require("../../handlers/scheduleHandlers/updateNoWorkCancelTurnHandler");


const router = Router();

router.get("/", getScheduleHandler);
router.get("/noworkdays", getNoWorkDaysHandler);
router.put("/updatenowork", updateNoWorkHandler);
router.put("/updatenowork&cancelturn", updateNoWorkCancelTurnHandler);
router.put("/update", updateScheduleHandler);

module.exports = router;