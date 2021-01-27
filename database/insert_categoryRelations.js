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
    var sql = "INSERT INTO categoryRelations(travelBuddies_id, regionCategory_id, cityCategory_id) VALUES ?";
    var values = [
      [1,1,1],[2,1,2],[2,1,3],[3,1,4],[3,1,5],[3,2,6],[4,3,12],[4,3,13],[5,4,16],[5,4,17],[5,5,21],[5,5,22],
      [6,3,14],[7,3,13],[8,5,18],[9,1,1],[10,1,3],
      [11,2,7],[12,3,14],[12,4,17],[13,4,15],[13,4,16],[14,5,18],[14,5,19],[15,1,1],[15,1,2],[15,1,3],
      [16,2,8],[16,2,9],[16,2,10],[16,3,11],[17,4,17],[18,3,11],[19,3,13],[19,5,23],[20,1,5],
      [21,5,18],[22,1,4],[23,2,9],[24,3,11],[25,1,2],[25,3,14]
    ];
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });