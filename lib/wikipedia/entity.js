var core = require('entipic.core');
var Promise = core.Promise;
var _ = core._;
var external = module.exports;
var api = require('./api.js');
var utils = require('../utils');
var parser = require('./parser');
var internal = {};

external.exploreById = function(lang, id) {
  return external.explore(lang, id);
};

external.exploreByTitle = function(lang, title) {
  return external.explore(lang, title);
};

external.explore = function(lang, name) {
  return internal.explore(lang, name);
};

external.info = function(lang, title, first) {
  return internal.info(lang, title, first);
};

external.type = function(title, lang) {
  return utils.request({
      url: 'http://dbpedia.org/data/' + title.replace(/ /g, '_') + '.json',
      timeout: 8 * 1000
    })
    .then(function(body) {
      body = body || '';
      if (body.indexOf('http://dbpedia.org/ontology/Organisation') > 0) return 'group';
      if (body.indexOf('http://dbpedia.org/ontology/foundingDate') > 0) return 'group';
      if (body.indexOf('http://dbpedia.org/ontology/Person') > 0) return 'person';
      if (body.indexOf('http://schema.org/Person') > 0) return 'person';
      if (body.indexOf('http://xmlns.com/foaf/0.1/Person') > 0) return 'person';
      if (body.indexOf('http://dbpedia.org/ontology/Place') > 0) return 'place';
      if (body.indexOf('http://dbpedia.org/ontology/PopulatedPlace') > 0) return 'place';
      if (body.indexOf('http://dbpedia.org/class/yago/GeoclassPopulatedPlace') > 0) return 'place';
      if (body.indexOf('http://dbpedia.org/class/yago/CommunesOf') > 0) return 'place';
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

  if (!value) return Promise.reject('Invalid entity name=' + value);

  return api.query(lang, options)
    .then(parser.parseWikiQuery)
    .then(function(data) {
      if (data.pages.length !== 1)
        return Promise.reject(new Error('Not found entity ' + name + '=' + value));
      return data.pages[0];
    })
    .then(function(page) {
      // has info
      if (page.url) return page;
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

internal.info = function(lang, title, first) {
  var isOneWord = utils.isOneWord(title);
  first = core.util.isNull(first) ? true : first;

  function getInfo() {
    if (isOneWord) {
      var list;
      var uTitle = title.toUpperCase();
      return internal.search(lang, title)
        .then(function(results) {
          list = results;
          return internal.findInfoLength(list, title);
        })
        .then(function(info) {
          if (!info && title !== uTitle) {
            return internal.searchLength(lang, uTitle, first);
          }
        })
        .then(function(info) {
          if (!info && list && list.length > 0 && first) {
            info = list[0];
            // example: `chi` != `Chiha`
            if (!utils.isOneWord(info.title)) {
              return info;
            }
          }
          return info;
        });
    }
    return internal.search(lang, title).then(internal.first);
  }

  return getInfo().then(internal.validateInfo);
};

internal.first = function(list) {
  if (list && list.length > 0) return list[0];
  return null;
};

internal.validateInfo = function(info) {
  if (!info) return info;
  if (!info.description || core.text.endsWith(info.description, ':')) {
    delete info.description;
  }
  return info;
};

internal.findInfoLength = function(list, title, first) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].title.length === title.length) return list[i];
  }
  if (first && list.length > 0) return list[0];
};

internal.searchLength = function(lang, title, first) {
  return internal.search(lang, title).then(function(list) {
    return internal.findInfoLength(list, title, first);
  });
};

internal.search = function(lang, title) {
  return api.search(lang, title).then(parser.parseWikiSearch);
};
