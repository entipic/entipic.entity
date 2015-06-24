var core = require('entipic.core');
var Promise = core.Promise;
var _ = core._;
var external = module.exports;
var api = require('./api.js');
var utils = require('../utils');

external.exploreById = function(lang, id) {
  return external.explore(lang, 'pageids', id);
};

external.exploreByTitle = function(lang, title) {
  return external.explore(lang, 'titles', title);
};

external.explore = function(lang, name, value) {
  if (_.isNumber(name)) {
    value = name;
    name = 'pageids';
  } else if (['pageids', 'titles'].indexOf(name) < 0) {
    value = name;
    name = 'titles';
  }

  var options = {
    prop: 'langlinks|redirects|info',
    lllimit: 'max',
    rdlimit: 'max'
  };

  options[name] = value;

  return api.query(lang, options)
    .then(utils.parseWikiQuery)
    .then(function(data) {
      if (data.pages.length !== 1)
        return Promise.reject(new Error('Not found topic ' + name + '=' + value));
      return data.pages[0];
    })
    .then(function(page) {
      return api.search(lang, page.title)
        .then(utils.parseWikiSearch)
        .then(function(results) {
          if (results.length > 0) {
            page.description = results[0].description;
            page.url = page.url || results[0].url;
          }
          return page;
        });
    });
};

external.info = function(lang, title) {
  return api.search(lang, title)
    .then(utils.parseWikiSearch)
    .then(function(results) {
      if (results.length < 1)
        return Promise.reject(new Error('Not found page title=' + title));
      return results[0];
    });
};
