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
//註冊功能
router.post("/", function (req, res, next) {
    console.log(req.body)
    //新增會員
    //let sqlKey = `insert into member set email='${req.body.email}', password='${req.body.password}'`;
    let sqlKey = `select email from member where email ='${req.body.email}'`
    conn.query(sqlKey, [], function (err, rows) {
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }
      if(rows.length >= 1){
        console.log(rows[0].id);
        let returnData = {result : true, member : rows[0].id}
        res.send(JSON.stringify(returnData));
      }else{
        res.send(JSON.stringify({result : false}));
      }
    });
  });
module.exports = router;