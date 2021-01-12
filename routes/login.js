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
  //let { email = "*"} = req.query;

  let sqlKey = `select * from member where valid=1`;

  let handleSql = `select * from member 
  where member_sex = 1 
  and valid=1 
  and email = ?
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

router.get("/edit/:itin_id", function (req, res, next) {
  let itin_id = req.itin_id;
  res.send(`edit: ${itin_id}`);
});

module.exports = router;
