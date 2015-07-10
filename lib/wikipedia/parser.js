'use strict';

var core = require('entipic.core');
var _ = core._;
var external = module.exports;

function parseQueryPage(page) {
	if (page.ns !== 0) {
		return null;
	}
	return {
		id: page.pageid,
		title: page.title
	};
}


external.parseWikiOpenSearch = function(data) {
	if (_.isString(data)) {
		data = JSON.parse(data);
	}
	var result = [];
	for (var i = 0; i < data[1].length; i++) {
		result.push({
			title: data[1][i],
			description: data[2][i],
			url: data[3][i]
		});
	}
	return result;
};

external.parseWikiQuerySearch = function(data) {
	if (_.isString(data)) {
		data = JSON.parse(data);
	}

	return data.query.search;
};

external.parseWikiQuery = function(data) {
	var result = {
		pages: []
	};

	if (_.isString(data)) {
		data = JSON.parse(data);
	}

	if (!data.query || !data.query.pages) {
		return result;
	}

	var pages = data.query.pages;

	function createLanglinks(p, page) {
		p.langlinks = [];
		page.langlinks.forEach(function(ll) {
			p.langlinks.push({
				lang: ll.lang,
				title: ll.title || ll['*']
			});
		});
	}

	function createRedirects(p, page) {
		p.redirects = [];
		page.redirects.forEach(function(rd) {
			var rp = parseQueryPage(rd);
			if (!rp) {
				return;
			}
			p.redirects.push(rp);
		});
	}

	for (var pageid in pages) {
		var page = pages[pageid];
		var p = parseQueryPage(page);
		if (!p) {
			continue;
		}
		result.pages.push(p);
		if (page.redirects) {
			createRedirects(p, page);
		}
		if (page.langlinks) {
			createLanglinks(p, page);
		}
	}

	return result;
};
