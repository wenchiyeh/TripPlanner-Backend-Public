var express = require("express");
var router = express.Router();
//使用環境參數
require("dotenv").config();
//
var mysql = require("mysql");
var conn = mysql.createConnection({
  host: process.env["dbhost"],
  user: process.env["dbuser"],
  password: process.env["dbpassword"],
  database: process.env["database"],
});

/* GET itinerary listing. */
router.get("/", function (req, res, next) {
  let { id = "*"} = req.body;
  console.log(req.body)
  //let sqlKey = `select * from member where newsid=1`;
  //let sqlKey = `select member.* from member`
  let sqlKey = `select * from member where email ='${req.body.email}' or id='${id}'`
   conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    res.send(JSON.stringify(rows));
  });
});
// 更新會員資料
//let sqlKey=" member member_name = ?, valid = ? "
router.get("/:id", function (req, res, next) {
  console.log(req.params.id)
  //let sqlKey = `select * from member where email ='${req.body.email}'`
  let sqlKey = `select * from member where id=${req.params.id}`
conn.query(sqlKey,[], function (err, rows) {
  if(err){
      console.log(err);
  }
      res.send(JSON.stringify(rows));
      });
  
});
//找會員
// router.get("/:id", function (req, res, next) {
//   let id = req.body.email;
//   console.log(req.body)
//   let sqlKey = `select * from member where email ='${req.body.email}'`
//   conn.beginTransaction
//   res.send("已連線")
// })

module.exports = router;
