var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");



//自定義路由檔案
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var itinRouter = require("./routes/itinerary");
var tbRouter = require("./routes/travelBuddies");

var roRouter = require("./routes/histroyOrder");
var buRouter = require("./routes/ProductsList");
// var poyRouter = require("./routes/payment")

var tbmyaccountRouter = require("./routes/tbMyAccount");
var testRouter = require("./routes/test");
//memberliao
var signRouter = require("./routes/sign");
var loginRouter = require("./routes/login");
var memberRouter = require("./routes/member");
var udmemberRouter = require("./routes/udmember");
//收藏
var meFavoritesgroupRouter = require("./routes/meFavoritesgroup");
var app = express();
//
//使用環境參數
require("dotenv").config();
//
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
//
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/itinerary", itinRouter);
app.use("/travelbuddies", tbRouter);

app.use("/productList", buRouter);
app.use("/historyOrder", roRouter);
<<<<<<< HEAD
// app.use("/paymentaction", poyRouter);

=======
app.use("/eco", coRouter);
>>>>>>> a4f409c6cb248b024916e0b852c317b32b4839a9

app.use("/tbmyaccount", tbmyaccountRouter);
app.use("/test", testRouter);
//memberliso
app.use("/sign", signRouter);
app.use("/login", loginRouter);
app.use("/member", memberRouter);
app.use("/udmember", udmemberRouter);
//收藏
app.use("/meFavoritesgroup", meFavoritesgroupRouter);
//
//
//資料庫連線
// var mysql = require("mysql");
// var conn = mysql.createConnection({
//   host: process.env["dbhost"],
//   user: process.env["dbuser"],
//   password: process.env["dbpassword"],
//   database: process.env["database"],
// });
//
//圖片上傳
app.post("/upload", function (req, res) {
  //測試fetch
  let test = "ok";
  res.send(JSON.stringify(test));
});
//更新會員資料
// app.update = (req, res) => {
//   const id = req.params.id;

//   Tutorial.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Tutorial was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating Tutorial with id=" + id
//       });
//     });
// };
//測試用
app.get("/member/:id", function (req, res) {
  conn.query(
    "select * from member where id = ?",
    req.params.id,
    function (err, rows) {
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }
      res.send(JSON.stringify(rows));
    }
  );
});
//
//後方都不要管

//後方都不要管
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
