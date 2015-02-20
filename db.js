var pg = require('pg');

function getEvents(apiQuery, callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var wheres = [];
    var params = [];
    var sqlQuery;
    if(apiQuery.firstDate) {
      // TODO - API query parameter validation?
      wheres.push('start_time > $'+ wheres.length + 1);
      params.push(apiQuery.firstDate);
    }
    sqlQuery = 'SELECT * FROM event';
    if(wheres.length > 0) {
      sqlQuery += ' WHERE ' + wheres.join(', ');
    }
    client.query(sqlQuery, params, function(err, result) {
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