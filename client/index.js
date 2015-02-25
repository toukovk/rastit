var Bacon = require("baconjs");
var Pikaday = require('pikaday');
var domready = require('domready');

module.exports = {
  init: function () {
    var field = document.getElementById('datepicker');
    var picker = new Pikaday({ field: field });
  }
};

domready(function() {
  module.exports.init();
});
