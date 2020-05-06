const express = require('express');
const router = express.Router();
const helper = require('../helper');
const Event = require('../models/Event');
const mysql = require('mysql');
const con = require('../mysql');
const uuid = require("uuid");

// Welcome Page
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/schedule', (req, res) => {
    res.render('schedule');
});

router.post('/schedule', (req, res) => {
    console.log(req.body)
    // save the query to DB
    temp = uuid.v4();
    var sql = "INSERT INTO `userpref` (group_type, queryID, budget,Interests) VALUES ('"+req.body.group_type+"','"+temp+"','"+req.body.budget+"', '"+req.body.interests+"')";
    con.query(sql,function (err, result) {
        if (err) throw err;
        else{
            let new_sql = "INSERT INTO `schedpref`(queryID, endDate, startDate) VALUES('"+temp+"','"+req.body.endDate+"','"+req.body.startDate+"')"
            con.query(new_sql, (err, new_result)=>{
                if(err) throw err
            });
        }
    });

    // ********************** Scheduler functionality **************************
    var budget = req.body.budget
    var group = req.body.group_type
    var startdate = req.body.startdate
    var enddate = req.body.enddate
    if(startdate=='' || enddate==''){
        startdate = '2020-08-15'
        enddate = '2020-08-17'
    }
    start = new Date(startdate)
    end = new Date(enddate)
    var seconds = end-start
    var days = 1 + (((seconds/1000)/60)/60)/24
    if(days > 3){
        console.log("Too many days")
    }
    if(budget=='') budget = Number.MAX_SAFE_INTEGER
    var interest = ['','','','','','']
    if("interests" in req.body) {
      interest = ['DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH'];
      var i;
      if(typeof req.body.interests === "string"){
          interest[0] = req.body.interests
      }
      else{
          for(i=0; i<req.body.interests.length; i++)
          {
            interest[i] = req.body.interests[i]
          }
      }
    }
    // Group types : Couple, Family, Friends
    if(group!="none"){
        switch(group){
            case "Couple":
                interest[5] = "Romantic"
                break;
            case "Family":
                interest[5] = "Family"
                break;
            case "Friends":
                interest[5] = "Friends"
                break;
            default:
                break;
        }
    }
    // Day 1a
    var curr_date = convert_date(start)
    var sql_1 = sql_a(budget,interest,curr_date)
    con.query(sql_1, function (err, result1) {
        if (err) throw err
        shuffle(result1)
        // Day 1b
        var sql_2 = sql_b(budget,interest,curr_date)
        con.query(sql_2, function (err, result2) {
            if (err) throw err
            shuffle(result2)
            // Day 2a
            curr_date = convert_date(start)
            var sql_3 = sql_a(budget,interest,curr_date)
            con.query(sql_3, function (err, result3) {
                if (err) throw err
                shuffle(result3)
                //DAY 2b
                var sql_4 = sql_b(budget,interest,curr_date)
                con.query(sql_4, function (err, result4) {
                    if (err) throw err
                    shuffle(result4)
                    ///DAY 3a
                    curr_date = convert_date(start)
                    var sql_5 = sql_a(budget,interest,curr_date)
                    con.query(sql_5, function (err, result5 ) {
                        if (err) throw err
                        shuffle(result5)
                        var sql_6 = sql_b(budget,interest,curr_date)
                        con.query(sql_6, function (err, result6) {
                            if (err) throw err
                            shuffle(result6)
                            res.render('generator', {day1a:result1,day1b:result2, day2a:result3,day2b:result4,day3a:result5, day3b:result6, query:req.body});
                        })
                    })
                })
            })
        })
    })
});

router.get('/events', (req, res) => {
    res.render('userEvents')
});

