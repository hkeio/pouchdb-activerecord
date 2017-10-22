let Model = require('./../').Model;
let assert = require('assert');

describe('Model', function () {

  it('should be instance of Model', function () {
    let model = new Model();
    assert.equal(model instanceof Model, true);
    assert.equal(model.className, 'Model');
    assert.equal(typeof model.setAttribute, 'function');
    assert.equal(typeof model.setAttributes, 'function');
    assert.equal(typeof model.getAttribute, 'function');
    assert.equal(JSON.stringify(model.attributes), '{}');
  });

});
