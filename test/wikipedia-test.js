'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var wikipedia = require('../lib').wikipedia;

chai.use(chaiAsPromised);
//console.log(assert);

// wikipedia.search('en', 'Enichioi')
//   .then(function(body) {
//     console.log('body', body);
//   })
//   .catch(function(e) {
//     console.log('error', e);
//   });

describe('Wikipedia API', function() {
  it('#.search() - rejected', function() {
    assert.isRejected(wikipedia.api.search());
  });
  it('#.search("en") - rejected', function() {
    assert.isRejected(wikipedia.api.search('en'));
  });
  it('#.search("en", "Enichioi") - fulfilled', function() {
    assert.isFulfilled(wikipedia.api.search('en', 'Enichioi'));
  });
  it('#.openSearch() - rejected', function() {
    assert.isRejected(wikipedia.api.search());
  });
  it('#.openSearch("en") - rejected', function() {
    assert.isRejected(wikipedia.api.search('en'));
  });
  it('#.openSearch("en", "Enichioi") - fulfilled', function() {
    assert.isFulfilled(wikipedia.api.search('en', 'Enichioi'));
  });
});


describe('Wikipedia Entity', function() {
  it('#.explore() - rejected', function() {
    assert.isRejected(wikipedia.entity.explore());
  });
  it('#.explore("en") - rejected', function() {
    assert.isRejected(wikipedia.entity.explore('en'));
  });
  it('#.explore("en", 26697539) - fulfilled', function() {
    assert.isFulfilled(wikipedia.entity.explore('en', 26697539));
  });
  it('#.explore("en", 26697539) - page id', function() {
    return wikipedia.entity.explore('en', 26697539).then(function(page) {
      assert.equal(26697539, page.id);
      //console.log(page);
    });
  });
  it('#.explore("ro", "România") - page title', function() {
    return wikipedia.entity.explore('ro', 'România').then(function(page) {
      assert.equal('România', page.title);
      // console.log(page);
    });
  });
  it('#.info("en", "barack obama")', function() {
    return wikipedia.entity.info('en', 'barack obama').then(function(info) {
      assert.equal('Barack Obama', info.title);
    });
  });
  it('#.info("ru", "barack obama")', function() {
    return wikipedia.entity.info('ru', 'barack obama').then(function(info) {
      assert.equal('Barack Obama', info.title);
    });
  });
  it('#.info("ru", "Обама") - found', function() {
    return wikipedia.entity.info('ru', 'Обама').then(function(info) {
      assert.equal('Обама, Барак', info.title);
    });
  });
  it('#.info("ru", "Обама", false) - undefined', function() {
    return wikipedia.entity.info('ru', 'Обама', false).then(function(info) {
      assert.equal(undefined, info);
    });
  });
  it('#.info("ro", "ue") - found UE not UEFA', function() {
    return wikipedia.entity.info('ro', 'ue').then(function(info) {
      assert.equal('UE', info.title);
      assert.equal(undefined, info.description);
    });
  });

  it('#.search("en", "barack obama")', function() {
    return wikipedia.entity.search('en', 'barack obama').then(function(info) {
      assert.equal('Barack Obama', info.title);
    });
  });
  it('#.search("ru", "barack obama")', function() {
    return wikipedia.entity.search('ru', 'barack obama').then(function(info) {
      assert.equal('Обама, Барак', info.title);
    });
  });
  it('#.search("ru", "Обама") - found', function() {
    return wikipedia.entity.search('ru', 'Обама').then(function(info) {
      assert.equal(undefined, info);
    });
  });
  it('#.search("ro", "ue") - not found UE', function() {
    return wikipedia.entity.search('ro', 'ue').then(function(info) {
      assert.equal(undefined, info);
    });
  });
  it('#.search("ro", "enichioi cantemir")', function() {
    return wikipedia.entity.search('ro', 'enichioi cantemir').then(function(info) {
      assert.equal('Enichioi, Cantemir', info.title);
    });
  });
});
