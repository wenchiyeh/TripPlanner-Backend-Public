var express = require("express");
var router = express.Router();
//使用環境參數
require("dotenv").config();
//
var mysql = require("mysql");
var conn = mysql.createConnection({
  host: process.env["dbhost"],
  user: process.env["dbuser"],
  password: process.env["dbpassword"],
  database: process.env["database"],
});

/* GET itinerary listing. */
router.get("/", function (req, res, next) {
  let { area = "*", town = "*", day = 1, keyword = "*" } = req.query;

  let sqlKey = `select
  itinerary.id as itin_id,
  itinerary.title,
  itinerary.info,
  itinerary.location,
  itinerary.duration,
  itinerary.heart,
  itinerary.keep,
  itinerary.member_id as memberId ,
  member.newsId,
  member.member_name
  from itinerary
  join member on itinerary.member_id = member.newsId
  where itinerary.id
  in (select itinerary_id from spotsbox join citycategory on citycategory.city = spotsbox.location join regioncategory on regioncategory.id = citycategory.regionCategory_id where citycategory.city = '${town}' or regioncategory.region = '${area}')
  `;

  let handleSql = `select * from itinerary 
    where publish_time != NULL 
    and valid=1 
    and area = ? 
    and town = ? 
    and day >= ? 
    like ?`;
  //   console.log(handleSql);
  conn.query(sqlKey, [], function (err, rows) {
    //   conn.query(handleSql, [area, town, day, keyword], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

router.get("/edit/:itin_id", function (req, res, next) {
  let itin_id = req.itin_id;
  res.send(`edit: ${itin_id}`);
});

module.exports = router;
