let Foo = require('./Foo').Foo;
let assert = require('assert');
let _ = require('lodash');

describe('Foo', function () {

  it('should not fail', function (next) {
    let id1, id2;

    Foo.findAll()
      .then((asd) => {
        console.log(asd);
      })

    let model = new Foo({ foo: 'bar', goo: 1 });
    assert.equal(model instanceof Foo, true, '#1.1');
    assert.equal(model.className, 'Foo', '#1.2');
    assert.equal(typeof model.setAttribute, 'function', '#1.3');
    assert.equal(typeof model.setAttributes, 'function', '#1.4');
    assert.equal(typeof model.getAttribute, 'function', '#1.5');
    assert.equal(typeof Foo.findOne, 'function', '#1.6');
    assert.equal(typeof Foo.findAll, 'function', '#1.7');
    assert.equal(model.isNewRecord, true, '#1.8');
    assert.equal(JSON.stringify(model.attributes), '{"foo":"bar","goo":1}', '#1.9');

    model.save()
      .then(() => {
        assert.equal(model.isNewRecord, false, '#2.1');
        id1 = model.id;
        return Foo.findOne(model.id);
      })
      .then((model2) => {
        assert.equal(model2 instanceof Foo, true, '#3.1');
        assert.equal(JSON.stringify(model.attributes), JSON.stringify(model2.attributes), '#3.2');

        return new Foo({ foo: 'baz', goo: 2 }).save();
      })
      .then((res) => {
        id2 = res.id;
        return Foo.findAll();
      })
      .then((models) => {
        assert.equal(models.length, 2, '#4.1');
        let model1 = _.find(models, { _id: id1 });
        let model2 = _.find(models, { _id: id2 });
        assert.equal(model1 instanceof Foo, true, '#4.2');
        assert.equal(model1.foo, 'bar', '#4.3');
        assert.equal(model2 instanceof Foo, true, '#4.4');
        assert.equal(model2.foo, 'baz', '#4.5');

        return Foo.findOne({ foo: 'baz' });
      })
      .then((model3) => {
        assert.equal(model3 instanceof Foo, true, '#5.1');
        assert.equal(model3.foo, 'baz', '#5.2');

        return Foo.findAll({ goo: { $gt: 1 } });
      })
      .then((models) => {
        assert.equal(models.length, 1, '#6.1');
        assert.equal(models[0].foo, 'baz', '#6.2');
        next();
      });
  });

});
