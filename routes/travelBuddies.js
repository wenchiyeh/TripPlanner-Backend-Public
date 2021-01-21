var express = require("express");
var router = express.Router();

var mysql = require('mysql');
var moment = require('moment') 

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

//所有揪團資料
router.get("/", function (req, res, next) {
    let sql ="SELECT travelbuddies.id, member.member_name AS tb_owner, member.member_photo_id AS tb_memberphoto, travelbuddies.themeName AS tb_themeName, travelbuddies.themePhoto AS tb_themePhoto,travelbuddies.personsNeeded AS tb_personsNeeded, travelbuddies.genderNeeded AS tb_genderNeeded, travelbuddies.estimatedCost AS tb_estimatedCost, travelbuddies.lastApprovedDate AS tb_lastApprovedDate, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, daysCategory.daysCategory AS tb_daysCategory, GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS tb_region ,GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS tb_city,  travelBuddies.themeintro AS tb_themeIntro FROM travelbuddies JOIN member ON travelbuddies.owner_id=member.newsId JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;"
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});


// router.get("/membersselect", function (req, res, next) {
//     let sql = "SELECT memberssignedup.membersStatus AS membersStatus, memberssignedup.members_id AS memberSignedUpId,member.member_photo_id AS memberPhoto, member.member_name AS memberName FROM memberssignedup JOIN member ON memberssignedup.members_id=member.newsId JOIN travelBuddies ON memberssignedup.travelBuddies_id =travelBuddies.id WHERE travelBuddies.owner_id=1"       
//     conn.query(sql,[],function(err, rows) {
//         if(err){
//             console.log(err);
//         }
//         res.send(JSON.stringify(rows));
//             });
//         });

  //把報名揪團者叫出來      
router.get("/membersselect/:id", function (req, res, next) {
    let tb_id = req.params.id
    let sql = "SELECT memberssignedup.membersStatus AS membersStatus, memberssignedup.members_id AS memberSignedUpId,member.member_photo_id AS memberPhoto, member.member_name AS memberName FROM memberssignedup JOIN member ON memberssignedup.members_id=member.newsId JOIN travelBuddies ON memberssignedup.travelBuddies_id =travelBuddies.id WHERE travelBuddies.owner_id=1 AND travelBuddies_id=?"       
    conn.query(sql,[tb_id],function(err, rows) {
        if(err){
            console.log(err);
        }
        res.send(JSON.stringify(rows));
            });
        });
  


//選擇成員用的更新api、未完成
router.put("/membersselect/:id", function (req, res, next) {
            let tb_id = req.params.id
            let membersSelect=req.body.tbSelect
            let sql = "UPDATE memberssignedup SET membersStatus = ? JOIN member ON memberssignedup.members_id=member.newsId WHERE member=? AND travelbuddies_id = ?"       
            conn.query(sql,["參與中",],function(err, rows) {
                if(err){
                    console.log(err);
                }
                res.send(JSON.stringify(rows));
                    });
                });


//把參加揪團者叫出來評分
router.get("/memberjoined/:id", function (req, res, next) {
    let tb_id = req.params.id
    let sql = "SELECT memberssignedup.membersStatus AS membersStatus, memberssignedup.members_id AS memberId, member.member_name AS memberName FROM memberssignedup JOIN member ON memberssignedup.members_id=member.newsId JOIN travelBuddies ON memberssignedup.travelBuddies_id =travelBuddies.id WHERE travelBuddies_id=? AND memberssignedup.membersStatus='參與中'"       
    conn.query(sql,[tb_id],function(err, rows) {
        if(err){
            console.log(err);
        }
        res.send(JSON.stringify(rows));
            });
        });                      

// router.post("/startrating", function (req,res,next){
//     let sql "INSERT INTO tbstarrating SET travelBuddies_id = ?, member_id=?"
// })                

// 選擇揪團資料by每一筆                
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


