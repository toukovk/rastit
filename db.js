var pg = require('pg');

function getEvents(callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM event', function(err, result) {
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