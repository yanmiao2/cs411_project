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
    // Event.find(
    //     {},
    //     (err, data) => {
    //         if(err) console.log(err);
    //         else res.render('index',{ events : data });
    //     }
    // );
});

router.get('/schedule', (req, res) => {
    res.render('schedule');
    // Event.find(
    //     {},
    //     (err, data) => {
    //         if(err) console.log(err);
    //         else res.render('schedule');
    //     }
    // );
});

router.post('/schedule', (req, res) => {
    console.log("SCHEDULE POST")
    // save the query to DB
    console.log(req.body);
    temp = uuid.v4();
    var sql = "INSERT INTO `userpref` (group_type, queryID, budget,Interests) VALUES ('"+req.body.group_type+"','"+temp+"','"+req.body.budget+"', '"+req.body.interests+"')";
    con.query(sql,function (err, result) {
        if (err) throw err;
        else{
            let new_sql = "INSERT INTO `schedpref`(queryID, endDate, startDate) VALUES('"+temp+"','"+req.body.endDate+"','"+req.body.startDate+"')"
            con.query(new_sql, (err, new_result)=>{
                if(err) throw err
            });
            console.log("find all events");
        }
    });

    // ****************************************************************************
    //TBD(Sahil && Marek): new query && a new ejs file
    var budget = req.body.budget
    var group = req.body.group_type
    var startdate = req.body.startdate
    var enddate = req.body.enddate
    if(startdate==''){
        startdate = '2020-08-15'
    }
    if(enddate==''){
        enddate = '2020-08-17'
    }
    start = new Date(startdate)
    end = new Date(enddate)
    var seconds = end-start
    var days = 1 + (((seconds/1000)/60)/60)/24
    console.log("Days:",days)
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
    var day
    start.setDate(start.getDate()+1)
    let finalResult = [];
    curr_date = start.toLocaleDateString()
    var idx = curr_date.indexOf("/")
    if(idx==1) curr_date = 0 + curr_date
    idx = curr_date.indexOf("/",3)
    if(idx==4) curr_date = curr_date.slice(0,3) + '0' + curr_date.slice(3,0)
    curr_date = curr_date.slice(6,10) + "-" + curr_date.slice(0,2) + "-" + curr_date.slice(3,5)
    //console.log(curr_date);
    // Day 1a
    var sql_1 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"' and e.startTime<='18:00:00'"
        con.query(sql_1, function (err, result1) {
            if (err) throw err
            var i
            for(i = result1.length - 1; i > 0; i--){
                j = Math.floor(Math.random() * i)
                tempx = result1[i]
                result1[i] = result1[j]
                result1[j] = tempx
            }
            //DAY 1b
            var sql_2 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"' and e.startTime>'18:00:00'"
            con.query(sql_2, function (err, result2) {
                if (err) throw err
                for(i = result2.length - 1; i > 0; i--){
                    j = Math.floor(Math.random() * i)
                    tempx = result2[i]
                    result2[i] = result2[j]
                    result2[j] = tempx
                }
                // DAY 2a
                start.setDate(start.getDate()+1)
                curr_date = start.toLocaleDateString()
                idx = curr_date.indexOf("/")
                if(idx==1) curr_date = 0 + curr_date
                idx = curr_date.indexOf("/",3)
                if(idx==4) curr_date = curr_date.slice(0,3) + '0' + curr_date.slice(3,0)
                curr_date = curr_date.slice(6,10) + "-" + curr_date.slice(0,2) + "-" + curr_date.slice(3,5)
                //console.log(curr_date);
                var sql_3 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"' and e.startTime<='18:00:00'"

                con.query(sql_3, function (err, result3) {
                    if (err) throw err
                    for(i = result3.length - 1; i > 0; i--){
                        j = Math.floor(Math.random() * i)
                        tempx = result3[i]
                        result3[i] = result3[j]
                        result3[j] = tempx
                    }
                    //DAY 2b
                    var sql_4 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"' and e.startTime>'18:00:00'"
                    con.query(sql_4, function (err, result4) {
                        if (err) throw err
                        for(i = result4.length - 1; i > 0; i--){
                            j = Math.floor(Math.random() * i)
                            tempx = result4[i]
                            result4[i] = result4[j]
                            result4[j] = tempx
                        }
                        ///DAY 3a
                        start.setDate(start.getDate()+1)
                        curr_date = start.toLocaleDateString()
                        idx = curr_date.indexOf("/")
                        if(idx==1) curr_date = 0 + curr_date
                        idx = curr_date.indexOf("/",3)
                        if(idx==4) curr_date = curr_date.slice(0,3) + '0' + curr_date.slice(3,0)
                        curr_date = curr_date.slice(6,10) + "-" + curr_date.slice(0,2) + "-" + curr_date.slice(3,5)
                        console.log(curr_date);

                        var sql_5 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"' and e.startTime<='18:00:00'"
                        con.query(sql_5, function (err, result5 ) {
                            if (err) throw err
                            for(i = result5.length - 1; i > 0; i--){
                                j = Math.floor(Math.random() * i)
                                tempx = result5[i]
                                result5[i] = result5[j]
                                result5[j] = tempx
                            }
                            var sql_6 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"' and e.startTime>'18:00:00'"
                            con.query(sql_6, function (err, result6) {
                                if (err) throw err
                                for(i = result6.length - 1; i > 0; i--){
                                    j = Math.floor(Math.random() * i)
                                    tempx = result6[i]
                                    result6[i] = result6[j]
                                    result6[j] = tempx
                                }
                                console.log("result1 is ", result1);
                                console.log("result2 is ", result2);
                                console.log("result3 is ", result3);
                                console.log("result4 is ", result4);
                                console.log("result5 is ", result5);
                                console.log("result6 is ", result6);
                                res.render('generator', {day1a:result1,day1b:result2, day2a:result3,day2b:result4,day3a:result5, day3b:result6});
                            });
                        })
                    })
                })
            })
    })
    console.log("SCHEDULE POST END")
    console.log("************************")
});