//新增揪團
router.post("/", function (req, res, next) {
    let sql1="INSERT INTO travelbuddies SET themeName = ?, owner_id = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personsNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ?, valid = ? "
    let sql2="SELECT cityCategory.regionCategory_id FROM cityCategory WHERE cityCategory.id= ?"
    let sql3="INSERT INTO categoryRelations SET travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = ?"
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
        console.log(tbCityCategory)
        if(err){
            console.log(err)
        }
        var query = conn.query(sql1,[tbThemeName, 1, tbThemePhoto, tbDateBegin, tbDateEnd,tbDaysCategory, tbLastApprovedDate, tbPersonsNeeded,tbGenderNeeded,tbEstimatedCost,tbThemeIntro,1],function(err, result) {
            console.log(query.sql)
            if (err) { 
              conn.rollback(function() {
                console.log(err)
              });
            }
            const tb_id = result.insertId;
            for(let i in tbCityCategory) {
                let city = tbCityCategory[i]
                console.log("city:" + city)
                let query2 = conn.query(sql2, city, function(err2, result2) {
                    console.log(query2.sql)
                    if (err) { 
                      conn.rollback(function() {
                        console.log(err)
                      });
                    }
                    // let region=result
                    let region = 0
                    if(result2.length > 0) {
                        region = result2[0].regionCategory_id
                    }
                    var query3 = conn.query(sql3, [tb_id ,region,city], function(err, result) {
                          console.log(query3.sql)
                        if (err) { 
                          conn.rollback(function() {
                            console.log(err)
                          });
                        }  
                    }); 
                  });
            }
              
            conn.commit(function(err) {
                if (err) { 
                  conn.rollback(function() {
                      console.log(err)
                  });
                }
                console.log('Transaction Completed Successfully.');
              });
            });
          });
    res.send('{"message":"已新增"}')   
})

//更新揪團
router.put("/:id", function (req, res, next) {
    let id=req.params.id
    let sql1="UPDATE travelbuddies SET themeName = ?, owner_id = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ?, valid = ? "
    let sql2="DELETE FROM categoryRelations where travelBuddies_id=1"
    let sql3="SELECT cityCategory.regionCategory_id FROM cityCategory WHERE cityCategory.id= ?"
    let sql4="INSERT INTO categoryRelations travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = ? "
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
            }else{
                console.log("sql1 ok")
            }
            conn.query(sql2,[],function(err,result){
                if (err) { 
                    conn.rollback(function() {
                      console.log(err)
                    });
                  }else{
                      console.log("sql2 ok")
                  } 
            }) 
            tbCityCategory.foreach(function addCategory(city){
                conn.query(sql3, city, function(err, result) {
                    if (err) { 
                      conn.rollback(function() {
                        console.log(err)
                      });
                    }
                    let region=result
                      conn.query(sql4, [id,region,city], function(err, result) {
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
    res.send('{"message":"已更新"}')   
})



//刪除揪團，目前確定mine可以用
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
                  });
                });
              });
            });
    res.send('{"message":"已刪除"}')
})

//取消參加的揪團，從上面那隻改
router.delete("/tbjoined/:id", function (req, res, next) {
    let tb_id = req.params.id
    let sql1="DELETE FROM memberssignedup WHERE travelBuddies_id= ? "
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
                conn.commit(function(err) {
                    if (err) { 
                      conn.rollback(function() {
                          console.log(err)
                      });
                    }
                    console.log('Transaction Completed Successfully.');
                });
              });
            });
    res.send('{"message":"已取消參加"}')
})

//報名揪團，這隻可用
router.post("/tbsignedup", function (req, res, next) {
    let id = req.body.id
    let time = moment(new Date()).format('YYYY-MM-DD')
    console.log(time);
    let sql = `INSERT INTO memberssignedup (travelBuddies_id, members_id, membersStatus, signedUpTime) VALUES ('${id}',1,'審核中','${time}')`
    conn.query(sql,[], function (err, rows) {
        if(err){
            console.log(err);
        }
            res.send('{"message":"已報名"}');
            });
        });

//取消報名揪團，半成品
router.delete("/tbdropout/:id", function (req, res, next) {
    let id = req.params.id
    let sql = `DELETE FROM memberssignedup WHERE travelBuddies_id = ? AND members_id =1`
    conn.query(sql,[id], function (err, rows) {
        if(err){
            console.log(err);
        }
            res.send('{"message":"已取消報名"}');
            });
        });        

router.put("/tbsignedup", function (req, res, next) {
            let sql = "UPDATE memberssignedup SET membersStatus=? WHERE travelBuddies_id=?"
            conn.query(sql,["參與中",1], function (err, rows) {
                if(err){
                    console.log(err);
                }
                    res.send('{"message":"已報名"}');
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