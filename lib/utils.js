var request = require('request');
var core = require('entipic.core');
var Promise = core.Promise;
var _ = core._;

var external = module.exports;

external.request = function(options) {
  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200)
        return reject(error || new Error('Invalid status code: ' + response.statusCode));
      resolve(body);
    });
  });
};

external.isAbbr = function(name) {
  var MIN_LENGTH = 8;

  return external.isOneWord(name) && name.length < MIN_LENGTH;
};

external.isShort = function(name) {
  var MIN_LENGTH = 10;

  return external.isOneWord(name) && name.length < MIN_LENGTH;
};

external.isOneWord = function(name) {
  var words = core.text.toWords(name);
  return words.length === 1;
};
