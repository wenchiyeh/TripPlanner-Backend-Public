var express = require(`express`);
var router = express.Router();
var conn = require("../dbConnect");

router.get(`/`, function (req, res, next) {
  let sql = `SELECT orderhistory.* from orderhistory ORDER BY orderhistory.id DESC`;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});
router.get(`/:orderId`, function (req, res, next) {
  let orderId = req.params.orderId;
  let sql = `SELECT * from orderhistory where orderhistory.id = '${orderId}'`;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

router.post("/gohistory", function (req, res, next) {
  let data = req.body;
  let user_name = data.user_name;
  let ticket_number = data.ticket_number;
  let className = data.className;
  let buy_ticket_type = data.buy_ticket_type;
  let totalTicket = data.totalTicket;
  let buy_ticket_price = data.buy_ticket_price;
  let buy_ticket_day = data.buy_ticket_day;
  let user_gender = data.user_gender;
  let user_phone = data.user_phone;
  let user_mail = data.user_mail;
  let user_birthday = data.user_birthday;
  let credit = data.credit;

  console.log(req.body);
  let keysql = `INSERT INTO orderhistory (user_name, gender, phone, mail, birthday, ticket_type, price, className, ticketNumber, purchaseDate, payfor, many) VALUES ('${user_name}','${user_gender}','${user_phone}','${user_mail}','${user_birthday}','${buy_ticket_type}','${buy_ticket_price}','${className}','${ticket_number}','${buy_ticket_day}','${credit}','${totalTicket}')`;
  conn.query(keysql, [], function (err, rows) {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
  });
});

module.exports = router;
