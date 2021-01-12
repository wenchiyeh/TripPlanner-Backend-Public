var express = require("express");
var router = express.Router();

var mysql = require('mysql');

var conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "19960807",
    database: "finalproject",
});

conn.connect(function(err){
    if(err){
        console.log(err);
    }
    console.log("ok")
})

router.get("/tbmine", function (req, res, next) {
    let sql ="SELECT travelbuddies.id AS tb_id, travelbuddies.themeName AS tb_themeName, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id WHERE travelbuddies.owner_id = 1 AND travelbuddies.dateEnd>=NOW() GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});

router.delete("/tbmine", function (req, res, next) {
    let sql1="DELETE FROM travelbuddies WHERE id=1 "
    let sql2="DELETE FROM categoryrelations WHERE travelBuddies_id=1"
    conn.beginTransaction
    res.send("已連線")
    
})

router.get("/tbjoined", function (req, res, next) {
    let sql ="SELECT travelbuddies.id AS tb_id, travelbuddies.themeName AS tb_themeName, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, memberssignedup.membersStatus AS tb_membersStatus FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id JOIN memberssignedup ON travelbuddies.id=memberssignedup.travelBuddies_id WHERE memberssignedup.members_id = 1 AND travelbuddies.dateEnd>NOW() GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
})
router.get("/tbhistory", function (req, res, next) {
    let sql ="SELECT travelbuddies.id AS tb_id, travelbuddies.themeName AS tb_themeName, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id JOIN memberssignedup ON travelbuddies.id=memberssignedup.travelBuddies_id WHERE travelbuddies.owner_id = 1 AND travelbuddies.dateEnd<NOW() UNION SELECT travelbuddies.id AS tb_id, travelbuddies.themeName AS tb_themeName, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id JOIN memberssignedup ON travelbuddies.id=memberssignedup.travelBuddies_id WHERE memberssignedup.members_id = 1 AND travelbuddies.dateEnd<NOW() GROUP BY tb_themeName ORDER BY tb_id;"
    conn.query(sql,[], function (err, rows) {
        if(err){
            console.log(err);
        }
            res.send(JSON.stringify(rows));
            });
})

module.exports = router;