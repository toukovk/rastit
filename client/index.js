var Bacon = require("baconjs");
var $ = require("jquery");
var bjq = require("bacon.jquery");
var Pikaday = require('pikaday');
var moment = require('moment');

module.exports = {
  init: function () {
    var firstDateField = $('#first-date');
    var lastDateField = $('#last-date');
    var today = moment();
    var firstDatePicker = new Pikaday({
      field: firstDateField[0],
      format: 'D.M.YYYY'
    });
    var lastDatePicker = new Pikaday({
      field: lastDateField[0],
      format: 'D.M.YYYY'
    });
    var getEventTargetValue = function(event) {
      return event.target.value;
    }
    var pickerDateStringToMoment = function(dateStr) {
      return moment(dateStr, 'D.M.YYYY');
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

    terms.log('Terms');

    firstDatePicker.setMoment(today);
    lastDatePicker.setMoment(today.add(2, 'weeks'));
  }
};

$(function() {
  module.exports.init();
});
