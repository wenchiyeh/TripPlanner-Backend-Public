var express = require("express");
var router = express.Router();

var mysql = require("mysql");
var moment = require("moment");
var conn = require("../dbConnect");

//揪團列表頁 //所有揪團資料
router.get("/", function (req, res, next) {
  let sql =
    "SELECT travelbuddies.id, member.member_name AS tb_owner, member.member_photo_id AS tb_memberphoto, travelbuddies.themeName AS tb_themeName, travelbuddies.themePhoto AS tb_themePhoto,travelbuddies.personsNeeded AS tb_personsNeeded, travelbuddies.genderNeeded AS tb_genderNeeded, travelbuddies.estimatedCost AS tb_estimatedCost, travelbuddies.lastApprovedDate AS tb_lastApprovedDate, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, daysCategory.daysCategory AS tb_daysCategory, GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS tb_region ,GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS tb_city,  travelBuddies.themeintro AS tb_themeIntro FROM travelbuddies JOIN member ON travelbuddies.owner_id=member.newsId JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;";
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

//選擇揪團資料by每一筆
router.get("/:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql =
    "SELECT travelbuddies.id, member.member_name AS tb_owner, member.member_photo_id AS tb_memberphoto,travelbuddies.themeName AS tb_themeName, travelbuddies.themePhoto AS tb_themePhoto,travelbuddies.personsNeeded AS tb_personsNeeded, travelbuddies.genderNeeded AS tb_genderNeeded, travelbuddies.estimatedCost AS tb_estimatedCost, travelbuddies.lastApprovedDate AS tb_lastApprovedDate, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, daysCategory.daysCategory AS tb_daysCategory, GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS tb_region ,GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS tb_city,  travelBuddies.themeintro AS tb_themeIntro FROM travelbuddies JOIN member ON travelbuddies.owner_id=member.newsId JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id WHERE travelbuddies.id=? GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;";
  conn.query(sql, tb_id, function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

//新增揪團
router.post("/", function (req, res, next) {
  let sql1 =
    "INSERT INTO travelbuddies SET themeName = ?, owner_id = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personsNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ?, valid = ? ";
  let sql2 =
    "SELECT cityCategory.regionCategory_id FROM cityCategory WHERE cityCategory.id= ?";
  let sql3 =
    "INSERT INTO categoryRelations SET travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = ?";
  conn.beginTransaction(function (err) {
    let tbThemeName = req.body.tbThemeName;
    let tbThemePhoto = req.body.tbThemePhoto;
    let tbDateBegin = req.body.tbDateBegin;
    let tbDateEnd = req.body.tbDateEnd;
    let tbDaysCategory = req.body.tbDaysCategory;
    let tbLastApprovedDate = req.body.tbLastApprovedDate;
    let tbPersonsNeeded = req.body.tbPersonsNeeded;
    let tbGenderNeeded = req.body.tbGenderNeeded;
    let tbEstimatedCost = req.body.tbEstimatedCost;
    let tbThemeIntro = req.body.tbThemeIntro;
    let tbCityCategory = req.body.tbCityCategory;
    console.log(tbCityCategory);
    if (err) {
      console.log(err);
    }
    var query = conn.query(
      sql1,
      [
        tbThemeName,
        1,
        tbThemePhoto,
        tbDateBegin,
        tbDateEnd,
        tbDaysCategory,
        tbLastApprovedDate,
        tbPersonsNeeded,
        tbGenderNeeded,
        tbEstimatedCost,
        tbThemeIntro,
        1,
      ],
      function (err, result) {
        console.log(query.sql);
        if (err) {
          conn.rollback(function () {
            console.log(err);
          });
        }
        const tb_id = result.insertId;
        for (let i in tbCityCategory) {
          let city = tbCityCategory[i];
          console.log("city:" + city);
          let query2 = conn.query(sql2, city, function (err2, result2) {
            console.log(query2.sql);
            if (err) {
              conn.rollback(function () {
                console.log(err);
              });
            }
            // let region=result
            let region = 0;
            if (result2.length > 0) {
              region = result2[0].regionCategory_id;
            }
            var query3 = conn.query(
              sql3,
              [tb_id, region, city],
              function (err, result) {
                console.log(query3.sql);
                if (err) {
                  conn.rollback(function () {
                    console.log(err);
                  });
                }
              }
            );
          });
        }

        conn.commit(function (err) {
          if (err) {
            conn.rollback(function () {
              console.log(err);
            });
          }
          console.log("Transaction Completed Successfully.");
        });
      }
    );
  });
  res.send('{"message":"已新增"}');
});

//我的揪團-編輯 // 選擇揪團資料by每一筆-for 編輯
router.get("/edit/:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql =
    "SELECT travelbuddies.id, member.member_name AS tb_owner, member.member_photo_id AS tb_memberphoto,travelbuddies.themeName AS tb_themeName, travelbuddies.themePhoto AS tb_themePhoto,travelbuddies.personsNeeded AS tb_personsNeeded, travelbuddies.genderNeeded AS tb_genderNeeded, travelbuddies.estimatedCost AS tb_estimatedCost, travelbuddies.lastApprovedDate AS tb_lastApprovedDate, travelbuddies.dateBegin AS tb_dateBegin , travelbuddies.dateEnd AS tb_dateEnd, travelbuddies.daysCategory_id AS tb_daysCategory, GROUP_CONCAT(DISTINCT categoryRelations.cityCategory_id ORDER BY cityCategory_id) AS tb_city,  travelBuddies.themeintro AS tb_themeIntro FROM travelbuddies JOIN member ON travelbuddies.owner_id=member.newsId JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id WHERE travelbuddies.id=? GROUP BY travelBuddies.themeName ORDER BY travelBuddies.id;";
  conn.query(sql, tb_id, function (err, rows) {
    if (err) {
      console.log(err);
    }
    // console.log(rows);
    // rows[0].tb_lastApprovedDate
    res.send(JSON.stringify(rows));
  });
});

router.put("/tbselect", function (req, res, next) {
  let tb_id = req.body.tb_id;
  let m_id = req.body.m_id;
  console.log(tb_id);
  console.log(m_id);
  let sql =
    "UPDATE memberssignedup SET membersStatus=? WHERE travelBuddies_id=? AND members_id = ?";
  conn.query(sql, ["參與中", tb_id, m_id], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send('{"message":"已報名"}');
  });
});

//更新揪團-這支ok！
router.put("/:id", function (req, res, next) {
  let id = req.params.id;
  let sql1 =
    "UPDATE travelbuddies SET themeName = ?, themePhoto = ?, dateBegin = ?, dateEnd = ?, daysCategory_id = ?, lastApprovedDate = ?, personsNeeded = ?, genderNeeded = ?, estimatedCost = ?, themeIntro = ? WHERE travelbuddies.id=?";
  let sql2 = "DELETE FROM categoryRelations where travelBuddies_id=?";
  let sql3 =
    "SELECT cityCategory.regionCategory_id FROM cityCategory WHERE cityCategory.id= ?";
  let sql4 =
    "INSERT INTO categoryRelations SET travelbuddies_id  = ?,regionCategory_id  = ?,cityCategory_id = ? ";
  conn.beginTransaction(function (err) {
    let tbThemeName = req.body.tbThemeName;
    let tbThemePhoto = req.body.tbThemePhoto;
    let tbDateBegin = req.body.tbDateBegin;
    let tbDateEnd = req.body.tbDateEnd;
    let tbDaysCategory = req.body.tbDaysCategory;
    let tbLastApprovedDate = req.body.tbLastApprovedDate;
    let tbPersonsNeeded = req.body.tbPersonsNeeded;
    let tbGenderNeeded = req.body.tbGenderNeeded;
    let tbEstimatedCost = req.body.tbEstimatedCost;
    let tbThemeIntro = req.body.tbThemeIntro;
    let tbCityCategory = req.body.tbCityCategory;
    if (err) {
      console.log(err);
    }
    conn.query(
      sql1,
      [
        tbThemeName,
        tbThemePhoto,
        tbDateBegin,
        tbDateEnd,
        tbDaysCategory,
        tbLastApprovedDate,
        tbPersonsNeeded,
        tbGenderNeeded,
        tbEstimatedCost,
        tbThemeIntro,
        id,
      ],
      function (err, result) {
        if (err) {
          conn.rollback(function () {
            console.log(err);
          });
        } else {
          console.log("sql1 ok");
        }

        conn.query(sql2, [id], function (err, result) {
          if (err) {
            conn.rollback(function () {
              console.log(err);
            });
          } else {
            console.log("sql2 ok");
          }

          for (let i in tbCityCategory) {
            let city = tbCityCategory[i];
            console.log("city:" + city);
            let query3 = conn.query(sql3, city, function (err3, result3) {
              console.log(query3.sql);
              if (err) {
                conn.rollback(function () {
                  console.log(err);
                });
              }
              // let region=result
              let region = 0;
              if (result3.length > 0) {
                region = result3[0].regionCategory_id;
              }
              var query4 = conn.query(
                sql4,
                [id, region, city],
                function (err, result) {
                  console.log(query3.sql);
                  if (err) {
                    conn.rollback(function () {
                      console.log(err);
                    });
                  }
                }
              );
            });
          }
          conn.commit(function (err) {
            if (err) {
              conn.rollback(function () {
                console.log(err);
              });
            }
            console.log("Transaction Completed Successfully.");
          });
        });
      }
    );
  });
  res.send('{"message":"已更新"}');
});

//給星等
router.post("/tbrating", function (req, res, next) {
  let tb_id = req.body.tb_id;
  let m_id = req.body.m_id;
  let give_id=req.body.give_id
  let rating = req.body.rating;
  let sql = `INSERT INTO rating (travelBuddies_id, member_id, from_member_id,rating) VALUES (${tb_id},${m_id},${give_id},'${rating}')`;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send('{"message":"已給星"}');
  });
});

