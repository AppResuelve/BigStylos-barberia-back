const { Router } = require("express");

const userRoutes = require("./routes/userRoutes.js"); // trae el modulo userRouter de..
const daysRoutes = require("./routes/workDaysRoutes.js");
const servicesRoutes = require("./routes/servicesRoutes.js");
const scheduleRoutes = require("./routes/scheduleRoutes.js");
const personalizationRoutes = require("./routes/personalizationRoutes.js");
const cancelledRoutes = require("./routes/cancelledTurnsRoutes.js");

const router = Router(); // ejecuta Router de express

router.use("/users", userRoutes); //  .use de Router lleva path y callback (previamente importado)
router.use("/workdays", daysRoutes);
router.use("/services", servicesRoutes);
router.use("/schedule", scheduleRoutes);
router.use("/personalization", personalizationRoutes);
router.use("/cancelledturns", cancelledRoutes);
router.use("/mercadopago", mercadoPagoRoutes);

module.exports = router;
