var express = require('express');
var app = express();
var db = require('./db');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!!');
});

app.get('/db', function (request, response) {
  db.getEvents(function(err, events) {
    if (err) {
      // TODO - something more relevant
      console.error(err);
      response.send("Error " + err);
    } else {
      response.send(events);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
