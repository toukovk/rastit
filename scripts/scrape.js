var request = require('request');
var _ = require('lodash');
var moment = require('moment');
var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

var combineDateAndTime = function(date, time) {
  return date.clone().hour(time.hour()).minute(time.minute());
}
var formatDate = function(date) {
  return date.format('YYYY-MM-DD');
}
var formatTime = function(date) {
  return date.format('YYYY-MM-DD HH.mm');
}
// Parse string as "16.30" or "17"
var parseTime = function(timeString) {
  if(timeString.length === 5) {
    return moment(timeString, 'HH.mm');
  } else if(timeString.length === 2) {
    return moment(timeString, 'HH');
  } else {
    return null;
  }
}
// Parse strings as '16.30-18.30' or '17-18.30'
var parseStartAndEnd = function(startToEndString) {
  var index = startToEndString.indexOf('-');
  var startTime = startToEndString.substring(0, index);
  var endTime = startToEndString.substring(index+1, startToEndString.length);
  return {
    start: parseTime(startTime),
    end: parseTime(endTime)
  };
}

var parseIltarastit2015 = function(body) {
  var getColumnText = function($element, column) {
    var selector = 'td:nth-child(' + column + ')';
    var result = $element.find(selector).text().trim();
    return result;
  }
  var rows = $(body).find('table').find('tr');
  var foo = rows.map(function(index, row) {
    var $this = $(this);
    // "Pvm", e.g. "13.04"
    var dateOrig = getColumnText($this, 2);
    var date = moment(dateOrig + '2015', 'DD.MM.YYYY');
    if(!date.isValid()) {
      // To console.error so that we can still forward stdout to a file
      console.error('Skipping invalid date', dateOrig);
      return null;
    }
    // "Lähtöt", e.g. '16.30-18.30' or '17-18.30'
    var startAndEnd = parseStartAndEnd(getColumnText($this, 3));
    var start = combineDateAndTime(date, startAndEnd.start);
    var end = combineDateAndTime(date, startAndEnd.end);
    // "Maali sulkeutuu", e.g. 20.00
    var closingTime = getColumnText($this, 4);
    var closing = combineDateAndTime(date, moment(closingTime, 'HH.mm'));
    // "Paikka"
    var location = getColumnText($this, 6);
    return {
      date: formatDate(date),
      start_time: formatTime(start),
      end_time: formatTime(end),
      // TODO closing: formatTime(closing),
      organizer: 'Helsingin Suunnistajat',
      info: 'Iltarastit ' + location,
      address: location, // TODO?
      // TODO latitude, longitude
      url: 'http://helsinginsuunnistajat.fi/iltarastit/iltarastikalenteri/'
    };
  });
  foo = foo.filter(function() {
    return this;
  });
  return foo.get();
}

var targets = [
  {
    id: 'iltarastit',
    url: 'http://helsinginsuunnistajat.fi/iltarastit/iltarastikalenteri/',
    parser: parseIltarastit2015
  }
];

function checkArgCountOrDie() {
  if(process.argv.length != 3) {
      console.log('Wrong number of arguments.');
      console.log('Usage : node scrape.js <target>');
      console.log('E.g.  : node scrape.js iltarastit');
      process.exit(1);
  }
}

function getTargetOrDie(id) {
  var target = _.find(targets, function(target) { return target.id === id });
  if(!target) {
    console.log('Target not found:', id);
    process.exit(1);
  }
  return target;
}

function downloadTargetBodyOrDie(target, callback) {
  request(target.url, function (error, response, body) {
    if (error || response.statusCode != 200) {
      console.log('Request failed. Url:', target.url);
      process.exit(1);
    }
    callback(body);
  });

}

checkArgCountOrDie();
var target = getTargetOrDie(process.argv[2]);
downloadTargetBodyOrDie(target, function(body) {
  var parsed = target.parser(body);
  console.log(JSON.stringify(parsed));
});
