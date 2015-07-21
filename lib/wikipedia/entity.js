'use strict';

var core = require('entipic.core');
var Promise = core.Promise;
var _ = core._;
var external = module.exports;
var api = require('./api.js');
var utils = require('../utils');
var parser = require('./parser');
var info = require('./entity/info');
var search = require('./entity/search');
var internal = {};

external.info = info;
external.search = search;

external.explore = function(lang, name) {
	return internal.explore(lang, name);
};

external.type = function(title) {
	return utils.request({
			url: 'http://dbpedia.org/data/' + title.replace(/ /g, '_') + '.json',
			timeout: 8 * 1000
		})
		.then(function(body) {
			body = body || '';
			if (body.indexOf('http://dbpedia.org/ontology/Organisation') > 0) {
				return 'group';
			}
			if (body.indexOf('http://dbpedia.org/ontology/foundingDate') > 0) {
				if (body.indexOf('http://dbpedia.org/ontology/PopulatedPlace') > 0) {
					return 'place';
				}
				return 'group';
			}
			if (body.indexOf('http://dbpedia.org/ontology/Person') > 0) {
				return 'person';
			}
			if (body.indexOf('http://schema.org/Person') > 0) {
				return 'person';
			}
			if (body.indexOf('http://xmlns.com/foaf/0.1/Person') > 0) {
				return 'person';
			}
			if (body.indexOf('http://dbpedia.org/ontology/Place') > 0) {
				return 'place';
			}
			if (body.indexOf('http://dbpedia.org/ontology/PopulatedPlace') > 0) {
				return 'place';
			}
			if (body.indexOf('http://dbpedia.org/class/yago/GeoclassPopulatedPlace') > 0) {
				return 'place';
			}
			if (body.indexOf('http://dbpedia.org/class/yago/CommunesOf') > 0) {
				return 'place';
			}
		});
};

internal.explore = function(lang, name) {
	var value = name;
	if (_.isNumber(name)) {
		name = 'pageids';
	} else {
		name = 'titles';
	}

	var options = {
		prop: 'langlinks|redirects|info',
		lllimit: 'max',
		rdlimit: 'max',
		redirects: 'true'
	};

	options[name] = value;

	if (!value) {
		return Promise.reject(new Error('Invalid entity name=' + value));
	}

	return api.query(lang, options)
		.then(parser.parseWikiQuery)
		.then(function(data) {
			if (data.pages.length !== 1) {
				return Promise.reject(new Error('Not found entity ' + name + '=' + value));
			}
			return data.pages[0];
		});
};
