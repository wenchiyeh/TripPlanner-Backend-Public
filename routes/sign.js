var express = require("express");
var router = express.Router();
//使用環境參數
require("dotenv").config();
//註冊功能
router.post('/sign', function(req, res){
    var conn = mysql.createConnection({
        host: process.env["dbhost"],
        user: process.env["dbuser"],
        password: process.env["dbpassword"],
        database: process.env["database"],
      });
    var newmember = new conn({
        email:req.body.email,
        password:req.body.password,
    });
    conn.count({email:req.body.email},function(err, data){
        if(data > 0){
            res.json({"status":1, "msg":"帳號已被註冊!"});
        }
        else{
            newmember.save(function(err,data){
                if(err){
                    res.json({"status":1, "msg":"error!"})
                }
                else{
                    res.json({"status":0, "msg":"success","data":data});
                }
            })
        }
    })
})
module.exports = router;
