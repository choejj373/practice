"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");
const authUtil = require('../../middlewares/auth')

// router.get("/login", ctrl.output.login);
// router.get("/register", ctrl.output.register);
// router.get("/test", ctrl.output.test);

// router.get("/inventory", authUtil.checkToken,ctrl.output.inventory);
// router.get("/singlegame", authUtil.checkToken,ctrl.output.singlegame);
// router.get("/matchmaking", authUtil.checkToken,ctrl.output.matchmaking);



// router.post("/inventory/get-all", authUtil.checkToken,ctrl.process.inventory_get_all );
// router.post("/inventory/sell-item", authUtil.checkToken,ctrl.process.inventory_sell_item );

//// 삭제 예정
// router.post("/singlegame", authUtil.checkToken,ctrl.process.startsinglegame);
// router.delete("/singlegame", authUtil.checkToken,ctrl.process.endsinglegame );
////

router.get("/", ctrl.output.home);

//처음 시작시나 브라우저 리로드시 토큰으로 인증 체크
router.put("/", authUtil.checkToken, ctrl.process.checkToken );
router.get("/crypto/publickey", ctrl.process.getPublicKey );
//router.get("/crypto/symmetrickey", ctrl.process.getSimmetricKey );

router.post("/user/guest", ctrl.process.guestRegister );
router.put("/user/guest", ctrl.process.guestLogin );

router.post("/user", ctrl.process.register );
router.put("/user", ctrl.process.login );

router.get("/user", authUtil.checkToken,ctrl.process.getuserinfo);
router.delete("/user", authUtil.checkToken,ctrl.process.logout);


router.get("/store", authUtil.checkToken,ctrl.process.getTradeDailyStore);
router.post("/store/daily", authUtil.checkToken,ctrl.process.dailystore);
router.post("/store/diamond", authUtil.checkToken,ctrl.process.diamondstore);


router.get("/equipment", authUtil.checkToken,ctrl.process.getItemAll );
router.put("/equipment/inventory", authUtil.checkToken,ctrl.process.equipItem );
router.delete("/equipment/inventory", authUtil.checkToken,ctrl.process.sellItem );
router.put("/equipment/equip", authUtil.checkToken,ctrl.process.unEquipItem );


router.get("/quest/daily", authUtil.checkToken,ctrl.process.getUserDailyQuestInfo );
router.get("/quest/weekly", authUtil.checkToken,ctrl.process.getUserWeeklyQuestInfo );
router.get("/quest/normal", authUtil.checkToken,ctrl.process.getUserNormalQuestInfo );
router.put("/quest/reward", authUtil.checkToken,ctrl.process.requireQuestReward );

router.get('/auth/google', ctrl.process.googleLogin );
router.get('/auth/google/callback', ctrl.process.googleRedirect );
 
module.exports = router;   