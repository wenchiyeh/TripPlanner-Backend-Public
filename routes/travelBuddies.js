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

router.get("/", function (req, res, next) {
    let sql ="SELECT travelbuddies.id, member.member_name AS tb_owner, member.member_photo_id AS tb_memberphoto, travelbuddies.themeName AS tb_themeName, travelbuddies.themePhoto AS tb_themePhoto,travelbuddies.personsNeeded AS tb_personsNeeded, travelbuddies.genderNeeded AS tb_genderNeeded, travelbuddies.estimatedCost AS tb_estimatedCost, travelbuddies.lastApprovedDate AS tb_lastApprovedDate, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, daysCategory.daysCategory AS tb_daysCategory, GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS tb_region ,GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS tb_city,  travelBuddies.themeintro AS tb_themeIntro FROM travelbuddies JOIN member ON travelbuddies.owner_id=member.newsId JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});
//上面這隻ok

router.get("/:id", function (req, res, next) {
    let tb_id = req.params.id
    let sql ="SELECT travelbuddies.id, member.member_name AS tb_owner, member.member_photo_id AS tb_memberphoto,travelbuddies.themeName AS tb_themeName, travelbuddies.themePhoto AS tb_themePhoto,travelbuddies.personsNeeded AS tb_personsNeeded, travelbuddies.genderNeeded AS tb_genderNeeded, travelbuddies.estimatedCost AS tb_estimatedCost, travelbuddies.lastApprovedDate AS tb_lastApprovedDate, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, daysCategory.daysCategory AS tb_daysCategory, GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS tb_region ,GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS tb_city,  travelBuddies.themeintro AS tb_themeIntro FROM travelbuddies JOIN member ON travelbuddies.owner_id=member.newsId JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id WHERE travelbuddies.id=? GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,tb_id, function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});
//上面這隻ok


router.post("/", function (req, res, next) {
    let sql1="INSERT INTO travelbuddies themeName = ?, owner_id = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ?, valid = ? "
    let sql2="SELECT cityCategory.regionCategory_id FROM cityCategory WHERE cityCategory.id= ?"
    let sql3="INSERT INTO categoryRelations travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = "
    conn.beginTransaction(function(err){
        let tbThemeName=req.body.tbThemeName
        let tbThemePhoto=req.body.tbThemePhoto
        let tbDateBegin=req.body.tbDateBegin
        let tbDateEnd=req.body.tbDateEnd
        let tbDaysCategory=req.body.tbDaysCategory
        let tbLastApprovedDate=req.body.tbLastApprovedDate
        let tbPersonsNeeded=req.body.tbPersonsNeeded
        let tbGenderNeeded= req.body.tbGenderNeeded
        let tbEstimatedCost=req.body.tbEstimatedCost
        let tbThemeIntro=req.body.tbThemeIntro
        let tbCityCategory=req.body.tbCityCategory
        if(err){
            console.log(err)
        }
        conn.query(sql1,[tbThemeName, 1, tbThemePhoto, tbDateBegin, tbDateEnd,tbDaysCategory, tbLastApprovedDate, tbPersonsNeeded,tbGenderNeeded,tbEstimatedCost,tbThemeIntro,1],function(err, result) {
            if (err) { 
              conn.rollback(function() {
                console.log(err)
              });
            }
            const log = result.insertId;
            tbCityCategory.foreach(function addCategory(city){
            conn.query(sql2, city, function(err, result) {
                if (err) { 
                  conn.rollback(function() {
                    console.log(err)
                  });
                }
                let region=result
                  conn.query(sql3, [log,region,city], function(err, result) {
                    if (err) { 
                      conn.rollback(function() {
                        console.log(err)
                      });
                    }  
                }); 
              });})//後面這兩個括號是forEach的 前面兩個是SQL2的
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
    res.send("inserted!")   
})

// router.post("/", function (req, res, next) {
//     let sql1="INSERT INTO travelbuddies themeName = ?, owner_id = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ?, valid = ? "
//     let sql2="SELECT cityCategory.regionCategory_id FROM cityCategory WHERE cityCategory.id= ?"
//     let sql3="INSERT INTO categoryRelations travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = "
//     conn.beginTransaction(function(err){
//         let tbThemeName=req.body.tbThemeName
//         let tbThemePhoto=req.body.tbThemePhoto
//         let tbDateBegin=req.body.tbDateBegin
//         let tbDateEnd=req.body.tbDateEnd
//         let tbDaysCategory=req.body.tbDaysCategory
//         let tbLastApprovedDate=req.body.tbLastApprovedDate
//         let tbPersonsNeeded=req.body.tbPersonsNeeded
//         let tbGenderNeeded= req.body.tbGenderNeeded
//         let tbEstimatedCost=req.body.tbEstimatedCost
//         let tbThemeIntro=req.body.tbThemeIntro
//         let tbCityCategory=req.body.tbCityCategory
//         if(err){
//             console.log(err)
//         }
//         conn.query(sql1,[tbThemeName, 1, tbThemePhoto, tbDateBegin, tbDateEnd,tbDaysCategory, tbLastApprovedDate, tbPersonsNeeded,tbGenderNeeded,tbEstimatedCost,tbThemeIntro,1],function(err, result) {
//             if (err) { 
//               conn.rollback(function() {
//                 console.log(err)
//               });
//             }else{
//                 console.log("sql1 ok")
//             }
//             const log = result.insertId;
//             tbCityCategory.foreach()   
//             conn.query(sql2, [log,], function(err, result) {
//                 if (err) { 
//                   conn.rollback(function() {
//                     console.log(err)
//                   });
//                 }  
//                 conn.commit(function(err) {
//                   if (err) { 
//                     conn.rollback(function() {
//                         console.log(err)
//                     });
//                   }else{
//                       console.log("sql2 ok")
//                   }
                  
//                   conn.query(sql3, [log,], function(err, result) {
//                     if (err) { 
//                       conn.rollback(function() {
//                         console.log(err)
//                       });
//                     }  
//                     conn.commit(function(err) {
//                       if (err) { 
//                         conn.rollback(function() {
//                             console.log(err)
//                         });
//                       }
//                       console.log('Transaction Completed Successfully.');
//                       connection.end();
//                     });
//                 });
//                 });
//               });
//             });
//           });
//     res.send("inserted!")   
// })

router.put("/:id", function (req, res, next) {
    let sql1="UPDATE travelbuddies themeName = ?, owner_id = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ?, valid = ? "
    let sql2="INSERT INTO categoryRelations travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = "
    conn.beginTransaction
    res.send("已連線")
    
})


router.delete("/:id", function (req, res, next) {
    let tb_id = req.params.id
    let sql1="DELETE FROM travelbuddies WHERE id= ? "
    let sql2="DELETE FROM categoryrelations WHERE travelBuddies_id= ?"
    conn.beginTransaction(function(err){
        if(err){
            console.log(err)
        }
        conn.query(sql1,tb_id,function(err, result) {
            if (err) { 
              conn.rollback(function() {
                console.log(err)
              });
            }
            conn.query(sql2,tb_id,function(err, result) {
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
                    conn.end();
                  });
                });
              });
            });
    res.send("已刪除")
})
//上面這隻ok

router.post("/tbsignedup:id", function (req, res, next) {
    let tb_id = req.params.id
    let time = GetDate()
    let sql = "INSERT INTO memberssignedup travelBuddies_id=?, members_id=?, membersStatus=? SignedUpTime=?"
    conn.query(sql,[tb_id,1,"審核中", time], function (err, rows) {
        if(err){
            console.log(err);
        }
            res.send("ok!");
            });
        });

router.put("/tbsignedup", function (req, res, next) {
            let sql = "UPDATE memberssignedup SET membersStatus=? WHERE travelBuddies_id=?"
            conn.query(sql,["參與中",1], function (err, rows) {
                if(err){
                    console.log(err);
                }
                    res.send("ok!");
                    });
                });

router.delete("/tbsignedup:id", function (req, res, next) {
    let tb_id = req.params.id
    let sql = "DELETE FROM memberssignedup travelBuddies_id=? AND members_id=?"
    conn.query(sql,[tb_id,1], function (err, rows) {
        if(err){
            console.log(err);
        }
            res.send("Deleted!");
            });
        });

        router.get("/tbmembersselect", function (req, res, next) {
            let sql = "SELECT member.member_photo_id AS memberPhoto, member.member_name AS memberName FROM memberssingedup JOIN member ON memberssingedup.members_id=member.id WHERE travelBuddies_id=1"       
            conn.query(sql,[],function(err, rows) {
                if(err){
                    console.log(err);
                }
                    res.send("readtbmembersselect");
                    });
                });


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