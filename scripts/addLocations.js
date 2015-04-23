var _ = require('lodash');
var fs = require('fs');

var filename = 'locations.json';

function readJsonFromStdin(callback) {
  // Main idea from https://gist.github.com/kristopherjohnson/5065599
  var stdin = process.stdin,
    inputChunks = [];

  stdin.resume();
  stdin.setEncoding('utf8');

  stdin.on('data', function (chunk) {
    inputChunks.push(chunk);
  });

  stdin.on('end', function () {
    var inputJSON = inputChunks.join();
    var parsedData = JSON.parse(inputJSON);
    callback(parsedData);
  });
}

function readLocationsFromFile(filename, callback) {
  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) { return console.log(err); }
    var locations = JSON.parse(data);
    callback(locations);
  });
}

function checkArgCountOrDie() {
  if(process.argv.length != 2) {
      console.log('Wrong number of arguments. (expected to read events from stdin)');
      console.log('Usage : node addLocations.js < events.json');
      process.exit(1);
  }
}

function addLocationsToEvents(eventsOrig, locations) {
  function findLocation(address) {
    return _.findWhere(locations, {name: address});
  }

  var events = _.cloneDeep(eventsOrig);
  _.forEach(events, function(event) {
    var location = findLocation(event.address);
    if(location) {
      event.latitude = location.latitude;
      event.longitude = location.longitude;
    } else {
      console.error('No location for address:', event.address);
    }
  })
  return events;
}

checkArgCountOrDie();
readJsonFromStdin(function(events) {
  readLocationsFromFile(filename, function(locations) {
    var eventsWithLocations = addLocationsToEvents(events, locations);
    console.log(JSON.stringify(eventsWithLocations));
  });
})