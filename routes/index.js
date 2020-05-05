const express = require('express');
const router = express.Router();

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

    // save the quiry to DB
    console.log(req.body);
    temp = uuid.v4();
    var sql = "INSERT INTO `userpref` (group_type, queryID, budget,Interests) VALUES ('"+req.body.group_type+"','"+temp+"','"+req.body.budget+"', '"+req.body.interests+"')";
    con.query(sql,function (err, result) {
        if (err) throw err;
        else{
            let new_sql = "INSERT INTO `schedPref`(quiryID, endDate, startDate) VALUES('"+temp+"','"+req.body.endDate+"','"+req.body.startDate+"')"
            con.query(new_sql, (err, new_result)=>{
                // console.log(new_result);
            });
            console.log("find all events");
        }
    });

    // ****************************************************************************
    //TBD(Sahil && Marek): new quiry && a new ejs file
    res.render('admin');


    // Event.find(
    //     {},
    //     (err, data) => {
    //         if(err) console.log(err);
    //         else res.render('schedule');
    //     }
    // );
});

router.get('/schedule/events', (req, res) => {
    // var start_date = "2020-08-15"
    // var end_date = "2020-09-15"
    // var budget = 100
    // con.query("select * from `Updated Events` where date>" + "'" + start_date + "'" + " and date<" + "'" + end_date + "'",function (err, result) {
    //   if (err) throw err;
    //   else{
    //       console.log("find all events");
    //       res.render('adminEvents',{ events : result })
    //   }
    // });
});

router.get('/events', (req, res) => {
    res.render('userEvents')
    // Event.find(
    //     {},
    //     (err, data) => {
    //         if(err) console.log(err);
    //         else{
    //             res.render('userEvents',{ events : data })
    //         }
    //     }
    // );
});

router.post('/events', (req, res) => {
    console.log(req.body);
    // TBD - Yan: add query to DB
    // let temp = uuid.v4();
    temp = uuid.v4();
    var sql = "INSERT INTO `userpref` (group_type, queryID, budget,Interests) VALUES ('"+req.body.group_type+"','"+temp+"','"+req.body.budget+"', '"+req.body.interests+"')";
    con.query(sql,function (err, result) {
        if (err) throw err;
        else{
            let new_sql = "INSERT INTO `singleEventPref`(quiryID, Date, StartTime, EndTime) VALUES('"+temp+"', '"+req.body.date+"','"+req.body.startTime+"','"+req.body.endTime+"')"
            con.query(new_sql, (err, new_result)=>{
                // console.log(new_result);
            });
            console.log("find all events");
        }
    });


    //TBD - Sahil and Marek:
    //-------------------------------------------
    var date = req.body.date
    var group = req.body.group_type
    var size = req.body.size
    var budget = req.body.budget

    if(budget=='') budget = Number.MAX_SAFE_INTEGER

    var interest = ['','','','','']
    if("interests" in req.body){
      interest = ['DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH','DONTMATCH'];
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
    // Group types : Couple, Family, Friends, Professional
    if(group!="none"){
        switch(group){
            case "Couple":

                break;
            case "Family":
                break;
            case "Friends":
                break;
            default:
                break;
        }
    }

    if(date == ""){
        var sql = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%')"
    }
    else{
        var sql = "select * from Events e where e.date = '"+date+"' and e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%')"
    }

    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render('userEvents',{ events : result, query: req.body })
    });

    // let lower_limit, upper_limit;
    // if(req.body.budget==0){lower_limit = -1; upper_limit = 0;}
    // else if(req.body.budget==1){lower_limit = 1; upper_limit = 50;}
    // else if(req.body.budget==2){lower_limit = 51; upper_limit = 10000;}
    // // console.log(lower_limit);
    // if(req.body.date==""){
    //     Event.find(
    //         // TBD: Fill the below search condition based on req.body
    //         // ticket_price:{$gte: lower_limit, $lte: upper_limit}
    //         {ticket_price:{$gte: lower_limit, $lte: upper_limit}},
    //         (err, data) => {
    //             if(err) console.log(err);
    //             else{
    //                 console.log(lower_limit);
    //                 res.render('userEvents',{ events : data, query:req.body })
    //             }
    //         }
    //     );
    // }else{
    //     Event.find(
    //         // TBD: Fill the below search condition based on req.body
    //         {event_date:req.body.date,ticket_price:{$gte: lower_limit, $lte: upper_limit}},
    //         (err, data) => {
    //             if(err) console.log(err);
    //             else{
    //                 res.render('userEvents',{ events : data,query:req.body })
    //             }
    //         }
    //     );
    // }
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
    // console.log(req.body);
    // Event.find(
    //     {_id: req.body.eventID},
    //     (err, data) => {
    //         if(err) console.log(err);
    //         else{
    //             res.render('userEvent',{ event : data,query:req.body })
    //         }
    //     }
    // );
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
    // This is old mongoDB version
    // Event.find(
    //     {},
    //     (err, data) => {
    //         if(err) console.log(err);
    //         else{
    //             if(req.body.pwd == "sights")
    //                 res.render('adminEvents',{ events : data })
    //             else
    //                 res.redirect('/admin')
    //         }
    //     }
    // );
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
    // Event.find(
    //     {_id: req.body.eventID},
    //     (err, data) => {
    //         if(err) console.log(err);
    //         else{
    //             console.log(data);
    //             console.log(data[0].event_type[0]);
    //             res.render('adminEvent',{ event : data })
    //         }
    //     }
    // );
});

