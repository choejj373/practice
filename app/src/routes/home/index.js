"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/logout", ctrl.output.logout);
router.get("/register", ctrl.output.register);
router.get("/chat", ctrl.output.chat);
router.get("/test", ctrl.output.test);
router.get("/inventory", ctrl.output.inventory);
router.get("/store", ctrl.output.store);

router.post("/login", ctrl.process.login );
router.post("/register", ctrl.process.register );
router.post("/inventory", ctrl.process.inventory );
router.post("/store", ctrl.process.store);
module.exports = router;  