let ActiveQuery = require('./../').ActiveQuery;
let Foo = require('./Foo').Foo;
let assert = require('assert');

describe('ActiveQuery', () => {

  it('should throw NoModelException', () => {
    try {
      let model = new ActiveQuery();
    } catch (e) {
      assert.equal(e instanceof Error, true);
      assert.equal(e.message, 'NoModelException');
    }
  });

  it('should be instance of ActiveRecord', () => {
    let foo = new Foo();
    let model = new ActiveQuery(foo);
    assert.equal(model instanceof ActiveQuery, true);
    assert.equal(typeof model.fields, 'function');
    assert.equal(typeof model.sort, 'function');
    assert.equal(typeof model.limit, 'function');
    assert.equal(typeof model.where, 'function');
    assert.equal(typeof model.one, 'function');
    assert.equal(typeof model.all, 'function');
  });

});
