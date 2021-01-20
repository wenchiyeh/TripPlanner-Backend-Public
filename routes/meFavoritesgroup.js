//收藏揪團

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

router.get('/', function (req, res, next) {
    let sql = `selcet mefavoritesgroup.*,
    travelbuddies.themeName as mef_title,
    travelbuddies.dateBegin as mef_dtime,
    travelbuddies.dateEnd as mef_dend,
    citycategory.id as mef_city,
    regioncategory.id as mef_erg
    from mefavoritesgroup 
    join travelbuddies on travelbuddies.id = mefavoritesgroup.group_title
    join citycategory on citycategory.id = mefavoritesgroup.group_area1
    join regioncategoryon regioncategory.id = mefavoritesgroup.group_area2
    `;
    let sql2 = `select travelbuddies.*,
    member.member_name as tr_membername,
    travelbuddies.themeName as tr_name,
    travelbuddies.dateBegin as tr_datebegin,
    travelbuddies.dateEnd as tr_dataend,
    travelbuddies.genderNeeded_id as tr_needid,
    citycategory.city as tr_city,
    regioncategory.region as tr_region
    from mefavoritesgroup
    natural join regioncategory
    natural join citycategory
    natural join travelbuddies
    `;

    conn.query(sql,sql2, function (err, rows) {
    if(err){
        console.log(err);
    }
        res.send(JSON.stringify(rows));
        });
    
});

// router.get('/:id', function (req, res, next) {
//     let mefavoritesgroup = req.params.id;
//     let sql = `selcet mefavoritesgroup.*,
//     travelbuddies.themeName as mef_title,
//     travelbuddies.dateBegin as mef_dtime,
//     travelbuddies.dateEnd as mef_dend,
//     citycategory.id as mef_city,
//     regioncategory.id as mef_erg
//     from mefavoritesgroup 
//     join travelbuddies on travelbuddies.id = mefavoritesgroup.group_title
//     join citycategory on citycategory.id = mefavoritesgroup.group_area1
//     join regioncategoryon regioncategory.id = mefavoritesgroup.group_area2
//     where where mefavoritesgroup.id = ${mefavoritesgroup}
//     `;

//     conn.query(sql,[], function (err, rows) {
//         if(err){
//             console.log(err);
//         }
//             res.send(JSON.stringify(rows));
//             });
        
//     });

module.exports  =  router;