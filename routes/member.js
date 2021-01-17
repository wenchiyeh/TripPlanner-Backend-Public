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
  let { id: newsId = "*"} = req.body
  //驗證用戶是否存在
  let sqlKey = `select * from member where email='${req.body.email}' and password='${req.body.password}' and valid =1`;
  //這樣寫才對
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log('obj/',obj);
  console.log('我是id',id);
  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      console.log('錯誤!');
      return;
    }
    if(rows.length > 0){
      console.log('/',rows[0].newsId);
      let returnData = {result : true, member : rows[0].newsId}
      res.send(JSON.stringify(returnData));
      console.log('有資料', returnData);
    }else{
      res.send(JSON.stringify({result : false}));
    }
  });
});

router.get("/:id", function (req, res, next) {

  let { id: newsId = "*"} = req.params
  //驗證用戶是否存在
  let sqlKey = `select * from member where newsId=${newsId} and valid=1`;
  //這樣寫才對
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log('/:id',req.params, obj);
  
  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      console.log('錯誤!');
      return;
    }
    if(rows.length > 0){
      console.log('result', rows);
      let returnData = {result : true, member : rows}
      res.send(JSON.stringify(returnData));
      console.log('有資料', returnData);
    }else{
      res.send(JSON.stringify({result : false}));
    }
    console.log('log:',newsId);
  });
  //console.log(newsId);
});

// 更新會員資料
router.put("/update", function (req, res, next) {
  console.log(req.body.newsId)
  let sqlKey = `update member set 
    email='${req.body.email}', 
    password='${req.body.password}', 
    member_name='${req.body.member_name}',  
    member_phone='${req.body.member_phone}',  
    birthday='${req.body.birthday}', 
    member_sex='${req.body.member_sex}',
    member_id='${req.body.member_id}',
    member_aboutme='${req.body.member_aboutme}' where newsid='${req.body.newsId}'`;
conn.query(sqlKey,[], function (err, rows) {
  if(err){
      console.log(err);
  }
      res.send(JSON.stringify(rows));
      });
  
});

// router.put("/:id", function (req, res, next) {
//   console.log(req.body.newsId)

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
//     member_aboutme='${req.body.member_aboutme}' where newsid='${req.body.newsId}'`;
// conn.query(sqlKey,[], function (err, rows) {
//   if(err){
//       console.log(err);
//   }
//       res.send(JSON.stringify(rows));
//       });
  
// });

module.exports = router;