router.post('/events', (req, res) => {
    // Add query to DB
    temp = uuid.v4();
    var sql = "INSERT INTO `userpref` (group_type, queryID, budget,Interests) VALUES ('"+req.body.group_type+"','"+temp+"','"+req.body.budget+"', '"+req.body.interests+"')";
    con.query(sql,function (err, result) {
        if (err) throw err;
        else{
            let new_sql = "INSERT INTO `singleEventPref`(queryID, Date, StartTime, EndTime) VALUES('"+temp+"', '"+req.body.date+"','"+req.body.startTime+"','"+req.body.endTime+"')"
            con.query(new_sql, (err, new_result)=>{
            });
        }
    });

    //Singe event functionality
    //-------------------------------------------
    var date = req.body.date
    var group = req.body.group_type
    var size = req.body.size
    var budget = req.body.budget
    if(budget=='') budget = Number.MAX_SAFE_INTEGER
    var start = req.body.startTime
    var end = req.body.endTime

    var interest = ['','','','','','']
    if("interests" in req.body){
      interest = ['DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH'];
      var i;
      if(typeof req.body.interests === "string"){
          interest[0] = req.body.interests
      }
      else{
          for(i=0; i<req.body.interests.length; i++)
          {
            interest[i] = req.body.interests[i]
          }
      }
    }
    // Group types : Couple, Family, Friends
    if(group!="none"){
        switch(group){
            case "Couple":
                interest[5] = "Romantic"
                break;
            case "Family":
                interest[5] = "Family"
                break;
            case "Friends":
                interest[5] = "Friends"
                break;
            default:
                break;
        }
    }

    if(date == ""){
        var sql = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.startTime>= '"+start+"' and e.startTime <= '"+end+"' "
    }
    else{
        var sql = "select * from Events e where e.date_type = '"+date+"' and e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.StartTime>= '"+start+"' and e.StartTime <= '"+end+"'"
    }

    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render('userEvents',{ events : result, query: req.body })
    });
});

router.post('/events/details', (req, res) => {
    con.query("select * from Events e where e.EventID = '"+req.body.EventID+"'",function (err, result) {
      if (err) throw err;
      else{
          res.render('userEvent',{ event : result,query: req.body })
      }
    });
});

router.post('/schedule/details', (req, res) => {
    con.query("select * from Events e where e.EventID = '"+req.body.EventID+"'",function (err, result) {
      if (err) throw err;
      else{
          res.render('scheduleEvent',{ event : result,query: req.body })
      }
    });
});



router.get('/admin', (req, res) => {
    res.render('admin');
});

router.post('/admin', (req, res) => {
    con.query("select * from `Events`",function (err, result) {
      if (err) throw err;
      else{
          if(req.body.pwd == "sights"){
              res.render('adminEvents',{ events : result })
          }
          else
              res.redirect('/admin')
      }
    });
});

//find details of one event
router.post('/admin/events', (req, res) => {
    con.query("select * from Events e where e.EventID = '"+req.body.eventID+"'",function (err, result) {
      if (err) throw err;
      else{
          res.render('adminEvent',{ event : result })
      }
    });
});

router.get('/admin/add', (req, res) => {
    res.render('adminAddEvent');
});

router.post('/admin/add', (req, res) => {
    const {event_name,web_link,ticket_price,start_time,location,event_date,description,event_type}= req.body;
    var sql = "INSERT INTO `Events` (Name, URL, Price, StartTime, Location, Date, Description, Type) VALUES ('"+event_name+"','"+web_link+"', '"+ticket_price+"', '"+start_time+"', '"+location+"', '"+event_date+"', '"+description+"', '"+event_type+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        con.query("select * from `Events`",function (err, result) {
          if (err) throw err;
          else{
              res.render('adminEvents',{ events : result })
          }
        });
      });
});

router.post('/admin/update', (req, res) => {
    const {event_name,web_link,ticket_price,start_time,location,event_date,description,event_type}= req.body;
    var sql = "Update Events e SET Name = '"+event_name+"', URL = '"+web_link+"', Price = '"+ticket_price+"', StartTime = '"+start_time+"', Location = '"+location+"', Date = '"+event_date+"', Description = '"+description+"', Type = '"+event_type+"' WHERE e.EventID = '"+req.body.eventID+"' "
      con.query(sql, function (err, result) {
        if (err) throw err;
        con.query("select * from `Events`",function (err, result) {
          if (err) throw err;
          else{
              res.render('adminEvents',{ events : result })
          }
        });
      });
});

router.post("/admin/delete",(req, res) => {
    var sql = "DELETE FROM Events WHERE EventID='"+req.body.eventID+"'; "
      con.query(sql, function (err, result) {
        if (err) throw err;
        con.query("select * from `Events`",function (err, result) {
          if (err) throw err;
          else{
              res.render('adminEvents',{ events : result })
          }
        });
      });
});

// add update delete
module.exports = router;