router.get('/admin/add', (req, res) => {
    res.render('adminAddEvent');
});

router.post('/admin/add', (req, res) => {
    const {event_name,web_link,ticket_price,start_time,location,event_date,description,event_type}= req.body;
    // const newEvent = {event_name,web_link,ticket_price,start_time,location,event_date,description,event_type}
    let temp = uuid.v4();
    var sql = "INSERT INTO `Events` (EventID, Name, URL, Price, StartTime, Location, Date, Description, Type) VALUES ('"+temp+"','"+event_name+"','"+web_link+"', '"+ticket_price+"', '"+start_time+"', '"+location+"', '"+event_date+"', '"+description+"', '"+event_type+"')";
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
    //old mongo solution
    // var data = Event(newEvent);
    // if(event_name,event_date,location){
    //     data.save(function(err) {
    //         if (err) {
    //         console.log("Error in Insert Record");
    //         } else {
    //             Event.find(
    //                 {},
    //                 (err, data) => {
    //                     if(err) console.log(err);
    //                     else{
    //                         res.render('adminEvents',{ events : data })
    //                     }
    //                 }
    //             );
    //         }
    //     });
    // }else{
    //     console.log("please enter all fields");
    //     res.render('adminAddEvent');
    // }
});

router.post('/admin/update', (req, res) => {
    const {event_name,web_link,ticket_price,start_time,location,event_date,description,event_type}= req.body;
    console.log(req.body);
    // const newEvent = {event_name,web_link,ticket_price,start_time,location,event_date,description,event_type}
    var sql = "Update Events e SET Name = '"+event_name+"', URL = '"+web_link+"', Price = '"+ticket_price+"', StartTime = '"+start_time+"', Location = '"+location+"', Date = '"+event_date+"', Description = '"+description+"', Type = '"+event_type+"' WHERE e.EventID = '"+req.body.eventID+"' "
     // (EventID, Name, URL, Price, StartTime, Location, Date, Description, Type) VALUES ('"+temp+"','"+event_name+"','"+web_link+"', '"+ticket_price+"', '"+start_time+"', '"+location+"', '"+event_date+"', '"+description+"', '"+event_type+"')";
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




    // const {event_name,event_date,ticket_price,event_size,start_time,location,web_link,description,event_type}= req.body;
    // Event.findOneAndUpdate(
    //     {_id:req.body.eventID},
    //     {event_name: event_name,
    //         event_date: event_date,
    //         ticket_price: ticket_price,
    //         event_size: event_size,
    //         start_time: start_time,
    //         location: location,
    //         web_link: web_link,
    //         description: description,
    //         event_type: event_type},
    //     function(err, my_res) {
    //         if (err) {
    //             console.log("Error in Fetch Data " + err);
    //         } else {
    //             Event.find(
    //                 {},
    //                 (err, data) => {
    //                     if(err) console.log(err);
    //                     else{
    //                         res.render('adminEvents',{ events : data })
    //                     }
    //                 }
    //             );
    //         }
    //     });
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

    // Event.findOneAndDelete(
    //     {_id:req.body.eventID},
    //     function(err, my_res) {
    //         if (err) {
    //             console.log("Error in Fetch Data " + err);
    //         } else {
    //             Event.find(
    //                 {},
    //                 (err, data) => {
    //                     if(err) console.log(err);
    //                     else{
    //                         res.render('adminEvents',{ events : data })
    //                     }
    //                 }
    //             );
    //         }
    //     });
});


//This is to add new UUID

// router.get("/test",(req,res)=>{
//     // let temp = uuid.v4();
//     // let sql = "UPDATE `uuid_test` SET `UUID` = '"+temp+"' WHERE `uuid_test`.`UUID` = 'null1';"
//     var sql = "select * from `Updated Events`";
//     con.query(sql,function (err, result) {
//       if (err) throw err;
//       else{
//           console.log(result.length);
//           for(let i =0; i<result.length;i++){
//               // var sql = "INSERT INTO `Updated Events` (maxPrice, Name, URL, minPrice, startTime, Location, Date, Description, Type) VALUES ('0', '"+event_name+"','"+web_link+"', '"+ticket_price+"', '"+start_time+"', 'Chicago', '"+event_date+"','"+description+"','"+event_type+"')";
//               let temp = uuid.v4();
//               new_sql = "INSERT INTO `Events` (EventID, Name, URL, Price, StartTime, Location, Date, Description, Type) VALUES('"+temp+"','"+result[i].Name+"','"+result[i].URL+"', '"+result[i].Price+"', '"+result[i].StartTime+"', '"+result[i].Location+"', '"+result[i].Date+"', '"+result[i].Description+"', '"+result[i].Type+"')";
//               con.query(new_sql,(err,new_result)=>{
//                   console.log("insert 1");
//                   console.log(new_result);
//               })
//           }
//           res.render('admin');
//       }
//     });
// });

// add update delete
module.exports = router;
