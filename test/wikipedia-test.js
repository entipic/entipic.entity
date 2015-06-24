var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
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
});


describe('Wikipedia Page', function() {
  it('#.explore() - rejected', function() {
    assert.isRejected(wikipedia.page.explore());
  });
  it('#.explore("en") - rejected', function() {
    assert.isRejected(wikipedia.page.explore('en'));
  });
  it('#.explore("en", 26697539) - fulfilled', function() {
    assert.isFulfilled(wikipedia.page.explore('en', 26697539));
  });
  it('#.explore("en", 26697539) - page id', function() {
    return wikipedia.page.explore('en', 26697539).then(function(page) {
      assert.equal(26697539, page.id);
      //console.log(page);
    });
  });
  it('#.info("en", "barack obama")', function() {
    return wikipedia.page.info('en', 'barack obama').then(function(info) {
      assert.equal('Barack Obama', info.title);
    });
  });
  it('#.info("ru", "barack obama")', function() {
    return wikipedia.page.info('ru', 'barack obama').then(function(info) {
      assert.equal('Barack Obama', info.title);
    });
  });
  it('#.info("ru", "Обама")', function() {
    return wikipedia.page.info('ru', 'Обама').then(function(info) {
      assert.equal('Обама, Барак', info.title);
    });
  });
});
