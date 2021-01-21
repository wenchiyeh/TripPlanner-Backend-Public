// var express = require("express");
// var router = express.Router();

// const GetPayment = require("../controllers/get_controller");
// const ModifyPayment = require("../controllers/modify_controller");

// getPayment = new GetPayment();
// modifyPayment = new ModifyPayment();

// // 用戶進入付款頁面所呼叫的API
// router.get("/productList", getPayment.payUid);

// // 用戶在付款頁面按下結帳的API
// router.get("/paymentaction", getPayment.payAction);

// // 銜接歐付寶的Return_URL回來的資料
// router.post("/", modifyPayment.paymentResult);

// // 銜接歐付寶的OrderResultURL
// router.post("/paymentactionresult", modifyPayment.paymentActionResult);

// module.exports = router;
