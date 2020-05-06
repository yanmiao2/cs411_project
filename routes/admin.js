const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const mysql = require('mysql');
const con = require('../mysql');
const uuid = require("uuid");


router.get("/",(req,res)=>{
    // let temp = uuid.v4();
    // let sql = "UPDATE `uuid_test` SET `UUID` = '"+temp+"' WHERE `uuid_test`.`UUID` = 'null1';"
    let sql1 = "SELECT COUNT()"
    console.log("test success");
    res.render("analysis")

});


module.exports = router;
