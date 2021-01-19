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

function cityToRegion(city) {
  let region = "北部";
  switch (city) {
    case "台北":
    case "新北":
    case "基隆":
    case "桃園":
    case "新竹":
      region = "北部";
      break;
    case "雲林":
    case "南投":
    case "彰化":
    case "台中":
    case "苗栗":
      region = "中部";
      break;
    case "屏東":
    case "高雄":
    case "台南":
    case "嘉義":
      region = "南部";
      break;
    case "宜蘭":
    case "花蓮":
    case "台東":
      region = "東部";
      break;
    case "蘭嶼":
    case "綠島":
    case "馬祖":
    case "金門":
    case "澎湖":
    case "小琉球":
      region = "離島";
      break;
  }
  return region;
}

//取得行程列表 & 搜尋功能
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
//取得特定行程資料
router.get("/:itinId", function (req, res, next) {
  let itinId = req.params.itinId;
  let returnData = [{}, {}];
  let sqlGetItin = `select
  member.member_name,
  itinerary.member_id,
  itinerary.title,
  itinerary.region,
  itinerary.location,
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
});

router.post("/addItin", function (req, res, next) {
  let data = req.body;
  data.forEach((element) => {
    let sqlCheck = `select itinList.id from itinList where itinList.place_id = '${element.id}'`;
    conn.query(sqlCheck, [], function (err, rows) {
      if (err) {
        console.log(JSON.stringify(err));
        return err;
      } else {
        if (rows.length > 0) {
          console.log(`${element.title} 重複`);
        } else {
          let town = element.town.slice(10, 12);
          let add = town + element.vicinity;
          let title = element.title.replace("'", "");
          title = title.replace('"', "");
          let inserItinToDB = `insert into itinList (place_id,title,lat,lng,address,city) values('${element.id}','${title}','${element.lat}','${element.lng}','${add}','${town}')`;
          conn.query(inserItinToDB, [], function (err, rows) {
            if (err) {
              console.log(JSON.stringify(err));
              return;
            }
          });
        }
      }
    });
  });
  res.send(JSON.stringify({ result: "ok" }));
});

router.post("/createItin", function (req, res) {
  let data = req.body;
  console.log(data);
  let headData = data[0]; //行程主資料
  let bodyData = data[1]; //行程day-box資料
  //處理時間
  let time = new Date();
  let nowArray = [
    (time.getMonth() + 1).toString(),
    time.getDate().toString(),
    time.getHours().toString(),
    time.getMinutes().toString(),
    // time.getSeconds().toString(),
  ];
  let nowStr = "" + time.getFullYear();
  nowArray.forEach((ele) => {
    if (Array.from(ele).length < 2) {
      nowStr += `0${ele}`;
    } else {
      nowStr += ele;
    }
  });
  let sqlInsertItinHead = `insert into itinerary (member_id, title, region, location, duration, establish_time) values(?, ?, ?, ?, ?, ?)`;
  conn.query(
    sqlInsertItinHead,
    [
      headData.member_id,
      headData.title,
      cityToRegion(headData.location),
      headData.location,
      headData.duration,
      nowStr,
    ],
    function (err, rows) {
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }
    }
  );
  let checkItinID = `select itinerary.id from itinerary where itinerary.establish_time = '${nowStr}'`;
  let currentID = "";
  conn.query(checkItinID, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    currentID = rows[0].id;
    let sqlInsertItinBody = `insert into spotsbox (itinerary_id, place_id, day, box_order, title, begin, location, lat, lng) values`;
    bodyData.forEach((ele, indexDay) => {
      ele.data.forEach((item, indexBox) => {
        let handleFormate = item.begin.replace(":", "");
        if (indexDay === 0 && indexBox === 0) {
          sqlInsertItinBody += `('${currentID}','${item.place_id}','${item.day}','${item.order}','${item.title}','${handleFormate}','${item.location}','${item.lat}','${item.lng}')`;
        } else {
          sqlInsertItinBody += `, ('${currentID}','${item.place_id}','${item.day}','${item.order}','${item.title}','${handleFormate}','${item.location}','${item.lat}','${item.lng}') `;
        }
        sqlInsertItinBody += ``;
      });
    });
    conn.query(sqlInsertItinBody, [], function (err, rows) {
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }
      res.send(JSON.stringify({ result: "ok", itin_id: currentID }));
    });
  });
});

module.exports = router;