router.get('/events', (req, res) => {
    res.render('userEvents')
});

router.post('/events', (req, res) => {
    console.log(req.body);
    // Add query to DB
    temp = uuid.v4();
    var sql = "INSERT INTO `userpref` (group_type, queryID, budget,Interests) VALUES ('"+req.body.group_type+"','"+temp+"','"+req.body.budget+"', '"+req.body.interests+"')";
    con.query(sql,function (err, result) {
        if (err) throw err;
        else{
            let new_sql = "INSERT INTO `singleEventPref`(queryID, Date, StartTime, EndTime) VALUES('"+temp+"', '"+req.body.date+"','"+req.body.startTime+"','"+req.body.endTime+"')"
            con.query(new_sql, (err, new_result)=>{
                // console.log(new_result);
            });
            console.log("find all events");
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
    // interest = ['DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH'];
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
    con.query("select * from Events e where e.EventID = '"+req.body.eventID+"'",function (err, result) {
      if (err) throw err;
      else{
          console.log("specific events");
          console.log(result);
          res.render('userEvent',{ event : result,query: req.body })
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
              console.log(typeof(result[0].Date));
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
          console.log("specific events");
          console.log(result);
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
        console.log(result);
        con.query("select * from `Events`",function (err, result) {
          if (err) throw err;
          else{
              console.log("find all events");
              res.render('adminEvents',{ events : result })
          }
        });
      });
});

router.post('/admin/update', (req, res) => {
    const {event_name,web_link,ticket_price,start_time,location,event_date,description,event_type}= req.body;
    console.log(req.body);
    var sql = "Update Events e SET Name = '"+event_name+"', URL = '"+web_link+"', Price = '"+ticket_price+"', StartTime = '"+start_time+"', Location = '"+location+"', Date = '"+event_date+"', Description = '"+description+"', Type = '"+event_type+"' WHERE e.EventID = '"+req.body.eventID+"' "
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        con.query("select * from `Events`",function (err, result) {
          if (err) throw err;
          else{
              console.log("find all events");
              res.render('adminEvents',{ events : result })
          }
        });
      });
});

router.post("/admin/delete",(req, res) => {
    console.log(req.body);
    var sql = "DELETE FROM Events WHERE EventID='"+req.body.eventID+"'; "
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        con.query("select * from `Events`",function (err, result) {
          if (err) throw err;
          else{
              console.log("find all events");
              res.render('adminEvents',{ events : result })
          }
        });
      });
});

// add update delete
module.exports = router;
