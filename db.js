var pg = require('pg');
var squel = require('squel');
var moment = require('moment');

function getEvents(apiQuery, callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var sql = squel.select().from('event');
    if(apiQuery.firstDate) {
      sql = sql.where('start_time >= ?', apiQuery.firstDate.format('YYYY-MM-DD'));
    }
    if(apiQuery.lastDate) {
      sql = sql.where('start_time < ?', apiQuery.lastDate.add(1, 'days').format('YYYY-MM-DD'));

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

var dateSchema = {
  custom: function(obj, schema, fn) {
    if(!obj) {
      fn(null, null);
      return;
    }
    var parsed = moment(obj, 'YYYY-MM-DD');
    if(!parsed.isValid()) {
      return fn(new Error('Invalid date parameter'));
    }
    fn(null, parsed);
  }
};

exports.eventQuerySchema = {
  'firstDate': dateSchema,
  'lastDate': dateSchema
};

exports.getEvents = getEvents;
