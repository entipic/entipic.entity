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

external.parseWikiSearch = function(data) {
  if (_.isString(data)) data = JSON.parse(data);
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

external.parseWikiQuery = function(data) {
  var result = {
    pages: []
  };

  if (_.isString(data)) data = JSON.parse(data);

  if (!data.query || !data.query.pages) return result;

  var pages = data.query.pages;

  for (var pageid in pages) {
    var page = pages[pageid];
    var p = parseQueryPage(page);
    if (!p) continue;
    result.pages.push(p);
    if (page.redirects) {
      p.redirects = [];
      page.redirects.forEach(function(rd) {
        var rp = parseQueryPage(rd);
        if (!rp) return;
        p.redirects.push(rp);
      });
    }
    if (page.langlinks) {
      p.langlinks = [];
      page.langlinks.forEach(function(ll) {
        p.langlinks.push({
          lang: ll.lang,
          title: ll.title || ll['*']
        });
      });
    }
  }

  return result;
};


function parseQueryPage(page) {
  if (page.ns !== 0) return null;
  return {
    id: page.pageid,
    title: page.title
  };
}
