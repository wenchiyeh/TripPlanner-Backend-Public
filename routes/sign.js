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
    let sqlKey = `insert into member 
    set email='${req.body.email}', password='${req.body.password}'`;
    conn.query(sqlKey, [], function (err, rows) {
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }
      if(rows.length > 0){
        console.log(rows[0].newsId);
        let returnData = {result : false, member : rows[0].newsId}
        res.send(JSON.stringify(returnData));
      }else{
        res.send(JSON.stringify({result : true}));
      }
    });
  });

// router.post('/sign', function(req, res){
//     var newmember = new conn({
//         email:req.body.email,
//         password:req.body.password,
//     });
//     conn.count({email:req.body.email},function(err, data){
//         if(data > 0){
//             res.json({"status":1, "msg":"帳號已被註冊!"});
//         }
//         else{
//             newmember.save(function(err,data){
//                 if(err){
//                     res.json({"status":1, "msg":"error!"})
//                 }
//                 else{
//                     res.json({"status":0, "msg":"success","data":data});
//                 }
//             })
//         }
//     })
// })
module.exports = router;
