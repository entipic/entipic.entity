'use strict';

// var core = require('entipic.core');
// var Promise = core.Promise;
// var _ = core._;
var api = require('../api.js');
var parser = require('../parser.js');
var internal = {};

module.exports = function(lang, title) {
	return internal.search(lang, title);
};

internal.search = function(lang, title) {
	return api.search(lang, title).then(parser.parseWikiSearch)
		.then(function(results) {
			return internal.identify(lang, title, results);
		});
};

internal.identify = function(lang, title, results) {
	if (!results || results.length === 0) {
		return null;
	}
};
