const express = require("express");
const { createUser, getSingleUser, allRegisteredUser, updateUser, deleteUser } = require("../../controllers/register");
const signin = require("../../controllers/signin");
const signout = require("../../controllers/signout");
const jwtAuth = require("../authanticate/jwtAuth");
const forgotPass = require("../../controllers/forgotPass");
const resetPass = require("../../controllers/resetPass");
const registerRoutes = express.Router();

registerRoutes.post('/createuser',createUser);
registerRoutes.get('/singleuser/:userid',getSingleUser);
registerRoutes.get('/allregistereduser',allRegisteredUser),
registerRoutes.put('/updateregistereduser/:userid',updateUser);
registerRoutes.delete('/deleteregistereduser/:userid',deleteUser);

registerRoutes.post("/signin",signin);
registerRoutes.get('/signout',jwtAuth,signout);
registerRoutes.post('/forgotpass',forgotPass);
registerRoutes.post('/resetpass/:userid',resetPass);

module.exports = registerRoutes;