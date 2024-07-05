const { Router } = require("express");

const router = Router();

const createUserHandler = require("../../handlers/userHandlers/createUserHandler.js");
const getAllUsersHandler = require("../../handlers/userHandlers/getAllUsersHandler.js");
const updateUserHandler = require("../../handlers/userHandlers/updateUserHandler.js");
const getUserByEmailHandler = require("../../handlers/userHandlers/getUserByEmailHandler.js");
const deleteUserHandler = require("../../handlers/userHandlers/deleteUserHandler.js");
const getWorkersHandler = require("../../handlers/userHandlers/getWorkersHandler.js");
const verifyGoogleUser = require("../../middlewares/verifyGoogleUser.js");
const createGoogleUserHandler = require("../../handlers/userHandlers/createGoogleUserHandler.js");

router.get("/all", getAllUsersHandler);
router.post("/byemail", getUserByEmailHandler);
router.post("/create", createUserHandler);
router.post("/createGoogle", verifyGoogleUser, createGoogleUserHandler);
router.put("/update", updateUserHandler);
router.post("/byemail", getUserByEmailHandler);
router.put("/delete", deleteUserHandler);
router.get("/getworkers", getWorkersHandler);

module.exports = router;
