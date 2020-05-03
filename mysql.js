const mysql = require('mysql');
// var con = mysql.createConnection({
//   host: "remotemysql.com",
//   user: "k90mWR7iXF",
//   password: "ebowa9Fe3y",
//   database: 'k90mWR7iXF'
// });
//
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("MySQL Connected!");
// });
//
var db_config = {
      host: "remotemysql.com",
      user: "k90mWR7iXF",
      password: "ebowa9Fe3y",
      database: 'k90mWR7iXF'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 500); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  console.log("connect to sql db");
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

module.exports = connection;
