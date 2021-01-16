var express = require("express");
var router = express.Router();
//使用環境參數
require("dotenv").config();

var mysql = require("mysql");
var conn = mysql.createConnection({
  host: process.env["dbhost"],
  user: process.env["dbuser"],
  password: process.env["dbpassword"],
  database: process.env["database"],
});

router.post("/", function (req, res, next) {
  console.log(req.body)
  //驗證用戶是否存在
  let sqlKey = `select * from member where email='${req.body.email}' and password='${req.body.password}'`;
  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    if(rows.length > 0){
      console.log(rows[0].newsid);
      let returnData = {result : true, member : rows[0].newsid}
      res.send(JSON.stringify(returnData));
    }else{
      res.send(JSON.stringify({result : false}));
    }
  });
});

module.exports = router;
