let Model = require('./../').Model;
let ModelAttribute = require('./../').ModelAttribute;
let assert = require('assert');

describe('Model', function () {

  let model2;

  it('should be instance of Model', function () {
    let model = new Model();
    assert.equal(model instanceof Model, true);

    // static methods
    assert.equal(typeof Model.defineAttributes, 'function');

    // static getter
    assert.equal(Model.className, 'Model');

    // non-static methods
    assert.equal(typeof model.setAttribute, 'function');
    assert.equal(typeof model.setAttributes, 'function');
    assert.equal(typeof model.getAttribute, 'function');

    // non-static getter
    assert.equal(JSON.stringify(model.attributes), '{}');
    assert.equal(model.className, 'Model');
  });

  it('should define attributes', () => {
    Model.defineAttributes([
      new ModelAttribute('foo')
    ]);

    let values = { foo: 'bar' };
    model2 = new Model(values);
    assert.equal(JSON.stringify(model2.attributes), JSON.stringify(values));
  });

  it('should set attribute', () => {
    model2.setAttribute('foo', 'baz');
    assert.equal(JSON.stringify(model2.attributes), JSON.stringify({ foo: 'baz' }));
    assert.equal(model2.foo, 'baz');
    assert.equal(model2.getAttribute('foo'), 'baz');
  });

});
