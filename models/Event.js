var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    event_name: String,
    event_date: String,
    price: String,
    duration: String,
    type: String,
});

module.exports = mongoose.model('Event', myschema,"events");
