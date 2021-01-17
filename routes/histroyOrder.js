var express  =  require(`express`);
var router  =  express.Router();

var mysql  =  require('mysql');

var conn  =  mysql.createConnection({
   host: process.env["dbhost"],
  user: process.env["dbuser"],
  password: process.env["dbpassword"],
  database: process.env["database"],
});

conn.connect(function(err){
    if(err){
        console.log(err);
    }
})

router.get(`/`, function (req, res, next) {
    let sql  = `SELECT orderhistory.*,
    member.member_name as user_Name,
    member.birthday as user_birthday,
    member.email as user_mail,
    member.member_sex as gender,
    member.member_phone as user_phone,
    products.className as class_Name
    from orderhistory
    join member on orderhistory.userId = member.newsId
    join products on orderhistory.productID = products.id
    ORDER BY orderhistory.id DESC
   `
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});
router.get(`/:id`, function (req, res, next) {
     let orderId = req.params.id;
    let sql  = `SELECT orderhistory.*,
    member.member_name as user_Name,
    member.birthday as user_birthday,
    member.email as user_mail,
    member.member_sex as gender,
    member.member_phone as user_phone,
    products.className as class_Name
    from orderhistory
    join member on orderhistory.userId = member.newsId
    join products on orderhistory.productID = products.id
    where orderhistory.id = ${orderId}
    ORDER BY orderhistory.id DESC
   `
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});

router.post("/gohistory", function (req, res, next) {
  console.log(req.body);
  let sqlKey = `insert into orderhistory(user_name,gender,phone,mail,birthday,\ticket_type,price,) value=(${req.body.email})`;
  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    if (rows.length >= 1) {
      console.log(rows[0].newsId);
      let returnData = { result: true, member: rows[0].newsId };
      res.send(JSON.stringify(returnData));
    } else {
      res.send(JSON.stringify({ result: false }));
    }
  });
});






module.exports  =  router;
