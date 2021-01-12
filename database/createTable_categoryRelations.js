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
  var sql = "CREATE TABLE categoryRelations(id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,travelBuddies_id INT(6) NOT NULL REFERENCES travelBuddies(id) ON DELETE CASCADE,regionCategory_id INT(6) NOT NULL REFERENCES regionCategory(id) ON DELETE CASCADE,cityCategory_id INT(6) NOT NULL REFERENCES cityCategoru(id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("categoryRelations Table created");
  });
});