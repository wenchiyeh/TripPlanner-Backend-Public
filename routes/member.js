var express = require("express");
var router = express.Router();
//使用環境參數
require("dotenv").config();
var conn = require("../dbConnect");

//會員資料
router.get("/", function (req, res, next) {
  let { id: newsId } = req.body;
  //驗證用戶是否存在
  let sqlKey = `SELECT member.*,
  email,
  password,
  member_name,
  phone,
  birthday,
  member_sex,
  member_photo_id,
  member_id,
  member_aboutme
  newsId='${newsId}'
  from member where valid=1`;
  //let sqlKey = `select * from member email='${req.body.email}' and password='${req.body.password}' and newsId='${newsId}'`;
  //這樣寫才對
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log("/member", obj);

  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

router.get("/:id", function (req, res, next) {
  let { id } = req.params;
  // let sqlKey = `select * from member where newsId='${newsId}' or email='${req.params.email}'`
  let sqlKey = `select * from member where newsId='${id}'`;
  //驗證用戶是否存在
  //let sqlKey = `select * from member where `;
  //let sqlKey = `select * from member where email='${req.body.email}' and password='${req.body.password}' and newsId='${newsId}'`;
  //這樣寫才對
  const obj = JSON.parse(JSON.stringify(req.params)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log("/member:id", obj);
  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    console.log(`member ${id} = ${rows}`);
    res.send(JSON.stringify(rows[0]));
  });
});

// 更新會員資料
router.put("/", function (req, res, next) {
  // let { id: newsId } = req.body
  // update statment
  let sqlKey = `update member set 
    email='${req.body.email}', 
    password='${req.body.password}', 
    member_name='${req.body.member_name}',  
    member_phone='${req.body.member_phone}', 
    birthday ='${req.body.birthday}',
    member_sex='${req.body.member_sex}',
    member_id='${req.body.member_id}',
    member_photo_id='${req.body.member_photo_id}',
    member_aboutme='${req.body.member_aboutme}'
    where newsId=${req.body.newsId} or valid=1'`;

  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log("/ud1", obj);

  conn.query(sqlKey, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

router.put("/:id", function (req, res, next) {
  console.log("udid:", req.body.id);
  let sqlKey = `update member set 
    email='${req.body.email}',
    member_name='${req.body.member_name}',  
    member_phone='${req.body.member_phone}',
    member_sex='${req.body.member_sex}',
    birthday ='${req.body.birthday}',
    member_id='${req.body.member_id}',
    member_photo_id='${req.body.member_photo_id}',
    member_aboutme='${req.body.member_aboutme}'
    where newsId='${req.params.id}'`;
  // let sqlKey = `update member set
  //   email='${req.body.email}',
  //   member_name='${req.body.member_name}',
  //   member_phone='${req.body.member_phone}',
  //   birthday='${req.body.birthday}',
  //   member_sex='${req.body.member_sex}',
  //   member_id='${req.body.member_id}',
  //   member_aboutme='${req.body.member_aboutme}' where newsid='${req.body.newsId}'`;
  const obj = JSON.parse(JSON.stringify(req.params)); // req.body = [Object: null prototype] { title: 'product' }
  //這樣寫才對
  console.log("/ud2", obj);

  conn.query(
    sqlKey,
    [
      req.body.member_photo_id,
      req.body.email,
      req.body.member_name,
      req.body.birthday,
      req.body.member_sex,
      req.body.member_id,
      req.body.member_aboutme,
    ],
    function (err, rows) {
      if (err) {
        console.log(err);
      }
      res.send(JSON.stringify({ result: "ok" }));
    }
  );
});

//上傳圖片
router.get('/', async(req, res, next) => {
  try {
    const [user] = await db.query(`SELECT img FROM user WHERE userId = "${req.session.user.userId}"`);
    // 轉換格式
    user.img = Buffer.from(user.img).toString('base64')
    
    res.send({
       success: true,
       user,
    });
  } catch(err) {
    next(err.sqlMessage || err);
  }
});

module.exports = router;
