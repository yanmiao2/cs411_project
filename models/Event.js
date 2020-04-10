var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    event_name: String,
    event_date: String, // yyyy/mm/dd
    ticket_price: Number,
    event_size: Number,
    start_time: String,  // 24hr
    location: String,
    web_link: String,
    description: String,
    event_type: Array // e.g. ["romance", "sports"]
});

module.exports = mongoose.model('Event', myschema,"events");
