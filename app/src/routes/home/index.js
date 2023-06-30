"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");
const authUtil = require('../../middlewares/auth')




router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);
router.get("/test", ctrl.output.test);

router.get("/", authUtil.checkToken, ctrl.output.home);

router.get("/inventory", authUtil.checkToken,ctrl.output.inventory);
router.get("/singlegame", authUtil.checkToken,ctrl.output.singlegame);
router.get("/matchmaking", authUtil.checkToken,ctrl.output.matchmaking);


router.post("/login", ctrl.process.login );
router.post("/register", ctrl.process.register );

// router.post("/inventory/get-all", authUtil.checkToken,ctrl.process.inventory_get_all );
// router.post("/inventory/sell-item", authUtil.checkToken,ctrl.process.inventory_sell_item );

router.post("/singlegame", authUtil.checkToken,ctrl.process.startsinglegame);
router.delete("/singlegame", authUtil.checkToken,ctrl.process.endsinglegame );

router.get("/home", authUtil.checkToken,ctrl.process.getuserinfo);
router.delete("/home", authUtil.checkToken,ctrl.process.logout);


router.get("/store", authUtil.checkToken,ctrl.process.getTradeDailyStore);
router.post("/store/daily", authUtil.checkToken,ctrl.process.dailystore);
router.post("/store/diamond", authUtil.checkToken,ctrl.process.diamondstore);


router.get("/equipment", authUtil.checkToken,ctrl.process.getItemAll );
router.put("/equipment/inventory", authUtil.checkToken,ctrl.process.equipItem );
router.delete("/equipment/inventory", authUtil.checkToken,ctrl.process.sellItem );
router.put("/equipment/equip", authUtil.checkToken,ctrl.process.unEquipItem );

module.exports = router;   