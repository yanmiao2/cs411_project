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
                // console.log(new_result);
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
        // startdate = '2020-08-15'
        startdate = '2020-06-25'
    }
    if(enddate==''){
      // enddate = '2020-08-17'
      startdate = '2020-06-27'

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
    // for(day=0;day<days;day++){

        curr_date = start.toLocaleDateString()
        var idx = curr_date.indexOf("/")
        if(idx==1) curr_date = 0 + curr_date
        idx = curr_date.indexOf("/",3)
        if(idx==4) curr_date = curr_date.slice(0,3) + '0' + curr_date.slice(3,0)
        curr_date = curr_date.slice(6,10) + "-" + curr_date.slice(0,2) + "-" + curr_date.slice(3,5)
        console.log(curr_date);

        var sql_1 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"'/3 ORDER BY e.StartTime ASC"
        // and e.startTime<'18:00:00
        con.query(sql_1, function (err, result1) {
          if (err) throw err;
          //console.log(result1)
          // var i
          // for(i = result1.length - 1; i > 0; i--){
          //     j = Math.floor(Math.random() * i)
          //     tempx = result1[i]
          //     result1[i] = result1[j]
          //     result1[j] = tempx
          // }
          start.setDate(start.getDate()+1)
          curr_date = start.toLocaleDateString()
          idx = curr_date.indexOf("/")
          if(idx==1) curr_date = 0 + curr_date
          idx = curr_date.indexOf("/",3)
          if(idx==4) curr_date = curr_date.slice(0,3) + '0' + curr_date.slice(3,0)
          curr_date = curr_date.slice(6,10) + "-" + curr_date.slice(0,2) + "-" + curr_date.slice(3,5)
          console.log(curr_date);
          var sql_2 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"'/3 ORDER BY e.StartTime ASC"
          con.query(sql_2, function (err, result2) {
              start.setDate(start.getDate()+1)
              curr_date = start.toLocaleDateString()
              idx = curr_date.indexOf("/")
              if(idx==1) curr_date = 0 + curr_date
              idx = curr_date.indexOf("/",3)
              if(idx==4) curr_date = curr_date.slice(0,3) + '0' + curr_date.slice(3,0)
              curr_date = curr_date.slice(6,10) + "-" + curr_date.slice(0,2) + "-" + curr_date.slice(3,5)
              console.log(curr_date);
              var sql_3 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.price <= '"+budget+"'/3 ORDER BY e.StartTime ASC"
              con.query(sql_3, function (err, result3) {
                  console.log("result1 is ", result1);
                  console.log("result2 is ", result2);
                  console.log("result3 is ", result3);
                  res.render('generator', {day1:result1,day2:result2, day3:result3});
              });
          })

          // Budget FIX ? Sahil & Marek
          //***************************************
          var counter = 0
          for(counter = 0; counter<result1.length; counter++) {
            var price = result1[counter].Price
            if(price>0 && price<=budget){
                break;
            }
            if(counter==(result1.length-1)) {
              price = -1
            }
          }
          if(price!=-1){
              budget -= price
          }
          if(result1.length==0){
            price = -1
          }
          // finalResult.push(result1)
          // console.log("THE FINAL result is ", finalResult);
          // console.log("THE FINAL length is ", finalResult.length);
          // console.log("first object is",finalResult[0] );
          // console.log("final result is ", finalResult);
          // console.log("type result1 is ", typeof(result1));
        })
        // var sql_2 = "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+startdate+"' and e.startTime>='18:00:00'"
        // con.query(sql_2, function (err, result2) {
        // })
    // }
    console.log("all good")
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
              console.log(typeof(result[0].Date));
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
    // let temp = uuid.v4();
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
//     // var sql = "select * from `Events`";
//     // con.query(sql,function (err, result) {
//     //   if (err) throw err;
//     //   else{
//     //       console.log(result.length);
//     //       for(let i =0; i<result.length;i++){
//     //           // var sql = "INSERT INTO `Events` (maxPrice, Name, URL, minPrice, startTime, Location, Date, Description, Type) VALUES ('0', '"+event_name+"','"+web_link+"', '"+ticket_price+"', '"+start_time+"', 'Chicago', '"+event_date+"','"+description+"','"+event_type+"')";
//     //           let temp = uuid.v4();
//     //           new_sql = "INSERT INTO `Events` (EventID, Name, URL, Price, StartTime, Location, Date, Date_type, Description, Type) VALUES('"+temp+"','"+result[i].Name+"','url', '"+result[i].Price+"', '"+result[i].StartTime+"', '"+result[i].Location+"', '"+result[i].Date+"', '"+result[i].Date_type+"', '"+result[i].Description+"', '"+result[i].Type+"')";
//     //           con.query(new_sql,(err,new_result)=>{
//     //               if (err) throw err;
//     //               // console.log("insert 1");
//     //               // console.log(new_result);
//     //           })
//     //       }
//     //       res.render('admin');
//     //   }
//     // });
//     var sql = "alter table Events add column `EventID` int(10) unsigned primary KEY AUTO_INCREMENT;"
//     con.query(sql,function (err, result) {
//       if (err) throw err;
//       console.log(result)
//   });
// });

// add update delete
module.exports = router;
