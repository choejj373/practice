"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/logout", ctrl.output.logout);
router.get("/register", ctrl.output.register);
// router.get("/chat", ctrl.output.chat);
router.get("/test", ctrl.output.test);
router.get("/inventory", ctrl.output.inventory);
router.get("/store", ctrl.output.store);
router.get("/singlegame", ctrl.output.singlegame);
router.get("/matchmaking", ctrl.output.matchmaking);

router.post("/login", ctrl.process.login );
router.post("/register", ctrl.process.register );
router.post("/inventory/get-all", ctrl.process.inventory_get_all );
router.post("/inventory/sell-item", ctrl.process.inventory_sell_item );
router.post("/store", ctrl.process.store);
router.post("/singlegame", ctrl.process.startsinglegame);

router.delete("/singlegame", ctrl.process.endsinglegame );
module.exports = router;   