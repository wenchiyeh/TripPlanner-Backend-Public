var express = require("express");
var router = express.Router();
//使用環境參數
require("dotenv").config();
var conn = require("../dbConnect");

//註冊功能
router.post("/", function (req, res, next) {
  console.log(req.body);
  //新增會員
  let sqlKey = `insert into member set email='${req.body.email}', password='${req.body.password}'`;
  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    if (rows.length >= 1) {
      console.log(rows[0].newsid);
      let returnData = { result: true, member: rows[0].newsid };
      res.send(JSON.stringify(returnData));
    } else {
      res.send(JSON.stringify({ result: false }));
    }
  });
});
module.exports = router;
