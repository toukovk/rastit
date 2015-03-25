var request = require('request');
var _ = require('lodash');
var fs = require('fs');

function checkArgCountOrDie() {
  if(process.argv.length != 6) {
      console.log('Wrong number of arguments.');
      console.log('Usage : node addEvents.js <file> <target> <http-basic-username> <http-basic-password>');
      console.log('E.g.  : node addEvents.js foo.json http://localhost:5000 admin pass');
      process.exit(1);
  }
}

var filename = process.argv[2];
var target = process.argv[3];
var username = process.argv[4];
var password = process.argv[5];

function main() {
  checkArgCountOrDie();
  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) { return console.log(err); }
    var events = JSON.parse(data);
    console.log('Number of events read from file ' + events.length);
    addEvents(events);
  });
}

function addEvents(events) {
  _.each(events, function(event) {
    request.post({
      url: target + '/api/events',
      json: event,
      auth: {
        user: username,
        pass: password
      }
    });
  });
}

main();