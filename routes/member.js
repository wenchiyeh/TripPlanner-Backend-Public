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
router.post("/", function (req, res, next) {
  let { newsid = "*" } = req.body;
  console.log(req.body)
  let sqlKey = `select * from member where newsid='1'`;
  //let sqlKey = `select member.* from member`
  //let sqlKey = `select member.* from member where email='${req.body.email}' or password='${req.body.password}' or newsid='1'`
  // let sqlKey = `select * from member where email ='${req.body.email}' 

  // or newsid='${req.body.newsid}'`;
  // or password='${req.body.password}' 
  // or member_name='${req.body.member_name}'  
  // or member_phone='${req.body.member_phone}'  
  // or birthday='${req.body.birthday}' 
  // or member_sex='${req.body.member_sex}'
  // or member_id='${req.body.member_id}'
  // or member_aboutme='${req.body.member_aboutme}'
  
   conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

//let sqlKey=" member member_name = ?, valid = ? "
router.post("/:id", function (req, res, next) {
  console.log(req.body.newsid)
  let sqlKey = `select * from member where email ='123@gmail.com'`
  // let sqlKey = `select * from member where email ='${req.body.email}' 
  // or newsid='${req.body.newsid}'`;
  //let sqlKey = `select member.* from member where email='${req.body.email}' or password='${req.body.password} or newsid='1'`

  // or password='${req.body.password}' 
  // or member_name='${req.body.member_name}'  
  // or member_phone='${req.body.member_phone}'  
  // or birthday='${req.body.birthday}' 
  // or member_sex='${req.body.member_sex}'
  // or member_id='${req.body.member_id}'
  // or member_aboutme='${req.body.member_aboutme}'
  
  
conn.query(sqlKey,[], function (err, rows) {
  if(err){
      console.log(err);
  }
      res.send(JSON.stringify(rows));
      });
  
});
// 更新會員資料
// router.put("/", function (req, res, next) {
//   console.log(req.body.newsid)
//   let sqlKey = `update member set 
//     email='${req.body.email}', 
//     password='${req.body.password}', 
//     member_name='${req.body.member_name}',  
//     member_phone='${req.body.member_phone}',  
//     birthday='${req.body.birthday}', 
//     member_sex='${req.body.member_sex}',
//     member_id='${req.body.member_id}',
//     member_aboutme='${req.body.member_aboutme}' where newsid='${req.body.newsid}'`;
// conn.query(sqlKey,[], function (err, rows) {
//   if(err){
//       console.log(err);
//   }
//       res.send(JSON.stringify(rows));
//       });
  
// });

// router.put("/:id", function (req, res, next) {
//   console.log(req.body.id)

//   // let sqlKey = `update member set 
//   // email='${req.body.email}', password='${req.body.password}' where id='${id}'`;
//   let sqlKey = `update member set 
//     email='${req.body.email}', 
//     password='${req.body.password}', 
//     member_name='${req.body.member_name}',  
//     member_phone='${req.body.member_phone}',  
//     birthday='${req.body.birthday}', 
//     member_sex='${req.body.member_sex}',
//     member_id='${req.body.member_id}',
//     member_aboutme='${req.body.member_aboutme}' where newsid='${req.body.newsid}'`;
// conn.query(sqlKey,[], function (err, rows) {
//   if(err){
//       console.log(err);
//   }
//       res.send(JSON.stringify(rows));
//       });
  
// });

module.exports = router;
