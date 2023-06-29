"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");
const authUtil = require('../../middlewares/auth')


// router.get("/chat", ctrl.output.chat);
router.get("/login", ctrl.output.login);
// router.get("/logout", ctrl.output.logout);
router.get("/register", ctrl.output.register);
router.get("/test", ctrl.output.test);

router.get("/", authUtil.checkToken, ctrl.output.home);
router.get("/inventory", authUtil.checkToken,ctrl.output.inventory);
router.get("/store", authUtil.checkToken,ctrl.output.store);
router.get("/singlegame", authUtil.checkToken,ctrl.output.singlegame);
router.get("/matchmaking", authUtil.checkToken,ctrl.output.matchmaking);


router.post("/login", ctrl.process.login );
router.post("/register", ctrl.process.register );

router.post("/inventory/get-all", authUtil.checkToken,ctrl.process.inventory_get_all );
router.post("/inventory/sell-item", authUtil.checkToken,ctrl.process.inventory_sell_item );
router.post("/store", authUtil.checkToken,ctrl.process.store);
router.post("/singlegame", authUtil.checkToken,ctrl.process.startsinglegame);

router.delete("/singlegame", authUtil.checkToken,ctrl.process.endsinglegame );
router.delete("/home", authUtil.checkToken,ctrl.process.logout);

router.get("/home", authUtil.checkToken,ctrl.process.getuserinfo);

module.exports = router;   