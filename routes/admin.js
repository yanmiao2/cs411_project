const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const mysql = require('mysql');
const con = require('../mysql');
const uuid = require("uuid");


router.get("/",(req,res)=>{
    // let temp = uuid.v4();
    // let sql = "UPDATE `uuid_test` SET `UUID` = '"+temp+"' WHERE `uuid_test`.`UUID` = 'null1';"
    let sql1 = "SELECT COUNT(s.queryID) as NUM FROM schedpref s JOIN userpref u on s.queryID = u.queryID"
    con.query(sql1,function (err, result1) {
        if (err) throw err;
        else{
            // console.log(result[0].NUM);
            let sql2 = "SELECT COUNT(s.queryID) as NUM FROM singleEventPref s JOIN userpref u on s.queryID = u.queryID"
            con.query(sql2,function (err, result2){
                let sql3 = "SELECT s.Date as Date, count(*) as NUM FROM singleEventPref s JOIN userpref u on s.queryID = u.queryID WHERE s.Date <> '' GROUP BY s.Date ORDER BY NUM DESC LIMIT 1";
                con.query(sql3,function (err, result3){
                    // if(err) throw err; console.log(result3);
                    let sql4 = "SELECT Avg(u.budget) as Budget FROM singleEventPref s JOIN userpref u on s.queryID = u.queryID WHERE u.budget <> '' ";
                    con.query(sql4,function (err, result4){
                        // if(err) throw err;console.log(result4);
                        let sql5 = "SELECT Avg(u.budget) as Budget FROM schedpref s JOIN userpref u on s.queryID = u.queryID WHERE u.budget <> '' and u.budget < 10000 ";
                        con.query(sql5,function (err, result5){
                            res.render("analysis",{numSchedule: result1, numEvent: result2, popDay: result3,eventBudget: result4, schedBudget:result5});
                        });
                    });
                });
            });
        }
    });

// schedpref
// singleEventPref
// userpref
    // <p>Number of Schedule Query:</p>
    // <p>Number of Event Query:</p>
    // <p>Most Popular Day From Search History</p>

    // <p>Average Budget on Event Query:</p>
    // <p>Average Budget on Schedule Query:</p>
    // <p>Most Popular Day From Search History</p>

});


module.exports = router;
