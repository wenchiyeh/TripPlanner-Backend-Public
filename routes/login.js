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
  //驗證用戶是否存在
  let sqlKey = `select * from member where email='${req.body.email}' and password='${req.body.password}'`;
  //這樣寫才對
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log('/',obj);
  
  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      result.status = "登入失敗。"
      result.err = "伺服器錯誤，請稍後在試！"
      return;
    }
    if(rows.length > 0){
      const id = (rows[0].newsId)
      console.log('id',id);
      let returnData = {result : true, member : id}
      res.send(JSON.stringify(rows[0]));
    }else{
      res.send(JSON.stringify({result : false}));
    }
  });
});

router.post("/:id", function (req, res, next) {
  //驗證用戶是否存在
  let sqlKey = `select * from member where email='${req.params.email}' and password='${req.params.password}'`;
  //這樣寫才對
  const obj = JSON.parse(JSON.stringify(req.params)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log('/:id',obj);
  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      result.status = "登入失敗。"
      result.err = "伺服器錯誤，請稍後在試！"
      return;
    }
    if(rows.length > 0){
      console.log('rows',rows[0].newsId);
      let returnData = {result : true, member : rows[0].newsId}
      res.send(JSON.stringify(returnData));
    }
    else{
      res.send(JSON.stringify({result : false}));
    }
  });
});

module.exports = router;
