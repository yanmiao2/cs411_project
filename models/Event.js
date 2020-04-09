var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    event_name: String,
    event_date: String, // yyyy/mm/dd
    ticket_price: String,
    event_size: String,
    start_time: String,  // 24hr
    location: String,
    web_link: String,
    description: String,
    event_type: String // e.g. "romance sports"
});

module.exports = mongoose.model('Event', myschema,"events");
