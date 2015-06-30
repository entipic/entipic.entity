var core = require('entipic.core');
var Promise = core.Promise;
var _ = core._;
var external = module.exports;
var api = require('./api.js');
var utils = require('../utils');

external.exploreById = function(lang, id) {
  return external.explore(lang, id);
};

external.exploreByTitle = function(lang, title) {
  return external.explore(lang, title);
};

external.explore = function(lang, name) {
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

  return api.query(lang, options)
    .then(utils.parseWikiQuery)
    .then(function(data) {
      if (data.pages.length !== 1)
        return Promise.reject(new Error('Not found entity ' + name + '=' + value));
      return data.pages[0];
    })
    .then(function(page) {
      if (page.description && page.description.length > 10) return page;
      return external.info(lang, page.title)
        .then(function(info) {
          if (info) {
            page.description = info.description;
            page.url = info.url;
          }
          return page;
        })
        .catch(function() {
          return page;
        });
    });
};

external.info = function(lang, title) {
  return api.search(lang, title)
    .then(utils.parseWikiSearch)
    .then(function(results) {
      if (results.length < 1 || results[0].description[results[0].description.length - 1] === ':') {
        //return Promise.reject(new Error('Not found page title=' + title));
        return null;
      }

      return results[0];
    });
};

external.type = function(title, lang) {
  return utils.request({
      url: 'http://dbpedia.org/data/' + title.replace(/ /g, '_') + '.json',
      timeout: 5 * 1000
    })
    .then(function(body) {
      body = body || '';
      if (body.indexOf('http://dbpedia.org/ontology/Organisation') > 0) return 'group';
      if (body.indexOf('http://dbpedia.org/ontology/Person') > 0) return 'person';
      if (body.indexOf('http://schema.org/Person') > 0) return 'person';
      if (body.indexOf('http://xmlns.com/foaf/0.1/Person') > 0) return 'person';
      if (body.indexOf('http://dbpedia.org/ontology/Place') > 0) return 'place';
      if (body.indexOf('http://dbpedia.org/ontology/PopulatedPlace') > 0) return 'place';
      if (body.indexOf('http://dbpedia.org/class/yago/GeoclassPopulatedPlace') > 0) return 'place';
      if (body.indexOf('http://dbpedia.org/class/yago/CommunesOf') > 0) return 'place';
    });
};