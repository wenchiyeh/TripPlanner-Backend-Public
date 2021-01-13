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

  let sqlGetFilterList = `select
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
  in (select 
    itinerary_id from spotsbox 
    join citycategory on citycategory.city = spotsbox.location 
    join regioncategory on regioncategory.id = citycategory.regionCategory_id 
    where citycategory.city = '${town}' 
    or
    regioncategory.region = '${area}')
  `;

  // let handleSql = `select * from itinerary
  //   where publish_time != NULL
  //   and valid=1
  //   and area = ?
  //   and town = ?
  //   and day >= ?
  //   like ?`;

  //   console.log(handleSql);
  conn.query(sqlGetFilterList, [], function (err, rows) {
    //   conn.query(handleSql, [area, town, day, keyword], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

router.get("/:itinId", function (req, res, next) {
  let itinId = req.params.itinId;
  let returnData = [{}, {}];
  let sqlGetItin = `select
  member.member_name,
  itinerary.member_id,
  itinerary.title,
  itinerary.duration,
  itinerary.publish_time,
  itinerary.heart,
  itinerary.keep, 
  itinerary.view,
  itinerary.info
  from itinerary
  join member on itinerary.member_id = member.newsId
  where itinerary.id = ${itinId}
  `;
  let sqlGetBox = `select
  spotsbox.day,
  spotsbox.box_order,
  spotsbox.type,
  spotsbox.title,
  spotsbox.begin,
  regioncategory.region,
  spotsbox.location,
  spotsbox.lat,
  spotsbox.lng,
  spotsbox.image,
  spotsbox.info
  from spotsbox
  join citycategory on citycategory.city = spotsbox.location
  join regioncategory on regioncategory.id = citycategory.regionCategory_id
  where itinerary_id = ${itinId}
  `;

  conn.query(sqlGetItin, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    if (rows.length === 0) {
      res.send(JSON.stringify(rows));
      return;
    }
    returnData[0] = rows[0];
    let days = rows[0].duration;
    conn.query(sqlGetBox, [], function (err, rows) {
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }
      let handleRow = [];
      for (let i = 0; i < days; ++i) {
        handleRow.push({ title: `第 ${i + 1} 日`, data: [] });
      }
      rows.forEach((element) => {
        handleRow[element.day].data.push(element);
      });
      returnData[1] = handleRow;
      res.send(JSON.stringify(returnData));
    });
  });

  // res.send(`edit: ${itinId}`);
});

module.exports = router;
