var express = require('express');
var app = express();
var db = require('./db');
var validate = require('isvalid-express');
var bodyParser = require('body-parser');
var auth = require('basic-auth');

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/api/events', validate.query(db.eventQuerySchema), function (request, response) {
  db.getEvents(request.query, function(err, events) {
    if (err) {
      // TODO - something more relevant
      console.error(err);
      response.send("Error " + err);
    } else {
      response.send(events);
    }
  });
});

app.post('/api/events', validate.body(db.insertEventSchema), function (request, response) {
  console.log('Request to /api/events', request.body);
  var credentials = auth(request);
  if (!credentials || credentials.name !== process.env.ADMIN_USERNAME || credentials.pass !== process.env.ADMIN_PASSWORD) {
    console.error('POST /api/events called with missing/invalid credentials');
    response.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="Admin API"'
    });
    response.end();
    return;
  }
  db.insertEvent(request.body, function(err) {
    if(err) {
      // TODO - something more relevant
      console.error(err);
      response.send("Error " + err);
    } else {
      response.send('OK');
    }
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
