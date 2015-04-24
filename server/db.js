var pg = require('pg');
var squel = require('squel');
var moment = require('moment');

function getEvents(apiQuery, callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if(err) {
      console.error('Error while connecting', err);
      callback(err);
      return;
    }
    var sql = squel.select().from('event');
    if(apiQuery.firstDate) {
      sql = sql.where('start_time >= ?', apiQuery.firstDate.format('YYYY-MM-DD'));
    }
    if(apiQuery.lastDate) {
      sql = sql.where('start_time < ?', apiQuery.lastDate.add(1, 'days').format('YYYY-MM-DD'));
    }
    sql = sql.order('start_time');
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

function insertEvent(event, callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if(err) {
      console.error('Error while connecting', err);
      callback(err);
      return;
    }
    var sql = squel.insert()
        .into('event')
        .set('start_time', event.start_time.format())
        .set('end_time', event.end_time.format())
        .set('organizer', event.organizer)
        .set('address', event.address)
        .set('latitude', event.latitude || null)
        .set('longitude', event.longitude || null)
        .set('info', event.info)
        .set('url', event.url);
    console.log('Insert event:', sql.toString());
    client.query(sql.toString(), sql.toParam(), function(err, result) {
      done();
      if(err) {
        console.log('INSERT ERROR', err);
      } else {
        callback(err);
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

var timeStampSchema = {
  custom: function(obj, schema, fn) {
    if(!obj) {
      fn(null, null);
      return;
    }
    // Expect moment's defaults
    var parsed = moment(obj);
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

exports.insertEventSchema = {
  start_time: timeStampSchema,
  end_time: timeStampSchema,
  organizer: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  info: { type: String, required: true },
  url: { type: String, required: true }
};

exports.getEvents = getEvents;
exports.insertEvent = insertEvent;
