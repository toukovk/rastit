var pg = require('pg');
var squel = require('squel');

function getEvents(apiQuery, callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var sql = squel.select().from('event');
    if(apiQuery.firstDate) {
      sql = sql.where('start_time > ?', apiQuery.firstDate);
    }
    client.query(sql.toString(), sql.toParam(), function(err, result) {
      done();
      if (err) {
        callback(err);
      } else {
        callback(null, result.rows);
      }
    });
  });
}

exports.getEvents = getEvents;