var Bacon = require("baconjs");
var $ = require("jquery");
var bjq = require("bacon.jquery");
var Pikaday = require('pikaday');
var moment = require('moment');
var _ = require('lodash');

module.exports = {
  init: function () {
    var uiDateFormat = 'D.M.YYYY';
    var apiDateFormat = 'YYYY-MM-DD';

    var firstDateField = $('#first-date');
    var lastDateField = $('#last-date');
    var today = moment();
    var firstDatePicker = new Pikaday({
      field: firstDateField[0],
      format: uiDateFormat
    });
    var lastDatePicker = new Pikaday({
      field: lastDateField[0],
      format: uiDateFormat
    });
    var getEventTargetValue = function(event) {
      return event.target.value;
    }
    var pickerDateStringToMoment = function(dateStr) {
      return moment(dateStr, uiDateFormat);
    }
    var pickerElementToStream = function(fieldElement) {
      return fieldElement.asEventStream('change').map(getEventTargetValue).map(pickerDateStringToMoment);
    }

    var firstDate = pickerElementToStream(firstDateField);
    var lastDate = pickerElementToStream(lastDateField);
    var terms = Bacon.combineTemplate({
      firstDate: firstDate,
      lastDate: lastDate
    });
    var events = terms.flatMapLatest(function(terms) {
      var query = '/api/events?firstDate=' + terms.firstDate.format(apiDateFormat) + '&lastDate=' + terms.lastDate.format(apiDateFormat);
      return Bacon.fromPromise($.ajax(query));
    }).mapError("Search fail");

    events.onValue(function(events) {
      var compiled = _.template('<li><%= info %> (<%= organizer %>)</li>');
      var foo = _.map(events, compiled).join('');
      $('ul#events').html(foo);
    });

    firstDatePicker.setMoment(today);
    lastDatePicker.setMoment(today.add(2, 'weeks'));
  }
};

$(function() {
  module.exports.init();
});
