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
  let { email = "*"} = req.query;

  let sqlKey = `select * from member where newsid=1`;

  let handleSql = `select * from member 
  where newsid = 1 
  like ?`;
  //   console.log(handleSql);
  conn.query(sqlKey, [], function (err, rows) {
    //   conn.query(handleSql, [area, town, day, keyword], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

// router.get("/edit/:itin_id", function (req, res, next) {
//   let itin_id = req.itin_id;
//   res.send(`edit: ${itin_id}`);
// });
// 更新會員資料
router.put("/update", function (req, res, next) {
  let sqlKey=" member member_name = ?, valid = ? "
  conn.beginTransaction
  res.send("已連線")
})

// app.put("/edit/:id", function (req, res) {
//   let sqlKey = `select * from member where newsid=1`;
// 	conn.query(
// 		"update news set title = ?, ymd = ? where newsId = " 
// 		    + req.body.newsId, 
// 			[
// 				req.body.member_name,
// 			]);
// 	res.send("row updated.");
// })
// router.put('/', function (req, res, next) {
//     res.send(`edit: ${id}`);
//   });

module.exports = router;
