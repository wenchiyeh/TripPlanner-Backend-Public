//收藏揪團
var express = require("express");
var router = express.Router();
//使用環境參數
require("dotenv").config();
var conn = require("../dbConnect");

//我的揪團
// router.get("/", function (req, res, next) {
//     let sql =`SELECT travelbuddies.id, travelbuddies.themeName AS tb_themeName,
//     travelbuddies.dateBegin AS tb_dateBegin,
//     travelbuddies.dateEnd AS tb_dateEnd,
//     memberssignedup.membersStatus AS tb_membersStatus,
//     regioncategory.region AS tb_region,
//     citycategory.city AS tb_city
//     FROM travelbuddies
//     INNER JOIN categoryrelations
//     INNER JOIN citycategory
//     JOIN regioncategory
//     JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id
//     JOIN memberssignedup ON travelbuddies.id=memberssignedup.travelBuddies_id
//     WHERE memberssignedup.members_id = 1 AND travelbuddies.dateEnd>NOW()
//     GROUP BY travelBuddies.themeName
//     ORDER BY travelBuddies.id;`

router.post("/", function (req, res, next) {
  let sql = `SELECT travelbuddies.id, member.member_name AS tb_owner,
     travelbuddies.themeName AS tb_themeName,
      travelbuddies.personsNeeded AS tb_personsNeeded,
      travelbuddies.genderNeeded AS tb_genderNeeded,
       travelbuddies.estimatedCost AS tb_estimatedCost,
       travelbuddies.lastApprovedDate AS tb_lastApprovedDate,
        travelbuddies.dateBegin AS tb_dateBegin ,
        travelbuddies.dateEnd AS tb_dateEnd,
         daysCategory.daysCategory AS tb_daysCategory,
         GROUP_CONCAT(DISTINCT regionCategory.region ORDER BY regionCategory.id) AS tb_region ,
         GROUP_CONCAT(DISTINCT cityCategory.city ORDER BY cityCategory.id) AS tb_city,
           travelBuddies.themeintro AS tb_themeIntro FROM travelbuddies J
           OIN member ON travelbuddies.owner_id=member.newsId 
           JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id 
           JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id 
           JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id 
           JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id 
           WHERE travelbuddies.id = 19 
           GROUP BY travelBuddies.themeName 
           ORDER BY travelBuddies.id;`;

  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});

router.get("/", function (req, res, next) {
  let sql = `SELECT travelbuddies.id, travelbuddies.themeName AS tb_themeName,
     travelbuddies.dateBegin AS tb_dateBegin ,
      travelbuddies.dateEnd AS tb_dateEnd,
       memberssignedup.membersStatus AS tb_membersStatus 
       FROM travelbuddies 
       JOIN categoryRelations ON categoryRelations. travelBuddies_id=travelbuddies.id 
       JOIN cityCategory ON categoryRelations.cityCategory_id=cityCategory.id 
       JOIN regionCategory ON cityCategory.regionCategory_id=regionCategory.id 
       JOIN dayscategory ON travelbuddies.daysCategory_id=daysCategory.id 
       JOIN memberssignedup ON travelbuddies.id=memberssignedup.travelBuddies_id 
       WHERE memberssignedup.members_id = 1 AND travelbuddies.dateEnd>NOW() 
       GROUP BY travelBuddies.themeName 
       ORDER BY travelBuddies.id;`;
  conn.query(sql, [], function (err, rows) {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(rows));
  });
});
// router.get('/', function (req, res, next) {
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
//     `;
//     let sql2 = `select travelbuddies.*,
//     member.member_name as tr_membername,
//     travelbuddies.themeName as tr_name,
//     travelbuddies.dateBegin as tr_datebegin,
//     travelbuddies.dateEnd as tr_dataend,
//     travelbuddies.genderNeeded_id as tr_needid,
//     citycategory.city as tr_city,
//     regioncategory.region as tr_region
//     from mefavoritesgroup
//     natural join regioncategory
//     natural join citycategory
//     natural join travelbuddies
//     `;

//     conn.query(sql,sql2, function (err, rows) {
//     if(err){
//         console.log(err);
//     }
//         res.send(JSON.stringify(rows));
//         });

// });

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

module.exports = router;
