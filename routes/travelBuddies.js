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
})

router.get("/", function (req, res, next) {
    let sql ="SELECT travelbuddies.owner_id AS tb_owner, travelbuddies.themeName AS tb_themeName, travelbuddies.personsNeeded AS tb_personsNeeded, travelbuddies.genderNeeded AS tb_genderNeeded, travelbuddies.estimatedCost AS tb_estimatedCost, travelbuddies.lastApprovedDate AS tb_lastApprovedDate, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, daysCategory.daysCategory AS tb_daysCategory, GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS tb_region ,GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS tb_city,  travelBuddies.themeintro AS tb_themeintro FROM travelbuddies JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id WHERE travelbuddies.owner_id = 1 GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});

router.get("/get", function (req, res, next) {
    res.send("已連線")
    
})

module.exports = router;

// SELECT schedules.scheduleName AS schedule_name, GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS schedule_region,GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS schedule_city,schedules.id AS schedule_id, schedules.*, cityCategory.*, regionCategory.*,member.name AS member_name,daysCategory.daysOfSchedule AS daysCategoryOfSchedule, visibility.visibilityDescription AS status0fVisibility FROM schedules
//             JOIN categoryRelations ON categoryRelations.schedules_id=schedules.id
//             JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id
//             JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id
//             JOIN member ON schedules.membership_id=member.id
//             JOIN daysCategory ON schedules.daysCategory_id=daysCategory.id 
//             JOIN visibility ON schedules.visibility_id=visibility.id 
//             WHERE schedules.valid=1 AND (scheduleName LIKE '%$keyword%' OR scheduleIntro LIKE '%$keyword%')
//             GROUP BY schedules.scheduleName
//             ORDER BY schedules.id
//             LIMIT $start,$item_per_page