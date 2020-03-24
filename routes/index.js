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

module.exports = router;