//取得星等
router.get("/tbrating/:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql = `SELECT AVG(rating) AS rating FROM rating WHERE travelBuddies_id=? AND member_id=?`;
  conn.query(sql, [tb_id, 1], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

//報名揪團，ok
router.post("/tbsignedup", function (req, res, next) {
  let id = req.body.id;
  let time = moment(new Date()).format("YYYY-MM-DD");
  console.log(time);
  let sql = `INSERT INTO memberssignedup (travelBuddies_id, members_id, membersStatus, signedUpTime) VALUES ('${id}',1,'審核中','${time}')`;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send('{"message":"已報名"}');
  });
});

//取消報名揪團，ok
router.delete("/tbdropout/:id", function (req, res, next) {
  let id = req.params.id;
  let sql = `DELETE FROM memberssignedup WHERE travelBuddies_id = ? AND members_id =1`;
  conn.query(sql, [id], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send('{"message":"已取消報名"}');
  });
});

//我的揪團-選擇團員  //把報名揪團者叫出來
router.get("/membersselect/:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql =
    "SELECT memberssignedup.membersStatus AS membersStatus, memberssignedup.members_id AS m_id,member.member_photo_id AS memberPhoto, member.member_name AS memberName ,travelBuddies.themeName AS themeName, travelBuddies.id AS tb_id FROM memberssignedup JOIN member ON memberssignedup.members_id=member.newsId JOIN travelBuddies ON memberssignedup.travelBuddies_id =travelBuddies.id WHERE travelBuddies_id=?";
  conn.query(sql, [tb_id], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

//選擇成員用的更新api
router.put("/membersselect/:id", function (req, res, next) {
  let id = req.params.id;
  let membersSelect = req.body.tbSelect;
  let sql =
    "UPDATE memberssignedup SET membersStatus = ? JOIN member ON memberssignedup.members_id=member.newsId WHERE member=? AND travelbuddies_id = ?";
  conn.query(sql, ["參與中"], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

//把團主叫出來評分、把團主叫到聊天室
router.get("/owner/:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql =
    "SELECT travelBuddies.themeName AS themeName, member.member_name AS ownerName,travelbuddies.owner_id AS ownerId, travelBuddies.id AS tb_id FROM travelbuddies JOIN member ON travelbuddies.owner_id = member.newsId WHERE travelBuddies.id=?";
  conn.query(sql, [tb_id], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

//把參加揪團者叫出來評分、把團員叫到聊天室
router.get("/memberjoined/:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql =
    "SELECT memberssignedup.members_id AS memberId, member.member_name AS memberName , travelBuddies.themeName AS themeName, travelBuddies.id AS tb_id FROM memberssignedup JOIN member ON memberssignedup.members_id=member.newsId JOIN travelBuddies ON memberssignedup.travelBuddies_id =travelBuddies.id WHERE travelBuddies_id=? AND memberssignedup.membersStatus='參與中'";
  conn.query(sql, [tb_id], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

//刪除揪團，目前確定mine可以用
router.delete("/:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql1 = "DELETE FROM travelbuddies WHERE id= ? ";
  let sql2 = "DELETE FROM categoryrelations WHERE travelBuddies_id= ?";
  conn.beginTransaction(function (err) {
    if (err) {
      console.log(err);
    }
    conn.query(sql1, tb_id, function (err, result) {
      if (err) {
        conn.rollback(function () {
          console.log(err);
        });
      }
      conn.query(sql2, tb_id, function (err, result) {
        if (err) {
          conn.rollback(function () {
            console.log(err);
          });
        }
        conn.commit(function (err) {
          if (err) {
            conn.rollback(function () {
              console.log(err);
            });
          }
          console.log("Transaction Completed Successfully.");
        });
      });
    });
  });
  res.send('{"message":"已刪除"}');
});

//取消參加的揪團，從上面那隻改
router.delete("/tbjoined/:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql1 = "DELETE FROM memberssignedup WHERE travelBuddies_id= ? ";
  conn.beginTransaction(function (err) {
    if (err) {
      console.log(err);
    }
    conn.query(sql1, tb_id, function (err, result) {
      if (err) {
        conn.rollback(function () {
          console.log(err);
        });
      }
      conn.commit(function (err) {
        if (err) {
          conn.rollback(function () {
            console.log(err);
          });
        }
        console.log("Transaction Completed Successfully.");
      });
    });
  });
  res.send('{"message":"已取消參加"}');
});

router.delete("/tbsignedup:id", function (req, res, next) {
  let tb_id = req.params.id;
  let sql = "DELETE FROM memberssignedup travelBuddies_id=? AND members_id=?";
  conn.query(sql, [tb_id, 1], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send("Deleted!");
  });
});

module.exports = router;
