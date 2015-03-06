var Bacon = require("baconjs");
var $ = require("jquery");
var bjq = require("bacon.jquery");
var Pikaday = require('pikaday');

module.exports = {
  init: function () {
    var firstDateField = $('#datepicker');
    var defaultDate = new Date();
    var picker = new Pikaday({
      field: firstDateField[0],
      format: 'D.M.YYYY'
    });

    firstDateField.asEventStream('change').onValue(function(event) {
      console.log('Date value changed to', event.target.value);
    });

    picker.setDate(defaultDate);
  }
};

$(function() {
  module.exports.init();
});
