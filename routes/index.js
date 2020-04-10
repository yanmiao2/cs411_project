const express = require('express');
const router = express.Router();

const Event = require('../models/Event');

// Welcome Page
router.get('/', (req, res) => {
    Event.find(
        {},
        (err, data) => {
            if(err) console.log(err);
            else res.render('index',{ events : data });
        }
    );
});

router.get('/events', (req, res) => {
    Event.find(
        {},
        (err, data) => {
            if(err) console.log(err);
            else{
                res.render('userEvents',{ events : data })
            }
        }
    );
});

router.post('/events', (req, res) => {
    console.log(req.body);
    Event.find(
        // TBD: Fill the below search condition based on req.body
        {},
        (err, data) => {
            if(err) console.log(err);
            else{
                res.render('userEvents',{ events : data })
            }
        }
    );
});

router.post('/events/details', (req, res) => {
    Event.find(
        {_id: req.body.eventID},
        (err, data) => {
            if(err) console.log(err);
            else{
                res.render('userEvent',{ event : data })
            }
        }
    );
});

router.get('/admin', (req, res) => {
    res.render('admin');
});

router.post('/admin', (req, res) => {
    Event.find(
        {},
        (err, data) => {
            if(err) console.log(err);
            else{
                if(req.body.pwd == "sights")
                    res.render('adminEvents',{ events : data })
                else
                    res.redirect('/admin')
            }
        }
    );
});

router.post('/admin/events', (req, res) => {
    Event.find(
        {_id: req.body.eventID},
        (err, data) => {
            if(err) console.log(err);
            else{
                console.log(data);
                console.log(data[0].event_type[0]);
                res.render('adminEvent',{ event : data })
            }
        }
    );
});

router.get('/admin/add', (req, res) => {
    res.render('adminAddEvent');
});

router.post('/admin/add', (req, res) => {
    const {event_name,event_date,ticket_price,event_size,start_time,location,web_link,event_type}= req.body;
    const newEvent = {event_name,event_date,ticket_price,event_size,start_time,location,web_link,event_type}
    var data = Event(newEvent);
    if(event_name,event_date,location){
        data.save(function(err) {
            if (err) {
            console.log("Error in Insert Record");
            } else {
                Event.find(
                    {},
                    (err, data) => {
                        if(err) console.log(err);
                        else{
                            res.render('adminEvents',{ events : data })
                        }
                    }
                );
            }
        });
    }else{
        console.log("please enter all fields");
        res.render('adminAddEvent');
    }
});

router.post('/admin/update', (req, res) => {
    const {event_name,event_date,ticket_price,event_size,start_time,location,web_link,description,event_type}= req.body;
    Event.findOneAndUpdate(
        {_id:req.body.eventID},
        {event_name: event_name,
            event_date: event_date,
            ticket_price: ticket_price,
            event_size: event_size,
            start_time: start_time,
            location: location,
            web_link: web_link,
            description: description,
            event_type: event_type},
        function(err, my_res) {
            if (err) {
                console.log("Error in Fetch Data " + err);
            } else {
                Event.find(
                    {},
                    (err, data) => {
                        if(err) console.log(err);
                        else{
                            res.render('adminEvents',{ events : data })
                        }
                    }
                );
            }
        });
});
router.post("/admin/delete",(req, res) => {
    Event.findOneAndDelete(
        {_id:req.body.eventID},
        function(err, my_res) {
            if (err) {
                console.log("Error in Fetch Data " + err);
            } else {
                Event.find(
                    {},
                    (err, data) => {
                        if(err) console.log(err);
                        else{
                            res.render('adminEvents',{ events : data })
                        }
                    }
                );
            }
        });
});

// add update delete
module.exports = router;
