var mysql = require('mysql');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "19960807",
    database: "finalproject",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE daysCategory(id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, daysCategory VARCHAR(60) NOT NULL)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("daysCategory Table created");
  });
});