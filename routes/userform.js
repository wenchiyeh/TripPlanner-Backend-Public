var express = require(`express`);
var router = express.Router();

var mysql = require("mysql");

var conn = mysql.createConnection({
  host: process.env["dbhost"],
  user: process.env["dbuser"],
  password: process.env["dbpassword"],
  database: process.env["database"],
});

conn.connect(function (err) {
  if (err) {
    console.log(err);
  }
});
router.get(`/`, function (req, res, next) {
  let productId = req.params.id;
  let sql = `SELECT member.* from member`;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});