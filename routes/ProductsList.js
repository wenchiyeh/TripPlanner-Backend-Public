var express = require(`express`);
var router = express.Router();
var mysql = require("mysql");
var conn = require("../dbConnect");



router.get("/product_carousel", function (req, res, next) {
  let sql =
    "SELECT products.id, products.classPhoto AS classPhoto, products.className AS className FROM products ORDER BY products.id DESC LIMIT 5;";
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});


router.get(`/:id`, function (req, res, next) {
  let productId = req.params.id;
  let sql = `SELECT products.*,
    teacher.name as teacher_name,
    teacher.title as teacher_title,
    teacher.photo as teacher_photo,
    teacher.history as teacher_history
    from products
    join teacher on products.teacher_id = teacher.id
    where products.id = ${productId}
   `;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

router.get(`/car1/:id`, function (req, res, next) {
  let productId = req.params.id;
  let sql = `SELECT products.*
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

router.get(`/`, function (req, res, next) {
  
  let sql = `SELECT products.*,
  teacher.name as teacher_name,
  teacher.title as teacher_title,
  teacher.photo as teacher_photo,
  teacher.history as teacher_history
  from products
  join teacher on products.teacher_id = teacher.id
  ORDER BY products.id
   `;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});




module.exports = router;
