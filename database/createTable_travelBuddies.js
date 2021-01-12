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
  var sql = "CREATE TABLE travelBuddies(id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, themeName VARCHAR(60) NOT NULL, owner_id INT(6) NOT NULL, themePhoto VARCHAR(60) NOT NULL, dateBegin DATE NOT NULL, dateEnd DATE NOT NULL, daysCategory_id INT(6) NOT NULL, lastApprovedDate DATE NOT NULL, personsNeeded INT(6) NOT NULL, genderNeeded VARCHAR(60) NOT NULL, estimatedCost INT(6) NOT NULL, themeIntro VARCHAR(600) NOT NULL, valid INT(6) NOT NULL, create_time TIMESTAMP)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});