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
  let { area = "", town = "", day = 0, keyword = "" } = req.query;
  area = area.replace("全部", "");
  town = town.replace("全部", "");
  keyword = keyword.replace(/[\/.,{}\[\]()=*%$#@!&|]/g, "");
  let dayOption = `and itinerary.duration `;
  switch (day) {
    case 0:
      dayOption = "";
      break;
    case 1:
      dayOption += "= 1";
      break;
    case 2:
      dayOption += "between 2 and 3";
      break;
    case 3:
      dayOption += "between 4 and 5";
      break;
    case 4:
      dayOption += "between 6 and 7";
      break;
    case 5:
      dayOption += "> 7";
      break;
  }

  if (area !== "") area = ` regioncategory.region = '${area}' `;
  if (town !== "") town = ` citycategory.city = '${town}' `;
  if (keyword !== "") {
    keyword = ` (spotsbox.title like '%${keyword}%' or spotsbox.info like '%${keyword}%' or itinerary.title like '%${keyword}%' or itinerary.info like '%${keyword}%' )`;
  }

  let filter = [area, town, keyword];
  let filterStr = "";
  let handleFilter = "";
  filter.forEach((ele) => {
    if (ele == "") return;
    filterStr += ` and ${ele}`;
  });
  handleFilter = `
  itinerary.id in (
    select itinerary_id from spotsbox 
    join citycategory on citycategory.city = spotsbox.location 
    join regioncategory on regioncategory.id = citycategory.regionCategory_id 
    join itinerary on itinerary.id = spotsbox.itinerary_id  
    where spotsbox.valid = 1 ${filterStr} )`;

  let sqlGetFilterList = `select
  itinerary.id as itin_id,
  itinerary.title,
  itinerary.info,
  itinerary.location,
  itinerary.duration,
  itinerary.publish_time,
  itinerary.heart,
  itinerary.keep,
  itinerary.image,
  itinerary.member_id as memberId ,
  member.newsId,
  member.member_name,
  member.member_id as nickname
  from itinerary
  join member on itinerary.member_id = member.newsId
  where itinerary.publish_time != 'null' and `;

  area === "" && town === "" && day === 0 && keyword === ""
    ? (sqlGetFilterList += `itinerary.valid = 1`)
    : (sqlGetFilterList += handleFilter);

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
