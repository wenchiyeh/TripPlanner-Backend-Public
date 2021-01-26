//通知-揪團
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