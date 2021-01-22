var express  =  require(`express`);
var router  =  express.Router();

var mysql  =  require('mysql');

var conn  =  mysql.createConnection({
   host: process.env["dbhost"],
  user: process.env["dbuser"],
  password: process.env["dbpassword"],
  database: process.env["database"],
});

conn.connect(function(err){
    if(err){
        console.log(err);
    }
})




router.get(`/:id`, function (req, res, next) {
  let productId = req.params.id;
    let sql  = `SELECT products.*,
    teacher.name as teacher_name,
    teacher.title as teacher_title,
    teacher.photo as teacher_photo,
    teacher.history as teacher_history
    from products
    join teacher on products.teacher_id = teacher.id
    where products.id = ${productId}
   `
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});


router.get(`/car1/:id`, function (req, res, next) {
  let productId = req.params.id;
  let sql = `SELECT products.*
    from products
    where products.id = ${productId}
   `;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

router.get(`/`, function (req, res, next) {
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

  if (area !== "") area = `products.address = '${area}' `;
  if (town !== "") town = `products.classCity = '%${town}%' `;
  if (keyword !== "") {
    keyword = `products.className like '%${keyword}%' `;
  }

  let filter = [area, town, keyword];
  let filterStr = "";
  let handleFilter = "";
  filter.forEach((ele) => {
    if (ele == "") return;
    filterStr += ` ${ele}`;
  });
  handleFilter = `
  SELECT products.*,
  teacher.name as teacher_name,
  teacher.title as teacher_title,
  teacher.photo as teacher_photo,
  teacher.history as teacher_history
  from products
  join teacher on products.teacher_id = teacher.id
  where ${filterStr} 
  ORDER BY products.id
  `;
  console.log(handleFilter);
  let sql = `SELECT products.*,
  teacher.name as teacher_name,
  teacher.title as teacher_title,
  teacher.photo as teacher_photo,
  teacher.history as teacher_history
  from products
  join teacher on products.teacher_id = teacher.id
  ORDER BY products.id
   `;
     area === "" && town === "" && keyword === "" ? sql : handleFilter;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});


module.exports  =  router;
