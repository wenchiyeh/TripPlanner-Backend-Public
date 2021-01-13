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

router.get(`/`, function (req, res, next) {
    let sql  = `SELECT orderhistory.*,
    member.member_name as user_Name,
    member.birthday as user_birthday,
    member.email as user_mail,
    member.member_sex as gender,
    member.member_phone as user_phone,
    products.className as class_Name
    from orderhistory
    join member on orderhistory.userId = member.newsId
    join products on orderhistory.productID = products.id
    ORDER BY orderhistory.id DESC
   `
conn.query(sql,[], function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});

// router.post(`/create`, function (req, res, next) {
//     let sql1 = `INSERT INTO travelbuddies themeName = ?,
//     owner_id = ?,
//     themePhoto = ?,
//     dateBegin = ?,
//     dateEnd = ?, 
//     daysCategory_id = ?, 
//     lastApprovedDate = ?, 
//     personNeeded = ?, 
//     genderNeeded = ?, 
//     estimatedCost = ?, 
//     themeIntro = ?, 
//     valid = ? `
//     let sql2 = `INSERT INTO categoryRelations travelbuddies_id = ?,
//     regionCategory_id  =  ?,
//     cityCategory_id = ?`
//     conn.beginTransaction
//     res.send(`已連線`)
    
// })

// router.put(`/update`, function (req, res, next) {
//     let sql1 = ` travelbuddies themeName  =  ?,
//     owner_id = ?, 
//     themePhoto = ?, 
//     dateBegin = ?, 
//     dateEnd = ?, 
//     daysCategory_id = ?, 
//     lastApprovedDate = ?, 
//     personNeeded = ?, 
//     genderNeeded = ?, 
//     estimatedCost = ?, 
//     themeIntro = ?, 
//     valid = ? `
//     let sql2 = `INSERT INTO categoryRelations travelbuddies_id = ?,
//     regionCategory_id = ?,
//     cityCategory_id = ?`
//     conn.beginTransaction
//     res.send(`已連線`)
    
// })



module.exports  =  router;
