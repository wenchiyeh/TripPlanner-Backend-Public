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

router.post("/", function (req, res, next) {
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

module.exports = router;
