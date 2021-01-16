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

// // 更新會員資料
router.put("/member/", function (req, res, next) {
    console.log(req.body.newsid)
    let sqlKey = `update member set 
      email='${req.body.email}', 
      password='${req.body.password}', 
      member_name='${req.body.member_name}',  
      member_phone='${req.body.member_phone}',  
      birthday='${req.body.birthday}', 
      member_sex='${req.body.member_sex}',
      member_id='${req.body.member_id}',
      member_aboutme='${req.body.member_aboutme}' where newsid='${req.body.newsid}'`;
  conn.query(sqlKey,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
  });
  
  router.put("/member/:id", function (req, res, next) {
    console.log(req.body.id)
  
    // let sqlKey = `update member set 
    // email='${req.body.email}', password='${req.body.password}' where id='${id}'`;
    let sqlKey = `update member set 
      email='${req.body.email}', 
      password='${req.body.password}', 
      member_name='${req.body.member_name}',  
      member_phone='${req.body.member_phone}',  
      birthday='${req.body.birthday}', 
      member_sex='${req.body.member_sex}',
      member_id='${req.body.member_id}',
      member_aboutme='${req.body.member_aboutme}' where newsid='${req.body.newsid}'`;
  conn.query(sqlKey,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
  });
  
  module.exports = router;