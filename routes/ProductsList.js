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
    let sql  = `SELECT products.*,
    teacher.name as teacher_name,
    teacher.title as teacher_title,
    teacher.photo as teacher_photo,
    teacher.history as teacher_history
    from products
    join teacher on products.teacher_id = teacher.id
 ORDER BY products.id
   `
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});
router.get(`/:id`, function (req, res, next) {
  let productId = req.params.id;
    let sql  = `SELECT products.*,
    teacher.name as teacher_name,
    teacher.title as teacher_title,
    teacher.photo as teacher_photo,
    teacher.history as teacher_history
    from products
    join teacher on products.teacher_id = teacher.id
    where products.id = ${productId}
   `
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});


router.get(`/car1/:id`, function (req, res, next) {
  let productId = req.params.id;
  console.log("hi");
  let sql = `SELECT products.className
    from products
    where products.id = ${productId}
   `;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});


module.exports  =  router;
