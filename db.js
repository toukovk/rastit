var pg = require('pg');
var squel = require('squel');
var moment = require('moment');

// TODO - think through the logic between validation schema & value handler for dates
squel.registerValueHandler(Date, function(date) {
  return moment(date).format('YYYY-MM-DD')
});

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

exports.eventQuerySchema = {
  'firstDate': {
    custom: function(obj, schema, fn) {
      if(!obj) {
        fn(null, null);
        return;
      }
      var parsed = moment(obj, 'YYYY-MM-DD');
      if(!parsed.isValid()) {
        return fn(new Error('Invalid date parameter'));
      }
      fn(null, parsed.toDate());
    }
  }
};

exports.getEvents = getEvents;
