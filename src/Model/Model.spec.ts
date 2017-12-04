import { equal } from 'assert';

import { Model, ModelAttribute } from './Model';

describe('Model', () => {

  let model2;

  it('should be instance of Model', () => {
    let model = new Model();
    equal(model instanceof Model, true);

    // static methods
    equal(typeof Model.defineAttributes, 'function');

    // static getter
    equal(Model.className, 'Model');

    // non-static methods
    equal(typeof model.setAttribute, 'function');
    equal(typeof model.setAttributes, 'function');
    equal(typeof model.getAttribute, 'function');

    // non-static getter
    equal(JSON.stringify(model.attributes), '{}');
    equal(model.className, 'Model');
  });

  it('should define attributes', () => {
    Model.defineAttributes([
      new ModelAttribute('foo')
    ]);

    let values = { foo: 'bar' };
    model2 = new Model(values);
    equal(JSON.stringify(model2.attributes), JSON.stringify(values));
  });

  it('should set attribute', () => {
    model2.setAttribute('foo', 'baz');
    equal(JSON.stringify(model2.attributes), JSON.stringify({ foo: 'baz' }));
    equal(model2.foo, 'baz');
    equal(model2.getAttribute('foo'), 'baz');
  });

});
