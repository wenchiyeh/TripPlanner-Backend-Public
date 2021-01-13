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
})

router.post("/", function (req, res, next) {
    let sql ="SELECT travelbuddies.id, member.member_name AS tb_owner, travelbuddies.themeName AS tb_themeName, travelbuddies.personsNeeded AS tb_personsNeeded, travelbuddies.genderNeeded AS tb_genderNeeded, travelbuddies.estimatedCost AS tb_estimatedCost, travelbuddies.lastApprovedDate AS tb_lastApprovedDate, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, daysCategory.daysCategory AS tb_daysCategory, GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS tb_region ,GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS tb_city,  travelBuddies.themeintro AS tb_themeIntro FROM travelbuddies JOIN member ON travelbuddies.owner_id=member.newsId JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id WHERE travelbuddies.id = 19 GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});


router.post("/create", function (req, res, next) {
    let sql1="INSERT INTO travelbuddies themeName = ?, owner_id = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ?, valid = ? "
    let sql2="INSERT INTO categoryRelations travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = "
    conn.beginTransaction(function(err){
        if(err){
            console.log(err)
        }
        conn.query(sql1,[req.body.tbThemeName, 1, req.body.tbThemePhoto, req.body.tbDateBegin, req.body.tbDateEnd, req.body.tbDaysCategory, req.body.tbLastApprovedDate, req.body.tbPersonsNeeded,req.body.tbGenderNeeded,req.body.tbEstimatedCost,req.body.tbThemeIntro,1],function(err, result) {
            if (err) { 
              conn.rollback(function() {
                console.log(err)
              });
            }else{
                console.log("sql1 ok")
            }
            const log = result.insertId;

            req.body.tbCityCategory.foreach();
            
            let sql3 = "SELECT cityCategory.regionCategory_id FROM cityCategory WHERE cityCategory.id="
            // 取出陣列部分尚未完成
            conn.query(sql2, [log,], function(err, result) {
                if (err) { 
                  conn.rollback(function() {
                    console.log(err)
                  });
                }  
                conn.commit(function(err) {
                  if (err) { 
                    conn.rollback(function() {
                        console.log(err)
                    });
                  }
                  console.log('Transaction Completed Successfully.');
                  connection.end();
                });
              });
            });
          });
    res.send("inserted!")   
})

router.put("/update", function (req, res, next) {
    let sql1=" travelbuddies themeName = ?, owner_id = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ?, valid = ? "
    let sql2="INSERT INTO categoryRelations travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = "
    conn.beginTransaction
    res.send("已連線")
    
})


router.delete("/hahaha", function (req, res, next) {
    let sql1="DELETE FROM travelbuddies WHERE id=20 "
    let sql2="DELETE FROM categoryrelations WHERE travelBuddies_id=20"
    conn.beginTransaction(function(err){
        if(err){
            console.log(err)
        }
        conn.query(sql1,[],function(err, result) {
            if (err) { 
              conn.rollback(function() {
                console.log(err)
              });
            }
            conn.query(sql2,[],function(err, result) {
                if (err) { 
                  conn.rollback(function() {
                    console.log(err)
                  });
                }
                conn.commit(function(err) {
                    if (err) { 
                      conn.rollback(function() {
                          console.log(err)
                      });
                    }
                    console.log('Transaction Completed Successfully.');
                    connection.end();
                  });
                });
              });
            });
    res.send("已刪除")
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