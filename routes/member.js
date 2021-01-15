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

//找出會員
router.get("/", function (req, res, next) {
  let { id = "*"} = req.body;
  console.log(req.body)
  //let sqlKey = `select * from member where newsid=1`;
  //let sqlKey = `select member.* from member`
  let sqlKey = `select * from member where email ='${req.body.email}' or id='${req.body.id}'`
   conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

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
// 更新會員資料
router.put("/:id", function (req, res, next) {
  console.log(req.body.id)
  let sqlKey = `update member set email='${req.body.email}',
      password='${req.body.password}' where id = ${req.body.id}`;
      // member_name='${req.body.member_name}',
      // member_phone='${req.body.member_phone}',
      // birthday='${req.body.birthday}',
      // member_sex='${req.body.member_sex}',
      // member_id='${req.body.member_id}',
      // member_aboutme='${req.body.member_aboutme}' 
conn.query(sqlKey,[], function (err, rows) {
  if(err){
      console.log(err);
  }
      res.send(JSON.stringify(rows));
      });
  
});

// router.put("/:id", function (req, res, next) {
//   console.log(req.params.id)
//   let sqlKey = `update member set email=${req.params.email}, password=${req.params.password} and where id =${req.params.id}`;
// conn.query(sqlKey,[], function (err, rows) {
//   if(err){
//       console.log(err);
//   }
//       res.send(JSON.stringify(rows));
//       });
  
// });

module.exports = router;
