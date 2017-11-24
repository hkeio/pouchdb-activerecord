let Foo = require('./Foo').Foo;
let Bar = require('./Bar').Bar;
let Foo_Bar = require('./Foo_Bar').Foo_Bar;
let ActiveQuery = require('./../').ActiveQuery;
let FooChild = require('./FooChild').FooChild;

let assert = require('assert');
let _ = require('lodash');

describe('Foo', () => {

  let model, model2;

  it('init model', () => {
    model = new Foo({ foo: 'bar', goo: 1 });
    assert.equal(JSON.stringify(model.attributes), '{"foo":"bar","goo":1}');
  });

  it('save()', (done) => {
    model.save()
      .then(() => {
        assert.equal(model.isNewRecord, false);
        done();
      });

  });

  it('save()', (done) => {
    Foo.findOne(model.id)
      .then((res) => {
        assert.equal(res instanceof Foo, true);
        assert.equal(JSON.stringify(model.attributes), JSON.stringify(res.attributes));
        done();
      });
  });

  it('2nd model save()', (done) => {
    model2 = new Foo({ foo: 'baz', goo: 2 });
    model2
      .save()
      .then((res) => done());
  });

  it('findAll()', (done) => {
    Foo.findAll()
      .then((res) => {
        assert.equal(res.length, 2);
        let _model1 = _.find(res, { _id: model.id });
        let _model2 = _.find(res, { _id: model2.id });
        assert.equal(_model1 instanceof Foo, true);
        assert.equal(_model1.foo, 'bar');
        assert.equal(_model2 instanceof Foo, true);
        assert.equal(_model2.foo, 'baz');
        done();
      });
  });

  it('findOne()', (done) => {
    Foo.findOne({ foo: 'baz' })
      .then((res) => {
        assert.equal(res instanceof Foo, true);
        assert.equal(res.foo, 'baz');
        done();
      });
  });

  it('findAll({ goo: { $gt: 1 } })', (done) => {
    Foo.findAll({ goo: { $gt: 1 } })
      .then((res) => {
        assert.equal(res.length, 1);
        assert.equal(res[0].foo, 'baz');
        done();
      });
  });

  it('find() should return ActiveQuery', (done) => {
    let query = Foo.find();
    assert.equal(query instanceof ActiveQuery, true);
    done();
  });

  it('model.fooChild should be null', (done) => {
    model.fooChild
      .then((res) => {
        assert.equal(res, null);
        done();
      });
  });

  it('model.fooChild should not be null', (done) => {
    let child = new FooChild({ foo_id: model.id });
    child.save()
      .then((res) => {
        assert.equal(JSON.stringify(res), JSON.stringify(child));
        done();
      });
  });

  it('model.bars should not be 0', (done) => {
    model.bars
      .then((res) => {
        assert.equal(res.length, 0);
        done();
      });
  });

  it('model.bars should not be 2', (done) => {
    let bar1 = new Bar({ boo: 'aaa' });
    let bar2 = new Bar({ boo: 'bbb' });
    let bar3 = new Bar({ boo: 'ccc' });

    let relation1, relation2, relation3;

    bar1.save()
      .then(() => bar2.save())
      .then(() => bar3.save())
      .then(() => {

        relation1 = new Foo_Bar({ foo_id: model.id, bar_id: bar1.id });
        relation2 = new Foo_Bar({ foo_id: model.id, bar_id: bar2.id });
        relation3 = new Foo_Bar({ foo_id: model2.id, bar_id: bar3.id });

        return relation1.save();
      })
      .then(() => relation2.save())
      .then(() => relation3.save())
      .then(() => model.bars)
      .then((res) => {
        assert.equal(res.length, 2);
        assert.equal(res[0] instanceof Bar, true);
        done();
      });
  });

});
