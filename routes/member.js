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

//會員資料
router.get("/", function (req, res, next) {
  let { id: newsId } = req.body
  //驗證用戶是否存在
  let sqlKey = `SELECT member.*,
  email,
  password,
  newsId='${newsId}'
  from member where valid=1`;
  //let sqlKey = `select * from member email='${req.body.email}' and password='${req.body.password}' and newsId='${newsId}'`;
  //這樣寫才對
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log('/member',obj);
  
  conn.query(sqlKey,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});

router.get("/:id", function (req, res, next) {

  let { id: newsId } = req.params
  let sqlKey = `select * from member where newsId='${newsId}' or valid=1`
  //驗證用戶是否存在
  //let sqlKey = `select * from member where `;
  //let sqlKey = `select * from member where email='${req.body.email}' and password='${req.body.password}' and newsId='${newsId}'`;
  //這樣寫才對
  const obj = JSON.parse(JSON.stringify(req.params)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log('/member:id',obj);
  conn.query(sqlKey,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});

module.exports = router;
