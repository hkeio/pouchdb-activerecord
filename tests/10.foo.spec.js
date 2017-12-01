let Foo = require('./Foo').Foo;
let Bar = require('./Bar').Bar;
let Foo_Bar = require('./Foo_Bar').Foo_Bar;
let ActiveQuery = require('./../').ActiveQuery;
let FooChild = require('./FooChild').FooChild;

let assert = require('assert');
let _ = require('lodash');
let PouchDBMemory = require('pouchdb-adapter-memory');

console.log(PouchDBMemory);

describe('Foo', () => {

  Foo.config = { adapter: 'memory', plugins: [PouchDBMemory] };
  Bar.config = { adapter: 'memory', plugins: [PouchDBMemory] };
  Foo_Bar.config = { adapter: 'memory', plugins: [PouchDBMemory] };
  FooChild.config = { adapter: 'memory', plugins: [PouchDBMemory] };

  let model = new Foo({ foo: 'bar', goo: 1 });
  let model2;

  it('init model', () => {
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

  it('model.fooChild should be 0', (done) => {
    model.fooChildren
      .then((res) => {
        assert.equal(res.length, 0);
        done();
      });
  });

  it('model.fooChild should be 1', (done) => {
    let child = new FooChild();
    model.addFooChildren(child)
      .then(() => model.fooChildren)
      .then((res) => {
        assert.equal(res.length, 1);
        assert.equal(JSON.stringify(res[0]), JSON.stringify(child));
        done();
      });
  });

  it('model.bars should be 0', (done) => {
    model.bars
      .then((res) => {
        assert.equal(res.length, 0);
        done();
      });
  });

  it('model.bars should be 4', (done) => {
    let bar = new Bar({ boo: 'ddd' });
    bar.save()
      .then(() => model.addBar({ boo: 'aaa' }))
      .then(() => model.addBar(new Bar({ boo: 'bbb' })))
      .then(() => model.addBars([{ boo: 'ccc' }, bar]))
      .then(() => model.bars)
      .then((res) => {
        assert.equal(res.length, 4);
        assert.equal(res[0] instanceof Bar, true);
        done();
      });
  });

  it('model.getBars() should return ActiveQuery with condition set', (done) => {
    model.getBars()
      .then((query) => {
        assert.equal(query.params.where._id.$in.length, 4);
        assert.equal(query instanceof ActiveQuery, true);
        done();
      });
  });

});
