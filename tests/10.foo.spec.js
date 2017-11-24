let Foo = require('./Foo').Foo;
let ActiveQuery = require('./../').ActiveQuery;
let FooChild = require('./FooChild').FooChild;

let assert = require('assert');
let _ = require('lodash');

describe('Foo', () => {

  let model, id1, id2;

  it('init model', () => {
    model = new Foo({ foo: 'bar', goo: 1 });
    assert.equal(JSON.stringify(model.attributes), '{"foo":"bar","goo":1}');
  });

  it('save()', (done) => {
    model.save()
      .then(() => {
        assert.equal(model.isNewRecord, false);
        id1 = model.id;
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
    new Foo({ foo: 'baz', goo: 2 }).save()
      .then((res) => {
        id2 = res.id;
        done();
      });
  });

  it('findAll()', (done) => {
    Foo.findAll()
      .then((models) => {
        assert.equal(models.length, 2);
        let model1 = _.find(models, { _id: id1 });
        let model2 = _.find(models, { _id: id2 });
        assert.equal(model1 instanceof Foo, true);
        assert.equal(model1.foo, 'bar');
        assert.equal(model2 instanceof Foo, true);
        assert.equal(model2.foo, 'baz');
        done();
      });
  });

  it('findOne()', (done) => {
    Foo.findOne({ foo: 'baz' })
      .then((model3) => {
        assert.equal(model3 instanceof Foo, true);
        assert.equal(model3.foo, 'baz');
        done();
      });
  });

  it('findAll({ goo: { $gt: 1 } })', (done) => {
    Foo.findAll({ goo: { $gt: 1 } })
      .then((models) => {
        assert.equal(models.length, 1);
        assert.equal(models[0].foo, 'baz');
        done();
      });
  });

  it('find() should return ActiveQuery', (done) => {
    let query = Foo.find();
    assert.equal(query instanceof ActiveQuery, true);
    // .then((models) => {
    //   assert.equal(models.length, 1);
    //   assert.equal(models[0].foo, 'baz');
    done();
    // });
  });

  it('model.foo should have length 0', (done) => {
    model.fooChild.all()
      .then((children) => {
        assert.equal(children.length, 0);
        done();
      });
  });

  it('model.foo should have length 1', (done) => {
    let child = new FooChild({ foo_id: model.id });
    child.save()
      .then((saved) => {
        assert.equal(JSON.stringify(saved), JSON.stringify(child));
        return FooChild.findAll()
      })
      .then((children) => {
        assert.equal(JSON.stringify(children[0]), JSON.stringify(child));
        return model.fooChild.all()
      })
      .then((children) => {
        assert.equal(children.length, 1);
        assert.equal(children[0].id, child.id);
        done();
      });
  });

});