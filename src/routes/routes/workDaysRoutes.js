const { Router } = require("express");
const createDaysHandler = require("../../handlers/workDaysHandlers/createDaysHandler.js");
const updateDayHandler = require("../../handlers/workDaysHandlers/updateDayHandler.js");
const getDaysByEmailHandler = require("../../handlers/workDaysHandlers/getDaysByEmailHandler.js");
const getDaysByServicesHandler = require("../../handlers/workDaysHandlers/getDaysByServicesHandler.js");
const getDaysHandler = require("../../handlers/workDaysHandlers/getDaysHandler.js");
const getDayForTurnsHandler = require("../../handlers/workDaysHandlers/getDayForTurnsHandler.js");
const getMyTurnsHandler = require("../../handlers/workDaysHandlers/getMyTurnsHandler.js");
const createTurnHandler = require("../../handlers/workDaysHandlers/createTurnHandler.js");
const deleteDaysHandler = require("../../handlers/workDaysHandlers/deleteDaysHandler.js");
const cancelTurnHandler = require("../../handlers/workDaysHandlers/cancelTurnHandler.js");
const adminDeleteDayHandler = require("../../handlers/workDaysHandlers/adminDeleteDayHandler.js");
const whoIsComingHandler = require("../../handlers/workDaysHandlers/whoIsComingHandler.js");
const countWorkerHandler = require("../../handlers/workDaysHandlers/countWorkerHandler.js");

const router = Router();

router.get("/", getDaysHandler);
router.post("/dayforturns", getDayForTurnsHandler);
router.post("/byservices", getDaysByServicesHandler);
router.post("/create", createDaysHandler);
router.post("/byemail", getDaysByEmailHandler);
router.put("/updateday", updateDayHandler);
router.put("/turn", createTurnHandler);
router.post("/myturns", getMyTurnsHandler);
router.post("/delete", deleteDaysHandler); //recibe dia completo y lo elimina, creando en el modelo de cancelados
router.post("/cancel", cancelTurnHandler)
router.post("/admindeleteday", adminDeleteDayHandler)
router.post("/whoiscoming", whoIsComingHandler)
router.post("/countworker", countWorkerHandler)


/* router.get('/getHours', getHoursHandler); */

module.exports = router;
