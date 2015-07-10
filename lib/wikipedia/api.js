'use strict';

var core = require('entipic.core');
var Promise = core.Promise;
var _ = core._;
var external = module.exports;
var wikiApi = require('./api.json');
var utils = require('../utils');

var OPTIONS = {
	qs: {
		format: 'json'
	},
	headers: {
		'User-Agent': 'Entipic'
	}
};


/**
 * Create request options: url, qs, headers
 */
function createOptions(lang, data, args) {
	var options = {
		qs: _.defaults(data.qs || {}, OPTIONS.qs),
		headers: OPTIONS.headers
	};
	var params = {};

	if (args.length === 1 && _.isPlainObject(args[0])) {
		params = args[0];
	} else {
		for (var i = 0; i < data.params.length; i++) {
			var name = data.params[i];
			params[name] = args[i];
		}
	}

	for (var prop in params) {
		var value = params[prop];
		prop = prop.toLowerCase();
		if (_.isString(value) || _.isNumber(value)) {
			options.qs[prop] = value;
		}
	}

	options.url = 'https://' + lang + '.wikipedia.org/w/api.php';

	return options;
}

/**
 * Create a API method
 */
function createMethod(name, data) {
	external[name] = function() {
		var args = Array.prototype.slice.call(arguments);
		var lang = args[0];
		if (!_.isString(lang)) {
			return Promise.reject(new Error('Invalid first API param: lang'));
		}
		if (data.params && data.params.length > args.length - 1) {
			return Promise.reject(new Error('Invalid API params'));
		}
		var options = createOptions(lang, data, args.slice(1));
		//console.log('options', options);
		return utils.request(options);
	};
}

/**
 * Build wikipedia API
 */
for (var name in wikiApi) {
	createMethod(name, wikiApi[name]);
}
