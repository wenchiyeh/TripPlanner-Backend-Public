var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
//
//自定義路由檔案
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var itinRouter = require("./routes/itinerary");
var loginRouter =require("./routes/login");
//
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
app.use(express.static(path.join(__dirname, "public")));
//
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/itinerary", itinRouter);
app.use("/login",loginRouter);
//
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
//
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
