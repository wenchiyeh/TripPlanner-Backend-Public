var express = require("express");
var router = express.Router();

var mysql = require('mysql');

var conn = mysql.createConnection({
    host: process.env["dbhost"],
      user: process.env["dbuser"],
      password: process.env["dbpassword"],
      database: process.env["database"],
});

conn.connect(function(err){
    if(err){
        console.log(err);
    }
    console.log("ok")
})

router.get("/tbmine", function (req, res, next) {
    let sql ="SELECT travelbuddies.id, travelbuddies.themeName AS tb_themeName, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id WHERE travelbuddies.owner_id = 1 AND travelbuddies.dateEnd>=NOW() GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});


router.get("/tbjoined", function (req, res, next) {
    let sql ="SELECT travelbuddies.id, travelbuddies.themeName AS tb_themeName, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, memberssignedup.membersStatus AS tb_membersStatus FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id JOIN memberssignedup ON travelbuddies.id=memberssignedup.travelBuddies_id WHERE memberssignedup.members_id = 1 AND travelbuddies.dateEnd>NOW() GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
})
router.get("/tbhistory", function (req, res, next) {
    let sql ="SELECT travelbuddies.id, travelbuddies.owner_id AS tb_ownerId,travelbuddies.themeName AS tb_themeName, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id JOIN memberssignedup ON travelbuddies.id=memberssignedup.travelBuddies_id WHERE travelbuddies.owner_id = 1 AND travelbuddies.dateEnd<NOW() UNION SELECT travelbuddies.id AS tb_id,travelbuddies.owner_id AS tb_ownerId,travelbuddies.themeName AS tb_themeName, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id JOIN memberssignedup ON travelbuddies.id=memberssignedup.travelBuddies_id WHERE memberssignedup.members_id = 1 AND travelbuddies.dateEnd<NOW() GROUP BY tb_themeName ORDER BY id;"
    conn.query(sql,[], function (err, rows) {
        if(err){
            console.log(err);
        }
            res.send(JSON.stringify(rows));
            });
})

module.exports = router;