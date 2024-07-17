const { Router } = require("express");
const getServicesHandler = require("../../handlers/servicesHandler/getServicesHandler");
const createServicesHandler = require("../../handlers/servicesHandler/createServicesHandler");
const deleteServicesHandler = require("../../handlers/servicesHandler/deleteServicesHandler");
const updateServicesImgHandler = require("../../handlers/servicesHandler/updateServicesImgHandler");
const updateCategoryHandler = require("../../handlers/servicesHandler/updateCategoryHandler");
const updateServiceHandler = require("../../handlers/servicesHandler/updateServiceHandler");

const router = Router();

router.get("/", getServicesHandler);
router.post("/create", createServicesHandler);
router.post("/delete", deleteServicesHandler);
router.post("/updateimg", updateServicesImgHandler);
router.put("/updatecategory", updateCategoryHandler);
router.put("/updateservice", updateServiceHandler);


module.exports = router;
